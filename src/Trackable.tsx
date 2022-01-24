import React, { useMemo } from 'react';

import { useTrackingCtx } from './TrackingContext';

type TrackableBaseValues = Record<string, any>;

type TrackableProps<
  UAType extends TrackableBaseValues = TrackableBaseValues,
  GAType extends TrackableBaseValues = TrackableBaseValues
> = {
  children: React.ReactNode;
  ua?: UAType;
  ga?: GAType;
  component?: React.ReactElement | React.ElementType;
};

type MergedPropsType = {
  uaProps: TrackableBaseValues;
  gaProps: TrackableBaseValues;
};

const getTrimmedPrefix = (prefix?: string) =>
  prefix && !prefix.endsWith('-') ? `${prefix}-` : '';

const reducePropsWithPrefix = (
  props: TrackableBaseValues,
  prefix: string,
  propNameConverter: (prop: string) => string
): Record<string, any> =>
  Object.entries(props).reduce(
    (prev, [key, value]) => ({
      ...prev,
      [`data-${prefix}${propNameConverter(key)}`]: value,
    }),
    {}
  );

function Trackable<
  UAType extends TrackableBaseValues = TrackableBaseValues,
  GAType extends TrackableBaseValues = TrackableBaseValues
>({
  component: ReplacementComponent,
  ga,
  ua,
  children,
}: TrackableProps<UAType, GAType>) {
  const trackingCtx = useTrackingCtx();

  const { uaProps, gaProps } = useMemo<MergedPropsType>(() => {
    if (!trackingCtx) {
      throw new Error(
        'Make sure you have wrapped your app with `TrackingProvider`.'
      );
    }

    const { uaPrefix, gaPrefix, propNameConverter } = trackingCtx;

    const baseUaProps = ua || {};
    const baseGaProps = ga || {};

    const trimmedUaPrefix = getTrimmedPrefix(uaPrefix);
    const trimmedGaPrefix = getTrimmedPrefix(gaPrefix);

    return {
      uaProps: reducePropsWithPrefix(
        baseUaProps,
        trimmedUaPrefix,
        propNameConverter
      ),
      gaProps: reducePropsWithPrefix(
        baseGaProps,
        trimmedGaPrefix,
        propNameConverter
      ),
    };
  }, [ua, ga, trackingCtx]);

  if (ReplacementComponent) {
    if (typeof ReplacementComponent === 'string') {
      return React.createElement(
        ReplacementComponent,
        {
          ...uaProps,
          ...gaProps,
        },
        [children]
      );
    }

    if (!React.isValidElement(ReplacementComponent)) {
      return null;
    }

    return React.cloneElement(ReplacementComponent, {
      ...uaProps,
      ...gaProps,
    });
  }

  return (
    <>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        if (index === 0) {
          return React.cloneElement(child, {
            ...uaProps,
            ...gaProps,
          });
        }

        return child;
      })}
    </>
  );
}

export default Trackable;
