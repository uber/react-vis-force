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

import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import ZoomableSVGGroup, { ZOOMABLE_SVG_GROUP_EVENT_NAMES } from '../ZoomableSVGGroup';

describe('<ZoomableSVGGroup />', () => {
  describe('render', () => {
    it('sets the group styles', () => {
      const wrapper = shallow(
        <ZoomableSVGGroup width={100} height={100} style={{ backgroundColor: 'red' }}>
          <text>{'hello world'}</text>
        </ZoomableSVGGroup>
      );

      expect(wrapper.prop('style')).toEqual({
        transformOrigin: '0 0 0',
        cursor: 'default',
        pointerEvents: 'all',
        backgroundColor: 'red',
      });
    });

    it('transcludes children', () => {
      const children = <text>{'hello world'}</text>;
      const wrapper = shallow(
        <ZoomableSVGGroup width={100} height={100}>
          {children}
        </ZoomableSVGGroup>
      );

      expect(wrapper.containsMatchingElement(children)).toBe(true);
    });

    it('attaches event listeners for all event methods', () => {
      const eventFns = ZOOMABLE_SVG_GROUP_EVENT_NAMES.reduce((obj, eventName) => ({
        ...obj,
        [eventName]: jest.fn(),
      }), {});
      const wrapper = shallow(
        <ZoomableSVGGroup width={100} height={100} {...eventFns}>
          <text>{'hello world'}</text>
        </ZoomableSVGGroup>
      );

      ZOOMABLE_SVG_GROUP_EVENT_NAMES.forEach((eventName) => {
        const event = { clientX: 100 };
        sinon.stub(wrapper.instance(), eventName, noop => noop);
        wrapper.find('g').first().prop(eventName)(event);
        expect(wrapper.instance()[eventName].calledWith(event)).toBe(true);
        expect(eventFns[eventName]).toHaveBeenCalledWith(event);
        wrapper.instance()[eventName].restore();
      });
    });

    it('transforms the group', () => {
      const wrapper = shallow(
        <ZoomableSVGGroup width={100} height={100}>
          <text>{'hello world'}</text>
        </ZoomableSVGGroup>
      );

      wrapper.setState({ matrix: [2, 0, 0, 2, 0.5, 0.5] });

      expect(wrapper.find('g').first().prop('transform')).toContain(
        'matrix(2 0 0 2 0.5 0.5)'
      );
    });

    it('includes props.transform on the group', () => {
      const wrapper = shallow(
        <ZoomableSVGGroup transform="rotate(20deg)" width={100} height={100}>
          <text>{'hello world'}</text>
        </ZoomableSVGGroup>
      );

      expect(wrapper.find('g').first().prop('transform')).toContain(
        'rotate(20deg)'
      );
    });

    it('creates the clipping rectangle', () => {
      const wrapper = shallow(
        <ZoomableSVGGroup width={100} height={100}>
          <text>{'hello world'}</text>
        </ZoomableSVGGroup>
      );

      wrapper.setState({ scale: 4, matrix: [2, 0, 0, 2, 0.5, -0.5] });

      const rect = wrapper.find('rect').first();

      expect(rect.prop('x')).toBe(-0.5);
      expect(rect.prop('y')).toBe(0.5);
      expect(rect.prop('transform')).toBe('scale(0.25)');
      expect(rect.prop('fillOpacity')).toBe(0);
      expect(rect.prop('height')).toBe(100);
      expect(rect.prop('width')).toBe(100);
    });

    it('does not attach the styles or the events for disabled', () => {
      const eventFns = ZOOMABLE_SVG_GROUP_EVENT_NAMES.reduce((obj, eventName) => ({
        ...obj,
        [eventName]: jest.fn(),
      }), {});
      const wrapper = shallow(
        <ZoomableSVGGroup
          width={100}
          height={100}
          disabled
          transform="skewX(20deg)"
          style={{ backgroundColor: 'red' }}
          {...eventFns}
        >
          <text>{'hello world'}</text>
        </ZoomableSVGGroup>
      );

      expect(wrapper.prop('transform')).toBe('skewX(20deg)');

      ZOOMABLE_SVG_GROUP_EVENT_NAMES.forEach((eventName) => {
        const event = { clientX: 100 };
        sinon.stub(wrapper.instance(), eventName, noop => noop);
        wrapper.find('g').first().prop(eventName)(event);
        wrapper.prop(eventName)(event);
        expect(wrapper.instance()[eventName].called).toBe(false);
        expect(eventFns[eventName]).toHaveBeenCalledWith(event);
        wrapper.instance()[eventName].restore();
      });
    });
  });

  describe('static methods', () => {
    describe('isValidMatrix()', () => {
      it('should return true for an array of 6 numbers', () => {
        expect(ZoomableSVGGroup.isValidMatrix([0, 1, 2, 3, 4, 5])).toBe(true);
      });

      it('should return false if the length is wrong', () => {
        expect(ZoomableSVGGroup.isValidMatrix([0, 1, 2, 3, 4, 5, 6])).toBe(false);
        expect(ZoomableSVGGroup.isValidMatrix([0, 1, 2, 3, 4])).toBe(false);
      });

      it('should return false if any member is not a number', () => {
        expect(ZoomableSVGGroup.isValidMatrix([0, 1, 2, '3', 4, 5])).toBe(false);
        expect(ZoomableSVGGroup.isValidMatrix(['0', 1, 2, 3, 4, 5])).toBe(false);
        expect(ZoomableSVGGroup.isValidMatrix([0, 1, 2, 3, 4, '5'])).toBe(false);
      });
    });

    describe('getPinchZoomLength()', () => {
      it('should return the pinch zoom length based on the fingerEvents', () => {
        const finger1 = { clientX: 100, clientY: 100 };
        const finger2 = { clientX: 120, clientY: 120 };

        // 400 + 400
        expect(ZoomableSVGGroup.getPinchZoomLength(finger1, finger2)).toBe(800);
      });
    });

    describe('getTouchClientValues()', () => {
      it('should average two touches together for multitouch', () => {
        expect(ZoomableSVGGroup.getTouchClientValues({
          touches: [{
            clientX: 100,
            clientY: 100,
          }, {
            clientX: 120,
            clientY: 150,
          }, {
            clientX: 190,
            clientY: 200,
          }],
        })).toEqual({
          clientX: 110,
          clientY: 125,
        });
      });

      it('should return the touch for single touch', () => {
        expect(ZoomableSVGGroup.getTouchClientValues({
          touches: [{
            clientX: 100,
            clientY: 100,
          }],
        })).toEqual({
          clientX: 100,
          clientY: 100,
        });
      });
    });
  });

  describe('lifecycle methods', () => {
    describe('componentDidMount()', () => {
      it('calls setInitialMatrix()', () => {
        const wrapper = shallow(<ZoomableSVGGroup height={100} width={100} />);

        sinon.stub(wrapper.instance(), 'setInitialMatrix', noop => noop);

        wrapper.instance().componentDidMount();

        expect(wrapper.instance().setInitialMatrix.called).toBe(true);

        wrapper.instance().setInitialMatrix.restore();
      });
    });
  });

  describe('instance methods', () => {
    function createSvgMock(matrix = [1, 0, 0, 1, 0, 0]) {
      return {
        ownerSVGElement: {
          createSVGTransform: jest.fn(() => ({
            matrix: {
              a: matrix[0],
              b: matrix[1],
              c: matrix[2],
              d: matrix[3],
              e: matrix[4],
              f: matrix[5],
            },
          })),
        },
      };
    }

    describe('setInitialMatrix()', () => {
      it('sets scale at 1', () => {
        const wrapper = shallow(<ZoomableSVGGroup height={100} width={100} />);

        wrapper.setState({ scale: 4 });

        wrapper.instance().el = createSvgMock();
        wrapper.instance().setInitialMatrix();

        expect(wrapper.state('scale')).toBe(1);
      });

      it('sets matrix from the SVG transform', () => {
        const wrapper = shallow(<ZoomableSVGGroup height={100} width={100} />);

        wrapper.setState({ scale: 4 });

        wrapper.instance().el = createSvgMock([0, 1, 2, 3, 4, 5]);
        wrapper.instance().setInitialMatrix();

        expect(wrapper.state('matrix')).toEqual([0, 1, 2, 3, 4, 5]);
      });
    });

    describe('getScaleMultiplier()', () => {
      it('returns a fraction for positive deltas', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);

        expect(wrapper.instance().getScaleMultiplier(5)).toBe(0.9);
      });

      it('returns a greater-than-one value for positive deltas', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);

        expect(wrapper.instance().getScaleMultiplier(-5)).toBe(1.1);
      });

      it('returns 1 for unchanged zooms', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);

        expect(wrapper.instance().getScaleMultiplier(0)).toBe(1);
      });
    });

    describe('zoomTo()', () => {

    });

    describe('panBy()', () => {

    });

    describe('onMouseDown()', () => {

    });

    describe('onMouseMove()', () => {
      it('should call panBy if dragging', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        sinon.stub(wrapper.instance(), 'panBy', noop => noop);
        wrapper.setState({ dragging: true });
        wrapper.instance().onMouseMove({ clientX: 100, clientY: 120 });
        expect(wrapper.instance().panBy.calledWith(100, 120)).toBe(true);
        wrapper.instance().panBy.restore();
      });

      it('should not call panBy if not dragging', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        sinon.stub(wrapper.instance(), 'panBy', noop => noop);
        wrapper.setState({ dragging: false });
        wrapper.instance().onMouseMove({ clientX: 100, clientY: 120 });
        expect(wrapper.instance().panBy.called).toBe(false);
        wrapper.instance().panBy.restore();
      });

      it('calls event.stopPropagation() if touching', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        const event = { stopPropagation: jest.fn() };
        wrapper.setState({ touching: true });
        wrapper.instance().onMouseUp(event);
        expect(event.stopPropagation).toHaveBeenCalled();
      });
    });

    describe('onMouseUp()', () => {
      it('sets dragging to false if not touching', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        wrapper.setState({ touching: false, dragging: true });
        wrapper.instance().onMouseUp();
        expect(wrapper.state('touching')).toBe(false);
      });

      it('sets dragX and dragY to null if not touching', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        wrapper.setState({ touching: false, dragX: 100, dragY: 100 });
        wrapper.instance().onMouseUp();
        expect(wrapper.state('dragX')).toBe(null);
        expect(wrapper.state('dragY')).toBe(null);
      });

      it('calls event.stopPropagation() if touching', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        const event = { stopPropagation: jest.fn() };
        wrapper.setState({ touching: true });
        wrapper.instance().onMouseUp(event);
        expect(event.stopPropagation).toHaveBeenCalled();
      });
    });

    describe('onTouchCancel()', () => {
      it('sets touching to false', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        wrapper.setState({ touching: true });
        wrapper.instance().onTouchCancel();
        expect(wrapper.state('touching')).toBe(false);
      });

      it('sets dragging to false', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        wrapper.setState({ dragging: true });
        wrapper.instance().onTouchCancel();
        expect(wrapper.state('dragging')).toBe(false);
      });

      it('sets pinchLength to null', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        wrapper.setState({ pinchLength: 100 });
        wrapper.instance().onTouchCancel();
        expect(wrapper.state('pinchLength')).toBe(null);
      });

      it('sets dragX and dragY to null', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        wrapper.setState({ dragX: 100, dragY: 100 });
        wrapper.instance().onTouchCancel();
        expect(wrapper.state('dragX')).toBe(null);
        expect(wrapper.state('dragY')).toBe(null);
      });
    });

    describe('onTouchEnd()', () => {
      it('calls onTouchCancel()', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        sinon.stub(wrapper.instance(), 'onTouchCancel', noop => noop);
        wrapper.instance().onTouchEnd();
        expect(wrapper.instance().onTouchCancel.called).toBe(true);
        wrapper.instance().onTouchCancel.restore();
      });
    });

    describe('onTouchMove()', () => {

    });

    describe('onTouchStart()', () => {
      let touchClientX;
      let touchClientY;

      beforeEach(() => {
        sinon.stub(ZoomableSVGGroup, 'getTouchClientValues', () => ({
          clientX: touchClientX,
          clientY: touchClientY,
        }));
      });

      afterEach(() => {
        ZoomableSVGGroup.getTouchClientValues.restore();
      });

      it('sets touching to true', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        const event = {};
        wrapper.instance().onTouchStart(event);
        expect(wrapper.state('touching')).toBe(true);
      });

      it('sets pinchLength to 0', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        const event = {};
        wrapper.instance().onTouchStart(event);
        expect(wrapper.state('pinchLength')).toBe(0);
      });

      it('sets dragX and dragY based on touch client values from the event', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        const event = {};
        touchClientX = 100;
        touchClientY = 120;
        wrapper.instance().onTouchStart(event);
        expect(ZoomableSVGGroup.getTouchClientValues.calledWith(event)).toBe(true);
        expect(wrapper.state('dragX')).toBe(100);
        expect(wrapper.state('dragY')).toBe(120);
      });
    });

    describe('onWheel()', () => {
      it('zooms if the scaleMultiplier is less than 1', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        const event = { clientX: 100, clientY: 120, deltaY: 20, preventDefault: jest.fn() };
        sinon.stub(wrapper.instance(), 'getScaleMultiplier', () => -0.9);
        sinon.stub(wrapper.instance(), 'zoomTo', noop => noop);
        wrapper.instance().onWheel(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(wrapper.instance().zoomTo.calledWith(100, 120, -0.9, event)).toBe(true);
      });

      it('zooms if the scaleMultiplier is greater than 1', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        const event = { clientX: 100, clientY: 120, deltaY: 20, preventDefault: jest.fn() };
        sinon.stub(wrapper.instance(), 'getScaleMultiplier', () => 1.1);
        sinon.stub(wrapper.instance(), 'zoomTo', noop => noop);
        wrapper.instance().onWheel(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(wrapper.instance().zoomTo.calledWith(100, 120, 1.1, event)).toBe(true);
      });

      it('doess not zoom if the scaleMultiplier is 1', () => {
        const wrapper = shallow(<ZoomableSVGGroup zoomSpeed={0.1} height={100} width={100} />);
        const event = { clientX: 100, clientY: 120, deltaY: 20, preventDefault: jest.fn() };
        sinon.stub(wrapper.instance(), 'getScaleMultiplier', () => 1);
        sinon.stub(wrapper.instance(), 'zoomTo', noop => noop);
        wrapper.instance().onWheel(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(wrapper.instance().zoomTo.called).toBe(false);
      });
    });
  });
});
