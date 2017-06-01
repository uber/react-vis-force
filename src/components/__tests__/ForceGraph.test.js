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

import ForceGraphNode from '../ForceGraphNode';
import ForceGraphLink from '../ForceGraphLink';
import ZoomableSVGGroup from '../ZoomableSVGGroup';

const defaultProps = {};

describe('<ForceGraph />', () => {
  let ForceGraph;

  beforeAll(() => {
    jest.mock('d3-force');
    jest.mock('../../utils/raf');

    /* eslint-disable global-require */
    ForceGraph = require('../ForceGraph').default;
    /* eslint-enable global-require */
  });

  afterAll(() => {
    jest.unmock('d3-force');
    jest.unmock('../../utils/raf');
  });

  describe('render', () => {
    it('renders an <svg />', () => {
      const wrapper = shallow(<ForceGraph {...defaultProps} />);

      expect(wrapper.type()).toEqual('svg');
    });

    it('uses provided height and width', () => {
      const wrapper = shallow(
        <ForceGraph simulationOptions={{ height: 100, width: 100 }} {...defaultProps}>
          <div className="my-static-element" />
          <div className="my-zoomable-element" zoomable />
        </ForceGraph>
      );

      expect(wrapper.prop('height')).toBe(100);
      expect(wrapper.prop('width')).toBe(100);
    });

    it('provides default simulation dimensions', () => {
      const wrapper = shallow(
        <ForceGraph {...defaultProps} simulationOptions={{ strength: {} }}>
          <div className="my-static-element" />
          <div className="my-zoomable-element" zoomable />
        </ForceGraph>
      );

      expect(typeof wrapper.prop('height')).toBe('number');
      expect(typeof wrapper.prop('width')).toBe('number');
    });

    it('renders static and zoomable children through for zoom', () => {
      const wrapper = shallow(
        <ForceGraph {...defaultProps} zoom>
          <div className="my-static-element" />
          <div className="my-zoomable-element" zoomable />
        </ForceGraph>
      );

      expect(wrapper.find('.rv-force__static-elements').first().children().length).toEqual(1);
      expect(wrapper.find('.rv-force__zoomable-elements').first().children().length).toEqual(1);
    });

    it('renders static children through for non-zoom', () => {
      const wrapper = shallow(
        <ForceGraph {...defaultProps}>
          <div className="my-static-element" />
          <div className="my-zoomable-element" zoomable />
        </ForceGraph>
      );

      expect(wrapper.find('.rv-force__static-elements').first().children().length).toEqual(2);
      expect(wrapper.find('.rv-force__zoomable-elements').first().children().length).toEqual(0);
    });

    it('renders individual labels', () => {
      const wrapper = shallow(
        <ForceGraph {...defaultProps}>
          <ForceGraphNode key="1" node={{ id: '1' }} />
          <ForceGraphNode showLabel key="2" node={{ id: '2' }} />
          <ForceGraphLink key="1=>2" link={{ source: '1', target: '2' }} />
        </ForceGraph>
      );

      wrapper.setState({
        nodePositions: ForceGraph.getNodePositions(wrapper.instance().simulation),
        linkPositions: ForceGraph.getLinkPositions(wrapper.instance().simulation),
      });

      expect(wrapper.find('.rv-force__label').length).toEqual(1);
    });

    it('renders all labels for showLabels', () => {
      const wrapper = shallow(
        <ForceGraph {...defaultProps} showLabels>
          <ForceGraphNode key="1" node={{ id: '1' }} />
          <ForceGraphNode key="2" node={{ id: '2' }} />
          <ForceGraphLink key="1=>2" link={{ source: '1', target: '2' }} />
        </ForceGraph>
      );

      wrapper.setState({
        nodePositions: ForceGraph.getNodePositions(wrapper.instance().simulation),
        linkPositions: ForceGraph.getLinkPositions(wrapper.instance().simulation),
      });

      expect(wrapper.find('.rv-force__label').length).toEqual(2);
    });

    it('applies labelOffsets, labelClass, and labelStyle', () => {
      const wrapper = shallow(
        <ForceGraph
          {...defaultProps}
          labelOffset={{
            x: ({ radius = 5 }) => 10 + radius,
            y: () => -10,
          }}
        >
          <ForceGraphNode
            showLabel
            key="1"
            node={{ id: '1', fx: 25, fy: 25 }}
            labelStyle={{ fontSize: 12, color: '#444' }}
            labelClass="my-custom-class"
          />
        </ForceGraph>
      );

      wrapper.setState({
        nodePositions: ForceGraph.getNodePositions(wrapper.instance().simulation),
        linkPositions: ForceGraph.getLinkPositions(wrapper.instance().simulation),
      });

      const label = wrapper.find('.rv-force__label').first();

      expect(label.prop('x')).toEqual(40);
      expect(label.prop('y')).toEqual(15);
      expect(label.prop('fontSize')).toEqual(12);
      expect(label.prop('style')).toEqual({ color: '#444' });
      expect(label.prop('className')).toContain('my-custom-class');
    });

    it('scales label fontSizes', () => {
      const wrapper = shallow(
        <ForceGraph {...defaultProps}>
          <ForceGraphNode
            showLabel
            key="1"
            node={{ id: '1', fx: 25, fy: 25 }}
            labelStyle={{ fontSize: 12, color: '#444' }}
          />
        </ForceGraph>
      );

      wrapper.setState({
        nodePositions: ForceGraph.getNodePositions(wrapper.instance().simulation),
        linkPositions: ForceGraph.getLinkPositions(wrapper.instance().simulation),
        scale: 2,
      });

      expect(wrapper.find('.rv-force__label').first().prop('fontSize')).toEqual(6);
    });

    it('calls this.onZoom for ZoomableSVGGroup zooms', () => {
      const wrapper = shallow(<ForceGraph {...defaultProps} zoom />);
      const zoomableSVGGroup = wrapper.find(ZoomableSVGGroup).first();

      sinon.stub(wrapper.instance(), 'onZoom', noop => noop);
      zoomableSVGGroup.prop('onZoom')({}, 4);

      expect(wrapper.instance().onZoom.calledWith({}, 4)).toBe(true);

      wrapper.instance().onZoom.restore();
    });
  });

  describe('static methods', () => {
    let forceLink;
    let forceSimulation;

    beforeAll(() => {
      /* eslint-disable global-require */
      forceLink = require('d3-force').forceLink;
      forceSimulation = require('d3-force').forceSimulation;
      /* eslint-enable global-require */
    });

    describe('ForceGraph.getDataFromChildren', () => {
      it('builds a data object based on children', () => {
        const data = ForceGraph.getDataFromChildren([
          <div className="my-static-element" />,
          <div className="my- zoomable-element" zoomable />,
          <ForceGraphNode node={{ id: '1' }} />,
          <ForceGraphNode node={{ id: '2' }} />,
          <ForceGraphLink link={{ source: '1', target: '2' }} />,
        ]);

        expect(data.nodes).toEqual([{ id: '1' }, { id: '2' }]);
        expect(data.links).toEqual([{ source: '1', target: '2' }]);
      });
    });

    describe('ForceGraph.getNodePositions', () => {
      it('returns the node positions as an object by id', () => {
        const simulation = forceSimulation();
        const nodes = [{ id: '1' }, { id: '2' }];

        simulation.nodes(nodes);

        nodes.forEach(({ id }) => {
          expect(ForceGraph.getNodePositions(simulation)[id]).not.toBeUndefined();
        });
      });

      it('returns the node positions', () => {
        const simulation = forceSimulation();
        const nodes = [{ id: '1' }, { id: '2' }];

        simulation.nodes(nodes);

        const nodePositions = ForceGraph.getNodePositions(simulation);

        nodes.forEach(({ id }) => {
          expect(typeof nodePositions[id].cx).toBe('number');
          expect(typeof nodePositions[id].cy).toBe('number');
        });
      });

      it('allows fx overrides', () => {
        const simulation = forceSimulation();
        const nodes = [{ id: '1', fx: 12, fy: 16 }, { id: '2', fx: 14, fy: 18 }];

        simulation.nodes(nodes);

        const nodePositions = ForceGraph.getNodePositions(simulation);

        nodes.forEach(({ id, fx, fy }) => {
          expect(nodePositions[id].cx).toEqual(fx);
          expect(nodePositions[id].cy).toEqual(fy);
        });
      });
    });

    describe('ForceGraph.getLinkPositions', () => {
      it('returns the link positions as an object by id', () => {
        const simulation = forceSimulation();
        const nodes = [{ id: '1' }, { id: '2' }];
        const links = [
          { source: '1', target: '2' },
        ];

        simulation.nodes(nodes);
        simulation.force('link', forceLink()).links(links);

        const linkPositions = ForceGraph.getLinkPositions(simulation);

        links.forEach(({ source, target }) => {
          const linkId = `${source}=>${target}`;
          expect(linkPositions[linkId]).not.toBeUndefined();
        });
      });

      it('returns the link positions', () => {
        const simulation = forceSimulation();
        const nodes = [{ id: '1' }, { id: '2' }];
        const links = [
          { source: '1', target: '2' },
        ];

        simulation.nodes(nodes);
        simulation.force('link', forceLink()).links(links);

        const linkPositions = ForceGraph.getLinkPositions(simulation);

        links.forEach(({ source, target }) => {
          const linkId = `${source}=>${target}`;
          expect(typeof linkPositions[linkId].x1).toBe('number');
          expect(typeof linkPositions[linkId].y1).toBe('number');
          expect(typeof linkPositions[linkId].x2).toBe('number');
          expect(typeof linkPositions[linkId].y2).toBe('number');
        });
      });
    });
  });

  describe('lifecycle methods', () => {
    describe('componentDidMount()', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = shallow(<ForceGraph {...defaultProps} />);
        sinon.stub(wrapper.instance(), 'updateSimulation', noop => noop);
      });

      afterEach(() => {
        wrapper.instance().updateSimulation.restore();
      });

      it('calls updateSimulation', () => {
        wrapper.instance().updateSimulation.reset();
        wrapper.instance().componentDidMount();
        expect(wrapper.instance().updateSimulation.called).toBe(true);
      });
    });

    describe('componentWillReceiveProps()', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = shallow(<ForceGraph {...defaultProps} />);
        sinon.stub(wrapper.instance(), 'updateSimulation', noop => noop);
      });

      afterEach(() => {
        wrapper.instance().updateSimulation.restore();
      });

      it('calls updateSimulation with the new props', () => {
        const newProps = { ...defaultProps };

        wrapper.instance().updateSimulation.reset();
        wrapper.instance().componentWillReceiveProps(newProps);

        expect(wrapper.instance().updateSimulation.calledWith(newProps)).toBe(true);
      });

      it('updates lastUpdated', () => {
        const oldDate = new Date(new Date().getTime() - 1000000);
        const newProps = { ...defaultProps };

        wrapper.instance().lastUpdated = oldDate;
        wrapper.instance().componentWillReceiveProps(newProps);

        expect(wrapper.instance().lastUpdated.getTime()).toBeGreaterThan(oldDate.getTime());
      });
    });

    describe('componentWillUnmount()', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = shallow(<ForceGraph {...defaultProps} />);
        sinon.stub(wrapper.instance(), 'unbindSimulationTick', noop => noop);
      });

      afterEach(() => {
        wrapper.instance().unbindSimulationTick.restore();
      });

      it('calls unbindSimulationTick', () => {
        wrapper.instance().unbindSimulationTick.reset();
        wrapper.instance().componentWillUnmount();

        expect(wrapper.instance().unbindSimulationTick.called).toBe(true);
      });
    });
  });

  describe('instance methods', () => {
    describe('onSimulationTick()', () => {
      let wrapper;
      let rafUtils;

      beforeEach(() => {
        /* eslint-disable global-require */
        rafUtils = require('../../utils/raf');
        /* eslint-enable global-require */
        wrapper = shallow(<ForceGraph {...defaultProps} />);
        sinon.stub(wrapper.instance(), 'updatePositions', noop => noop);
      });

      afterEach(() => {
        wrapper.instance().updatePositions.restore();
      });

      it('requests animation frame', () => {
        wrapper.instance().onSimulationTick();

        expect(rafUtils.requestAnimationFrame).toHaveBeenCalled();
      });

      it('binds updatePosition to animation frame', () => {
        wrapper.instance().updatePositions.reset();
        wrapper.instance().onSimulationTick();

        wrapper.instance().frame.fn();

        expect(wrapper.instance().updatePositions.called).toBe(true);
      });
    });

    describe('onZoom()', () => {
      it('sets the new scale of the state', () => {
        const wrapper = shallow(<ForceGraph {...defaultProps} zoom {...defaultProps} />);

        wrapper.instance().onZoom({}, 2);

        expect(wrapper.state('scale')).toBe(2);
      });

      it('calls props.zoomOptions.onZoom', () => {
        // could not get jest.fn() to work...
        const onZoom = sinon.spy();
        const wrapper = shallow(<ForceGraph {...defaultProps} zoom zoomOptions={{ onZoom }} />);
        const event = { clientX: 100 };

        wrapper.instance().onZoom(event, 2, true);

        expect(onZoom.calledWith(event, 2, true)).toBe(true);
      });
    });

    describe('onPan()', () => {
      it('calls props.zoomOptions.onPan', () => {
        const onPan = sinon.spy();
        const wrapper = shallow(<ForceGraph {...defaultProps} zoom zoomOptions={{ onPan }} />);
        const event = {};

        wrapper.instance().onPan(event, 2, 3);

        expect(onPan.calledWith(event, 2, 3)).toBe(true);
      });
    });

    describe('getDataFromChildren()', () => {
      it('returns the cachedData if new data has not arrived', () => {
        const wrapper = shallow(
          <ForceGraph {...defaultProps} />
        );
        const cachedData = {
          links: [{ source: '1', target: '2' }],
          nodes: [{ id: '1' }, { id: '2' }],
        };

        wrapper.instance().cachedData = cachedData;
        wrapper.instance().lastUpdated = new Date(new Date() - 1000000);

        expect(wrapper.instance().getDataFromChildren()).toEqual(cachedData);
      });

      it('returns the new values if an update occurred', () => {
        const wrapper = shallow(
          <ForceGraph {...defaultProps}>
            <ForceGraphNode key="3" node={{ id: '3' }} />
            <ForceGraphNode key="4" node={{ id: '4' }} />
            <ForceGraphLink key="3=>4" link={{ source: '3', target: '4' }} />
          </ForceGraph>
        );

        expect(wrapper.instance().getDataFromChildren()).toEqual(
          ForceGraph.getDataFromChildren([
            <ForceGraphNode key="3" node={{ id: '3' }} />,
            <ForceGraphNode key="4" node={{ id: '4' }} />,
            <ForceGraphLink key="3=>4" link={{ source: '3', target: '4' }} />,
          ])
        );
      });

      it('sets the lastUpdated time and the cachedData', () => {
        const wrapper = shallow(
          <ForceGraph {...defaultProps}>
            <ForceGraphNode key="3" node={{ id: '3' }} />
            <ForceGraphNode key="4" node={{ id: '4' }} />
            <ForceGraphLink key="3=>4" link={{ source: '3', target: '4' }} />
          </ForceGraph>
        );

        delete wrapper.instance().lastUpdated;
        const newData = wrapper.instance().getDataFromChildren();

        expect(wrapper.instance().cachedData).toEqual(newData);
        expect(wrapper.instance().lastUpdated).toBeInstanceOf(Date);
      });

      it('takes its own props', () => {
        const wrapper = shallow(
          <ForceGraph {...defaultProps}>
            <ForceGraphNode key="3" node={{ id: '3' }} />
            <ForceGraphNode key="4" node={{ id: '4' }} />
            <ForceGraphLink key="3=>4" link={{ source: '3', target: '4' }} />
          </ForceGraph>
        );

        const newChildren = [
          <ForceGraphNode key="3" node={{ id: '5' }} />,
          <ForceGraphNode key="4" node={{ id: '6' }} />,
          <ForceGraphLink key="3=>4" link={{ source: '5', target: '6' }} />,
        ];

        expect(
          wrapper.instance().getDataFromChildren({ children: newChildren }, true)
        ).toEqual(
          ForceGraph.getDataFromChildren(newChildren)
        );
      });
    });

    describe('bindSimulationTick()', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = shallow(<ForceGraph {...defaultProps} />);
        sinon.stub(wrapper.instance(), 'updateSimulation', noop => noop);
      });

      afterEach(() => {
        wrapper.instance().updateSimulation.restore();
      });

      it('registers updateSimulation() to the simulation tick', () => {
        wrapper.instance().updateSimulation.reset();
        wrapper.instance().bindSimulationTick();

        expect(wrapper.instance().updateSimulation.called).toBe(false);

        wrapper.instance().simulation.__events.tick();

        expect(wrapper.instance().updateSimulation.called).toBe(true);
      });
    });

    describe('unbindSimulationTick()', () => {
      let rafUtils;

      beforeAll(() => {
        /* eslint-disable global-require */
        rafUtils = require('../../utils/raf');
        /* eslint-enable global-require */
      });

      it('clears the simulation tick handlers', () => {
        const wrapper = shallow(<ForceGraph {...defaultProps} />);

        wrapper.instance().unbindSimulationTick();

        expect(wrapper.instance().simulation.__events.tick).toBe(null);
      });

      it('clears the animation frame', () => {
        const wrapper = shallow(<ForceGraph {...defaultProps} />);
        const frame = { fn: jest.fn() };

        wrapper.instance().frame = frame;
        wrapper.instance().unbindSimulationTick();

        expect(rafUtils.cancelAnimationFrame).toHaveBeenCalledWith(frame);
      });
    });

    describe('updateSimulation()', () => {
      it('passes the simulation through props.updateSimulation', () => {
        const updateSimulation = jest.fn(noop => noop);
        const simulationOptions = {
          animate: false,
          width: 900,
          height: 600,
          strength: {},
        };
        const wrapper = shallow(
          <ForceGraph
            updateSimulation={updateSimulation}
            simulationOptions={simulationOptions}
            {...defaultProps}
          />
        );

        sinon.stub(wrapper.instance(), 'getDataFromChildren', () => ({
          nodes: [],
          links: [],
        }));

        wrapper.instance().updateSimulation();

        expect(updateSimulation).toHaveBeenCalledWith(
          wrapper.instance().simulation, {
            ...simulationOptions,
            data: {
              nodes: [],
              links: [],
            },
          }
        );

        expect(wrapper.instance().getDataFromChildren.called).toBe(true);
      });

      it('takes new props as an optional argument', () => {
        const updateSimulation = jest.fn(noop => noop);
        const simulationOptions = {
          animate: false,
          width: 900,
          height: 600,
          strength: {},
        };
        const wrapper = shallow(
          <ForceGraph
            updateSimulation={updateSimulation}
            simulationOptions={simulationOptions}
            {...defaultProps}
          />
        );

        const newProps = {
          updateSimulation,
          children: [
            <ForceGraphNode key="3" node={{ id: '3' }} />,
            <ForceGraphNode key="4" node={{ id: '4' }} />,
            <ForceGraphLink key="3=>4" link={{ source: '3', target: '4' }} />,
          ],
          simulationOptions: {
            ...simulationOptions,
            strength: {
              x: () => {},
            },
          },
        };

        sinon.stub(wrapper.instance(), 'getDataFromChildren', () => ({
          nodes: [{ id: '3' }, { id: '4' }],
          links: [{ source: '3', target: '4' }],
        }));

        wrapper.instance().updateSimulation(newProps);

        expect(updateSimulation).toHaveBeenCalledWith(
          wrapper.instance().simulation, {
            ...simulationOptions,
            ...newProps.simulationOptions,
            data: {
              nodes: [{ id: '3' }, { id: '4' }],
              links: [{ source: '3', target: '4' }],
            },
          }
        );

        expect(wrapper.instance().getDataFromChildren.calledWith(newProps, true)).toBe(true);
      });

      it('triggers the first simulation tick', () => {
        const wrapper = shallow(<ForceGraph {...defaultProps} />);

        sinon.stub(wrapper.instance(), 'onSimulationTick');

        wrapper.instance().updateSimulation();

        expect(wrapper.instance().onSimulationTick.called).toBe(true);
      });
    });

    describe('updatePositions()', () => {
      it('returns the linkPositions from the static method', () => {
        const wrapper = shallow(
          <ForceGraph>
            <ForceGraphNode key="1" node={{ id: '1' }} />
            <ForceGraphNode key="2" node={{ id: '2' }} />
            <ForceGraphLink key="1=>2" link={{ source: '1', target: '2' }} />
          </ForceGraph>
        );

        // pin the response since the mock just makes random numbers.
        const linkPositions = ForceGraph.getLinkPositions(wrapper.instance().simulation);
        sinon.stub(ForceGraph, 'getLinkPositions', () => linkPositions);

        wrapper.setState({ linkPositions: {} });
        wrapper.instance().updatePositions();

        expect(wrapper.state('linkPositions')).toEqual(linkPositions);

        ForceGraph.getLinkPositions.restore();
      });

      it('returns the nodePositions from the static method', () => {
        const wrapper = shallow(
          <ForceGraph>
            <ForceGraphNode key="1" node={{ id: '1' }} />
            <ForceGraphNode key="2" node={{ id: '2' }} />
            <ForceGraphLink key="1=>2" link={{ source: '1', target: '2' }} />
          </ForceGraph>
        );

        // pin the response since the mock just makes random numbers.
        const nodePositions = ForceGraph.getNodePositions(wrapper.instance().simulation);
        sinon.stub(ForceGraph, 'getNodePositions', () => nodePositions);

        wrapper.setState({ nodePositions: {} });
        wrapper.instance().updatePositions();

        expect(wrapper.state('nodePositions')).toEqual(nodePositions);

        ForceGraph.getNodePositions.restore();
      });
    });

    describe('scale()', () => {
      it('adjusts a number by the scale on the state', () => {
        const wrapper = shallow(<ForceGraph {...defaultProps} />);

        wrapper.setState({ scale: 1.5 });

        expect(wrapper.instance().scale(150)).toEqual(100);
      });

      it('allows nulls to pass through', () => {
        const wrapper = shallow(<ForceGraph {...defaultProps} />);

        wrapper.setState({ scale: 1.5 });

        expect(wrapper.instance().scale(null)).toEqual(null);
      });
    });
  });
});
