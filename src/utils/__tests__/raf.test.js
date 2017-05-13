// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

jest.mock('global');

const { window } = require('global');

/* eslint-disable global-require */
describe('RAF utils', () => {
  describe('requestAnimationFrame()', () => {
    afterEach(() => window.setRafSupport(true));

    it('should call window.requestAnimationFrame', () => {
      window.setRafSupport(true);

      const rafUtils = require('../raf');

      const fn = jest.fn();

      rafUtils.requestAnimationFrame(fn);

      expect(window.requestAnimationFrame).toBeCalledWith(fn);
    });

    it('should call the function if RAF is not available', () => {
      window.setRafSupport(false);

      const rafUtils = require('../raf');

      const fn = jest.fn();

      rafUtils.requestAnimationFrame(fn);

      expect(fn).toBeCalled();
    });
  });

  describe('cancelAnimationFrame()', () => {
    afterEach(() => window.setRafSupport(true));

    it('should call window.cancelAnimationFrame', () => {
      window.setRafSupport(true);

      const rafUtils = require('../raf');

      const frame = 12345;

      rafUtils.cancelAnimationFrame(frame);

      expect(window.cancelAnimationFrame).toBeCalledWith(frame);
    });

    it('should call the function if RAF is not available', () => {
      window.setRafSupport(false);

      const rafUtils = require('../raf');

      const frame = 12345;

      expect(() => rafUtils.cancelAnimationFrame(frame)).not.toThrow();
    });
  });
});
/* eslint-enable global-require */
