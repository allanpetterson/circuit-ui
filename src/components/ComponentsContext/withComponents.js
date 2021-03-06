/**
 * Copyright 2019, SumUp Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';

import deprecate from '../../util/deprecate';
import { getDisplayName } from '../../util/get-display-name';

import useComponents from './useComponents';

/**
 * @deprecated
 *
 * Subscribe to the components context with a HOC.
 */
const withComponents = (Component) => {
  deprecate(
    [
      'The `withComponents` HOC has been deprecated.',
      'Use the `useComponents` hook instead.',
    ].join(' '),
  );
  function WrappedComponent(props) {
    const components = useComponents();
    return <Component {...props} components={components} />;
  }

  WrappedComponent.displayName = `withComponents(${getDisplayName(Component)})`;

  return WrappedComponent;
};

/**
 * @component
 */
export default withComponents;
