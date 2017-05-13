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

describe('d3ForceUtils', () => {
  let forceSimulation;
  let d3ForceUtils;

  beforeAll(() => {
    jest.mock('d3-force');
    /* eslint-disable global-require */
    forceSimulation = require('d3-force').forceSimulation;
    d3ForceUtils = require('../d3-force');
    /* eslint-enable global-require */
  });

  afterAll(() => {
    jest.unmock('d3-force');
  });

  describe('nodeId()', () => {
    it('should return the id of a node', () => {
      expect(d3ForceUtils.nodeId({ id: '1', name: 'something' })).toEqual('1');
    });
  });

  describe('linkId()', () => {
    it('should return the id of a link with hydrated references', () => {
      expect(d3ForceUtils.linkId({
        source: { id: '1', name: 'something' },
        target: { id: '2', name: 'something-else' },
      })).toEqual('1=>2');
    });

    it('should return the id of a link with id references', () => {
      expect(d3ForceUtils.linkId({
        source: 'something',
        target: 'something-else',
      })).toEqual('something=>something-else');
    });
  });

  describe('asStrengthFn()', () => {
    it('should pass a function through', () => {
      const fn = jest.fn();
      expect(d3ForceUtils.asStrengthFn(fn)).toEqual(fn);
    });

    it('wraps non-functions in functions', () => {
      const val = 3;
      expect(d3ForceUtils.asStrengthFn(val)()).toEqual(val);
    });
  });

  describe('runSimulation()', () => {
    let simulation;

    beforeEach(() => {
      simulation = forceSimulation();
    });

    it('should call tick until it alpha reaches alphaMin', () => {
      d3ForceUtils.runSimulation(simulation);

      expect(simulation.restart).toHaveBeenCalled();
      expect(simulation.alpha()).toBeCloseTo(simulation.alphaMin());
      expect(simulation.tick.mock.calls.length).toEqual(100);
      expect(simulation.stop).toHaveBeenCalled();
    });
  });

  const defaultOptions = {
    height: 100,
    width: 100,
    data: {
      nodes: [
        { id: '1', radius: 5, meta: {} },
        { id: '2', radius: 5, meta: {} },
        { id: '3', radius: 5, meta: {} },
      ],
      links: [
        { source: '1', target: '2', value: 5, meta: {} },
        { source: '2', target: '3', value: 5, meta: {} },
        { source: '1', target: '3', value: 5, meta: {} },
        { source: '3', target: '1', value: 5, meta: {} },
      ],
    },
  };

  /* run the same set of tests against createSimulation() and updateSimulation(). */
  function testUpdateSimulation(testFn) {
    describe('options appliers', () => {
      it('should return the simulation', () => {
        expect(typeof testFn({ ...defaultOptions }).force).toEqual('function');
      });

      it('should apply the alpha props', () => {
        const simulation = testFn({
          ...defaultOptions,
          alpha: 1.5,
          alphaMin: 0.2,
          alphaDecay: 0.3,
          alphaTarget: 0.4,
          velocityDecay: 0.5,
        });

        expect(simulation.alpha).toBeCalledWith(1.5);
        expect(simulation.alphaMin).toBeCalledWith(0.2);
        expect(simulation.alphaDecay).toBeCalledWith(0.3);
        expect(simulation.alphaTarget).toBeCalledWith(0.4);
        expect(simulation.velocityDecay).toBeCalledWith(0.5);
      });

      it('should skip alpha functions that are not defined', () => {
        const simulation = testFn({
          ...defaultOptions,
          alpha: 1.5,
          alphaMin: 0.2,
          velocityDecay: 0.5,
        });

        expect(simulation.alphaDecay).not.toBeCalled();
        expect(simulation.alphaTarget).not.toBeCalled();
      });

      it('should apply the center force', () => {
        const simulation = testFn({ ...defaultOptions });

        expect(simulation.force('center').x()).toEqual(50);
        expect(simulation.force('center').y()).toEqual(50);
      });

      it('should not fail to apply the center force if width and height are omitted', () => {
        const simulation = testFn({ ...defaultOptions, width: null, height: null });

        expect(simulation.force('center').x()).toEqual(0);
        expect(simulation.force('center').y()).toEqual(0);
      });

      it('should apply the charge force', () => {
        expect(testFn({ ...defaultOptions }).force('charge')).not.toBeUndefined();
      });

      it('should use the strength function for charge if present', () => {
        const strengthFn = jest.fn();
        const simulation = testFn({
          ...defaultOptions,
          strength: {
            charge: strengthFn,
          },
        });

        expect(simulation.force('charge').strength()).toEqual(strengthFn);
      });

      it('should apply the charge force', () => {
        expect(testFn({ ...defaultOptions }).force('charge')).not.toBeUndefined();
      });

      it('should use the strength function for charge if present', () => {
        const strengthFn = jest.fn();
        const simulation = testFn({
          ...defaultOptions,
          strength: {
            charge: strengthFn,
          },
        });

        expect(simulation.force('charge').strength()).toEqual(strengthFn);
      });

      it('should apply the collide force', () => {
        expect(testFn({ ...defaultOptions }).force('collide')).not.toBeUndefined();
      });

      it('should set the radius function based on the radiusMargin', () => {
        const simulation = testFn({
          ...defaultOptions,
          radiusMargin: 10,
        });

        expect(simulation.force('collide').radius()({ radius: 10 })).toEqual(20);
      });

      it('should use the strength function for collide if present', () => {
        const strengthFn = jest.fn();
        const simulation = testFn({
          ...defaultOptions,
          strength: {
            collide: strengthFn.mockImplementation(() => 0.5),
          },
        });

        expect(simulation.force('collide').strength()).toEqual(0.5);
      });

      it('should apply the link force', () => {
        expect(testFn({ ...defaultOptions }).force('link')).not.toBeUndefined();
      });

      it('should set the nodes', () => {
        testFn({ ...defaultOptions }).nodes().forEach((node) => {
          expect(typeof node.id).toEqual('string');
          expect(typeof node.radius).toEqual('number');
          expect(typeof node.x).toEqual('number');
          expect(typeof node.y).toEqual('number');
          expect(node.meta).toBeUndefined();
        });
      });

      it('should allow nodeAttrs', () => {
        testFn({
          ...defaultOptions,
          nodeAttrs: ['meta'],
        }).nodes().forEach((node) => {
          expect(typeof node.meta).toEqual('object');
        });
      });

      it('should set the links', () => {
        testFn({ ...defaultOptions }).force('link').links().forEach((node) => {
          expect(typeof node.source.id).toEqual('string');
          expect(typeof node.source.x).toEqual('number');
          expect(typeof node.source.y).toEqual('number');
          expect(typeof node.target.id).toEqual('string');
          expect(typeof node.target.x).toEqual('number');
          expect(typeof node.target.y).toEqual('number');
          expect(typeof node.value).toEqual('number');
          expect(node.meta).toBeUndefined();
        });
      });

      it('should allow linkAttrs', () => {
        testFn({
          ...defaultOptions,
          linkAttrs: ['meta'],
        }).force('link').links().forEach((link) => {
          expect(typeof link.meta).toEqual('object');
        });
      });

      it('should apply the x axis force', () => {
        expect(testFn({ ...defaultOptions }).force('x')).not.toBeUndefined();
      });

      it('should use the strength function for x axis if present', () => {
        const strengthFn = jest.fn();
        const simulation = testFn({
          ...defaultOptions,
          strength: {
            x: strengthFn,
          },
        });

        expect(simulation.force('x').strength()).toEqual(strengthFn);
      });

      it('should apply the y axis force', () => {
        expect(testFn({ ...defaultOptions }).force('y')).not.toBeUndefined();
      });

      it('should use the strength function for x axis if present', () => {
        const strengthFn = jest.fn();
        const simulation = testFn({
          ...defaultOptions,
          strength: {
            y: strengthFn,
          },
        });

        expect(simulation.force('y').strength()).toEqual(strengthFn);
      });
    });
  }

  describe('createSimulation()', () => {
    it('should attach the strength object', () => {
      const simulation = d3ForceUtils.createSimulation({ ...defaultOptions });
      expect(typeof simulation.strength).toEqual('object');
    });

    testUpdateSimulation(
      options => d3ForceUtils.createSimulation({ ...defaultOptions, ...options })
    );
  });

  describe('updateSimulation()', () => {
    testUpdateSimulation(options =>
      d3ForceUtils.updateSimulation({ ...forceSimulation(), strength: {} }, options)
    );

    it('should run the simulation if animate is false', () => {
      const simulation = d3ForceUtils.updateSimulation({
        ...forceSimulation(),
        strength: {},
      }, {
        ...defaultOptions,
        animate: false,
      });

      expect(simulation.stop).toBeCalled();
    });

    it('should not run the simulation if animate is true', () => {
      const simulation = d3ForceUtils.updateSimulation({
        ...forceSimulation(),
        strength: {},
      }, {
        ...defaultOptions,
        animate: true,
      });

      expect(simulation.stop).not.toBeCalled();
    });

    it('should not run simulation for identical params', () => {
      let simulation = d3ForceUtils.createSimulation({ ...defaultOptions });

      simulation.stop.mockClear();

      simulation = d3ForceUtils.updateSimulation(simulation, {
        ...defaultOptions,
        animate: false,
      });

      expect(simulation.stop).not.toBeCalled();
    });

    it('should clear shouldRun', () => {
      let simulation = {
        ...forceSimulation(),
        strength: {},
      };

      simulation.shouldRun = true;

      simulation = d3ForceUtils.updateSimulation(simulation, {
        ...defaultOptions,
        strength: {
          collide: jest.fn(),
        },
      });

      expect(simulation.shouldRun).toEqual(null);
    });
  });
});
