/**
 * Copyright 2020, SumUp Ltd.
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

import { MouseEvent } from 'react';

import { renderHook, actHook } from '../../util/test-utils';

import { useCollapsible, getHeight } from './useCollapsible';

describe('useCollapsible', () => {
  it('should return the open state and a toggle callback', () => {
    const { result } = renderHook(() => useCollapsible());
    const { isOpen, toggleOpen } = result.current;

    expect(isOpen).toBeFalsy();
    expect(typeof toggleOpen).toBe('function');
  });

  it('should accept an initial state', () => {
    const initialOpen = true;
    const { result } = renderHook(() => useCollapsible({ initialOpen }));
    const { isOpen } = result.current;

    expect(isOpen).toBeTruthy();
  });

  it('should accept a custom id', () => {
    const detailId = 'foo';
    const { result } = renderHook(() => useCollapsible({ detailId }));
    const { getButtonProps, getContentProps } = result.current;

    const buttonProps = getButtonProps();
    const contentProps = getContentProps();

    expect(buttonProps['aria-controls']).toBe(detailId);
    expect(contentProps.id).toBe(detailId);
  });

  it('should forward additional props to the button element', () => {
    const customProps = { onClick: jest.fn(), tabIndex: -1, foo: 'bar' };
    const event = ({ target: '' } as unknown) as MouseEvent<HTMLElement>;
    const { result } = renderHook(() => useCollapsible());
    const { getButtonProps } = result.current;

    const actual = getButtonProps(customProps);
    const expected = expect.objectContaining({
      tabIndex: -1,
      foo: 'bar',
    });

    expect(actual).toEqual(expected);

    actHook(() => {
      actual.onClick(event);
    });

    expect(customProps.onClick).toHaveBeenCalledTimes(1);
    expect(customProps.onClick).toHaveBeenCalledWith(event);
  });

  it('should forward additional props to the content element', () => {
    const customProps = { style: { color: 'red' }, foo: 'bar' };
    const { result } = renderHook(() => useCollapsible());
    const { getButtonProps } = result.current;

    const actual = getButtonProps(customProps);
    const expected = expect.objectContaining({
      style: expect.objectContaining({ color: 'red' }),
      foo: 'bar',
    });

    expect(actual).toEqual(expected);
  });

  describe('when closed', () => {
    const initialOpen = false;

    it('should return a getter for the button props', () => {
      const { result } = renderHook(() => useCollapsible({ initialOpen }));
      const { getButtonProps } = result.current;

      const actual = getButtonProps();
      const expected = expect.objectContaining({
        'type': 'button',
        'role': 'button',
        'onClick': expect.any(Function),
        'tabIndex': 0,
        'aria-controls': expect.any(String),
        'aria-expanded': 'false',
      });

      expect(actual).toEqual(expected);
    });

    it('should return a getter for the content props', () => {
      const { result } = renderHook(() => useCollapsible({ initialOpen }));
      const { getContentProps } = result.current;

      const actual = getContentProps();
      const expected = expect.objectContaining({
        'ref': { current: null },
        'id': expect.any(String),
        'style': {
          overflow: 'hidden',
          willChange: 'height',
          opacity: 0,
          height: 0,
        },
        'aria-hidden': 'true',
      });

      expect(actual).toEqual(expected);
    });
  });

  describe('when open', () => {
    const initialOpen = true;

    it('should return a getter for the button props', () => {
      const { result } = renderHook(() => useCollapsible({ initialOpen }));
      const { getButtonProps } = result.current;

      const actual = getButtonProps();
      const expected = expect.objectContaining({
        'type': 'button',
        'role': 'button',
        'onClick': expect.any(Function),
        'tabIndex': 0,
        'aria-controls': expect.any(String),
        'aria-expanded': 'true',
      });

      expect(actual).toEqual(expected);
    });

    it('should return a getter for the content props', () => {
      const { result } = renderHook(() => useCollapsible({ initialOpen }));
      const { getContentProps } = result.current;

      const actual = getContentProps();
      const expected = expect.objectContaining({
        'ref': { current: null },
        'id': expect.any(String),
        'style': {
          overflow: 'hidden',
          willChange: 'height',
          opacity: 1,
          height: 'auto',
        },
        'aria-hidden': undefined,
      });

      expect(actual).toEqual(expected);
    });
  });

  describe('toggling', () => {
    it('should toggle the open state when the button is clicked', () => {
      const event = ({ target: '' } as unknown) as MouseEvent<HTMLElement>;

      const { result } = renderHook(() => useCollapsible());
      const { getButtonProps } = result.current;

      expect(result.current.isOpen).toBeFalsy();

      actHook(() => {
        getButtonProps().onClick(event);
      });

      expect(result.current.isOpen).toBeTruthy();
    });

    it('should toggle the open state when the callback is called', () => {
      const { result } = renderHook(() => useCollapsible());

      expect(result.current.isOpen).toBeFalsy();

      actHook(() => {
        result.current.toggleOpen();
      });

      expect(result.current.isOpen).toBeTruthy();
    });
  });

  describe('getHeight', () => {
    it('should return "auto" when the element is falsy', () => {
      const actual = getHeight(null);
      const expected = 'auto';
      expect(actual).toBe(expected);
    });

    it('should return the scroll height in pixels for the element', () => {
      const element = { scrollHeight: 20 } as HTMLElement;
      const actual = getHeight(element);
      const expected = '20px';
      expect(actual).toBe(expected);
    });
  });
});