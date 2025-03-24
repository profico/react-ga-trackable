import React, { useMemo } from 'react';

import { useTrackingCtx } from './TrackingContext';

type TrackableBaseValues = Record<string, any>;

type TrackableProps<
  GAType extends TrackableBaseValues = TrackableBaseValues
> = {
  children: React.ReactNode;
  ga?: GAType;
  component?: React.ReactElement | React.ElementType;
};

type MergedPropsType = {
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

function Trackable<GAType extends TrackableBaseValues = TrackableBaseValues>({
  component: ReplacementComponent,
  ga,
  children,
}: TrackableProps<GAType>) {
  const trackingCtx = useTrackingCtx();

  const { gaProps } = useMemo<MergedPropsType>(() => {
    if (!trackingCtx) {
      throw new Error(
        'Make sure you have wrapped your app with `TrackingProvider`.'
      );
    }

    const { gaPrefix, propNameConverter } = trackingCtx;

    const baseGaProps = ga || {};

    const trimmedGaPrefix = getTrimmedPrefix(gaPrefix);

    return {
      gaProps: reducePropsWithPrefix(
        baseGaProps,
        trimmedGaPrefix,
        propNameConverter
      ),
    };
  }, [ga, trackingCtx]);

  if (ReplacementComponent) {
    if (typeof ReplacementComponent === 'string') {
      return React.createElement(
        ReplacementComponent,
        {
          ...gaProps,
        },
        [children]
      );
    }

    if (!React.isValidElement(ReplacementComponent)) {
      return null;
    }

    return React.cloneElement(ReplacementComponent, {
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
            ...gaProps,
          });
        }

        return child;
      })}
    </>
  );
}

export default Trackable;
