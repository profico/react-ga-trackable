import React, { createContext, useContext } from 'react';

interface TrackingContextValues {
  propNameConverter: (prop: string) => string;
  gaPrefix: string;
}

type TrackingProviderProps = Partial<TrackingContextValues>;

/**
 * @author b4dnewz <https://gist.github.com/b4dnewz>
 * @link https://gist.github.com/thevangelist/8ff91bac947018c9f3bfaad6487fa149#gistcomment-2659294
 */
const kebabize = (str: string) =>
  str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

const TrackingContext = createContext<TrackingContextValues>({
  gaPrefix: '',
  propNameConverter: kebabize,
});

export const useTrackingCtx = () => useContext(TrackingContext);

export const TrackingProvider: React.FC<TrackingProviderProps> = ({
  children,
  gaPrefix = '',
  propNameConverter = kebabize,
}) => (
  <TrackingContext.Provider value={{ gaPrefix, propNameConverter }}>
    {children}
  </TrackingContext.Provider>
);
