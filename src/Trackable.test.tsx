import React from 'react';
import ReactDOM from 'react-dom';

import Trackable from './Trackable';

import { TrackingProvider } from './TrackingContext';

const getRequiredAttributesDict = (prefix: string) => ({
  [`data-${prefix}-regular`]: `Regular ${prefix.toUpperCase()} prop`,
  [`data-${prefix}-camel-case`]: `Camel case ${prefix.toUpperCase()} prop`,
  [`data-${prefix}-snake-case`]: `Snake case ${prefix.toUpperCase()} prop`,
  [`data-${prefix}-kebab-case`]: `Kebab case ${prefix.toUpperCase()} prop`,
});

describe('Trackable [component] ->', () => {
  let rootEl: HTMLDivElement;

  beforeEach(() => {
    rootEl = document.createElement('div');
  });

  afterEach(() => {
    rootEl.remove();
  });

  // it('should render without crashing (without children)', () => {
  //   ReactDOM.render(
  //     <TrackingProvider>
  //       <Trackable />
  //     </TrackingProvider>,
  //     rootEl
  //   );

  //   ReactDOM.unmountComponentAtNode(rootEl);
  // });

  it('should render without crashing (with children)', () => {
    ReactDOM.render(
      <TrackingProvider>
        <Trackable>
          <div>Hey there</div>
        </Trackable>
      </TrackingProvider>,
      rootEl
    );

    const [element] = Array.from(rootEl.children);

    expect(element.textContent).toBe('Hey there');
    expect(element.getAttributeNames().length).toBe(0);

    ReactDOM.unmountComponentAtNode(rootEl);
  });

  it('should pass down the Universal Analytics props (with no prefix)', () => {
    ReactDOM.render(
      <TrackingProvider>
        <Trackable ua={{ name: 'Name prop' }}>
          <div>Universal Analytics</div>
        </Trackable>
      </TrackingProvider>,
      rootEl
    );

    const [element] = Array.from(rootEl.children);
    const attributeNames = element.getAttributeNames();

    expect(attributeNames.includes('data-name')).toBe(true);
    expect(element.getAttribute('data-name')).toBe('Name prop');

    ReactDOM.unmountComponentAtNode(rootEl);
  });

  it('should pass down the Google Analytics props (with no prefix)', () => {
    ReactDOM.render(
      <TrackingProvider>
        <Trackable ga={{ name: 'Name prop' }}>
          <div>Google Analytics</div>
        </Trackable>
      </TrackingProvider>,
      rootEl
    );

    const [element] = Array.from(rootEl.children);
    const attributeNames = element.getAttributeNames();

    expect(attributeNames.includes('data-name')).toBe(true);
    expect(element.getAttribute('data-name')).toBe('Name prop');

    ReactDOM.unmountComponentAtNode(rootEl);
  });

  it('should pass down both Google and Universal Analytics props (with no prefix)', () => {
    ReactDOM.render(
      <TrackingProvider>
        <Trackable ga={{ google: 'Newer' }} ua={{ universal: 'Older' }}>
          <div>Google and Universal Analytics</div>
        </Trackable>
      </TrackingProvider>,
      rootEl
    );

    const [element] = Array.from(rootEl.children);
    const attributeNames = element.getAttributeNames();

    expect(attributeNames.includes('data-google')).toBe(true);
    expect(attributeNames.includes('data-universal')).toBe(true);
    expect(element.getAttribute('data-google')).toBe('Newer');
    expect(element.getAttribute('data-universal')).toBe('Older');

    ReactDOM.unmountComponentAtNode(rootEl);
  });

  it('should pass down the Universal Analytics props (with `ua` prefix)', () => {
    ReactDOM.render(
      <TrackingProvider uaPrefix="ua">
        <Trackable ua={{ name: 'Name prop' }}>
          <div>Universal Analytics</div>
        </Trackable>
      </TrackingProvider>,
      rootEl
    );

    const [element] = Array.from(rootEl.children);
    const attributeNames = element.getAttributeNames();

    expect(attributeNames.includes('data-ua-name')).toBe(true);
    expect(element.getAttribute('data-ua-name')).toBe('Name prop');

    ReactDOM.unmountComponentAtNode(rootEl);
  });

  it('should pass down the Google Analytics props (with `ga` prefix)', () => {
    ReactDOM.render(
      <TrackingProvider gaPrefix="ga">
        <Trackable ga={{ name: 'Name prop' }}>
          <div>Google Analytics</div>
        </Trackable>
      </TrackingProvider>,
      rootEl
    );

    const [element] = Array.from(rootEl.children);
    const attributeNames = element.getAttributeNames();

    expect(attributeNames.includes('data-ga-name')).toBe(true);
    expect(element.getAttribute('data-ga-name')).toBe('Name prop');

    ReactDOM.unmountComponentAtNode(rootEl);
  });

  it('should pass down the Universal Analytics props (with `ua` prefix and different naming conventions)', () => {
    const uaPrefix = 'ua';
    const requiredAttributesDict = getRequiredAttributesDict(uaPrefix);

    ReactDOM.render(
      <TrackingProvider uaPrefix={uaPrefix}>
        <Trackable
          ua={{
            regular: requiredAttributesDict['data-ua-regular'],
            camelCase: requiredAttributesDict['data-ua-camel-case'],
            snake_case: requiredAttributesDict['data-ua-snake-case'],
            'kebab-case': requiredAttributesDict['data-ua-kebab-case'],
          }}
        >
          <div>Universal Analytics</div>
        </Trackable>
      </TrackingProvider>,
      rootEl
    );

    const [element] = Array.from(rootEl.children);
    const attributeNames = element.getAttributeNames();

    expect(
      Object.keys(requiredAttributesDict).every(propName =>
        attributeNames.includes(propName)
      )
    ).toBe(true);
    expect(
      Object.entries(requiredAttributesDict).every(
        ([propName, value]) => element.getAttribute(propName) === value
      )
    ).toBe(true);

    ReactDOM.unmountComponentAtNode(rootEl);
  });

  it('should pass down the Google Analytics props (with `ga` prefix and different naming conventions)', () => {
    const gaPrefix = 'ga';
    const requiredAttributesDict = getRequiredAttributesDict(gaPrefix);

    ReactDOM.render(
      <TrackingProvider gaPrefix={gaPrefix}>
        <Trackable
          ga={{
            regular: requiredAttributesDict['data-ga-regular'],
            camelCase: requiredAttributesDict['data-ga-camel-case'],
            snake_case: requiredAttributesDict['data-ga-snake-case'],
            'kebab-case': requiredAttributesDict['data-ga-kebab-case'],
          }}
        >
          <div>Google Analytics</div>
        </Trackable>
      </TrackingProvider>,
      rootEl
    );

    const [element] = Array.from(rootEl.children);
    const attributeNames = element.getAttributeNames();

    expect(
      Object.keys(requiredAttributesDict).every(propName =>
        attributeNames.includes(propName)
      )
    ).toBe(true);
    expect(
      Object.entries(requiredAttributesDict).every(
        ([propName, value]) => element.getAttribute(propName) === value
      )
    ).toBe(true);

    ReactDOM.unmountComponentAtNode(rootEl);
  });

  it('should render a replacement (string) component when the `component` prop is provided', () => {
    ReactDOM.render(
      <TrackingProvider>
        <Trackable component="span">Hey there</Trackable>
      </TrackingProvider>,
      rootEl
    );

    const [element] = Array.from(rootEl.children);

    expect(element.tagName).toBe('SPAN');
    expect(element.innerHTML).toBe('Hey there');
  });

  it('should render a replacement (Function Component) component when the `component` prop is provided', () => {
    const handleReplacementComponentClick = jest.fn();

    const ReplacementComponent: React.FC = () => (
      <button type="button" onClick={handleReplacementComponentClick}>
        Click me
      </button>
    );

    ReactDOM.render(
      <TrackingProvider>
        <Trackable component={<ReplacementComponent />}>Hey there</Trackable>
      </TrackingProvider>,
      rootEl
    );

    const [element] = Array.from(rootEl.children) as HTMLElement[];

    expect(element.tagName).toBe('BUTTON');
    expect(element.innerHTML).toBe('Click me');

    element.click();
    expect(handleReplacementComponentClick).toBeCalled();
    expect(handleReplacementComponentClick).toBeCalledTimes(1);
  });
});
