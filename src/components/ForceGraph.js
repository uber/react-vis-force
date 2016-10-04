// Copyright (c) 2016 Uber Technologies, Inc.
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

import React, { PropTypes, Children, cloneElement } from 'react';

import './ForceGraph.css';
import PureRenderComponent from './PureRenderComponent';
import * as forceUtils from '../utils/d3-force';
import * as rafUtils from '../utils/raf';

import ForceGraphNode from './ForceGraphNode';
import ForceGraphLink from './ForceGraphLink';
import ZoomableSVGGroup from './ZoomableSVGGroup';

import simulationPropTypes, { DEFAULT_SIMULATION_PROPS } from '../propTypes/simulation';

export default class ForceGraph extends PureRenderComponent {
  static get propTypes() {
    return {
      children: PropTypes.any,

      // zoom and pan
      zoom: PropTypes.bool,
      minScale: PropTypes.number,
      maxScale: PropTypes.number,
      onZoom: PropTypes.func,

      // create custom simulations
      createSimulation: PropTypes.func,
      updateSimulation: PropTypes.func,
      simulationOptions: simulationPropTypes,

      // adjust label display
      labelAttr: PropTypes.string,
      labelOffset: PropTypes.objectOf(PropTypes.func),
      showLabels: PropTypes.bool,
    };
  }

  static get defaultProps() {
    return {
      createSimulation: forceUtils.createSimulation,
      updateSimulation: forceUtils.updateSimulation,
      zoom: false,
      labelAttr: 'id',
      simulationOptions: DEFAULT_SIMULATION_PROPS,
      labelOffset: {
        x: ({ radius = 5 }) => radius / 2,
        y: ({ radius = 5 }) => -radius / 4,
      },
      showLabels: false,
      onZoom() {},
    };
  }

  static getDataFromChildren(children) {
    const data = { nodes: [], links: [] };

    Children.forEach(children, (child) => {
      switch (child.type) {
        case ForceGraphNode:
          data.nodes.push(child.props.node);
          break;
        case ForceGraphLink:
          data.links.push(child.props.link);
          break;
        default:
          break;
      }
    });

    return data;
  }

  /**
   * return a map of nodeIds to node positions.
   * @param {object} simulation - d3-force simulation
   * @return {object} map of nodeIds to positions
   */
  static getNodePositions(simulation) {
    return simulation.nodes().reduce(
      (obj, node) => Object.assign(obj, {
        [forceUtils.nodeId(node)]: {
          cx: node.fx || node.x,
          cy: node.fy || node.y,
        },
      }),
      {}
    );
  }

  /**
   * return a map of nodeIds to node positions.
   * @param {object} simulation - d3-force simulation
   * @return {object} map of linkIds to positions
   */
  static getLinkPositions(simulation) {
    return simulation.force('link').links().reduce(
      (obj, link) => Object.assign(obj, {
        [forceUtils.linkId(link)]: {
          x1: link.source.x,
          y1: link.source.y,
          x2: link.target.x,
          y2: link.target.y,
        },
      }),
      {}
    );
  }

  constructor(props) {
    super(props);

    const { createSimulation, simulationOptions } = props;

    const data = this.getDataFromChildren();

    this.simulation = createSimulation({
      ...DEFAULT_SIMULATION_PROPS,
      ...simulationOptions,
      data,
    });

    this.state = {
      linkPositions: {},
      nodePositions: {},
      scale: 1,
    };

    this.bindSimulationTick();
  }

  componentDidMount() {
    this.updateSimulation();
  }

  componentWillReceiveProps(nextProps) {
    this.lastUpdated = new Date();
    this.updateSimulation(nextProps);
  }

  componentWillUnmount() {
    this.unbindSimulationTick();
  }

  onSimulationTick() {
    this.frame = rafUtils.requestAnimationFrame(
      this.updatePositions.bind(this)
    );
  }

  onZoom(event, scale, ...args) {
    this.setState({ scale });
    this.props.onZoom(event, scale, ...args);
  }

  getDataFromChildren() {
    if (new Date() > this.lastUpdated) {
      return this.cachedData;
    }

    const data = ForceGraph.getDataFromChildren(this.props.children);

    Object.assign(this, { cachedData: data, lastUpdated: new Date() });

    return data;
  }

  bindSimulationTick() {
    this.simulation.on('tick', this.updateSimulation.bind(this));
  }

  unbindSimulationTick() {
    this.simulation.on('.tick', null);
    this.frame = this.frame && rafUtils.cancelAnimationFrame(this.frame);
  }

  updateSimulation(props = this.props) {
    const { simulation } = this;
    const { updateSimulation, simulationOptions } = props;

    this.simulation = updateSimulation(simulation, {
      ...DEFAULT_SIMULATION_PROPS,
      ...simulationOptions,
      data: this.getDataFromChildren(),
    });

    this.onSimulationTick();
  }

  updatePositions() {
    this.setState({
      linkPositions: ForceGraph.getLinkPositions(this.simulation),
      nodePositions: ForceGraph.getNodePositions(this.simulation),
    });
  }

  scale(number) {
    return typeof number === 'number' ? number / this.state.scale : number;
  }

  render() {
    const {
      children,
      className,
      labelAttr,
      labelOffset,
      showLabels,
      simulationOptions,
      zoom,
      minScale,
      maxScale,
    } = this.props;

    const {
      linkPositions,
      nodePositions,
    } = this.state;

    const {
      height = DEFAULT_SIMULATION_PROPS.height,
      width = DEFAULT_SIMULATION_PROPS.width,
    } = simulationOptions;

    const nodeElements = [];
    const labelElements = [];
    const linkElements = [];
    const zoomableChildren = [];
    const staticChildren = [];

    // build up the real children to render by iterating through the provided children
    Children.forEach(children, (child, idx) => {
      const { type } = child;

      switch (type) {
        case ForceGraphNode: {
          const {
            node,
            showLabel,
            labelClass,
            labelStyle,
            strokeWidth,
          } = child.props;
          const nodePosition = nodePositions[forceUtils.nodeId(node)];

          nodeElements.push(cloneElement(child, {
            ...nodePosition,
            strokeWidth: this.scale(strokeWidth),
          }));

          if ((showLabels || showLabel) && nodePosition) {
            const { fontSize, ...spreadableLabelStyle } = labelStyle;
            labelElements.push(
              <text
                className={`rv-force__label ${labelClass}`}
                key={`${forceUtils.nodeId(node)}-label`}
                x={nodePosition.cx + labelOffset.x(node)}
                y={nodePosition.cy + labelOffset.y(node)}
                fontSize={this.scale(fontSize)}
                style={spreadableLabelStyle}
              >
                {node[labelAttr]}
              </text>
            );
          }

          break;
        }

        case ForceGraphLink: {
          const { link } = child.props;
          const { strokeWidth } = link;
          const linkPosition = linkPositions[forceUtils.linkId(link)];

          linkElements.push(cloneElement(child, {
            ...linkPosition,
            strokeWidth: this.scale(strokeWidth),
          }));

          break;
        }

        default: {
          const { props: { zoomable } } = child;
          if (zoom && zoomable) {
            zoomableChildren.push(cloneElement(child, { key: child.key || `zoomable-${idx}` }));
          } else {
            staticChildren.push(cloneElement(child, { key: child.key || `static-${idx}` }));
          }

          break;
        }
      }
    });

    return (
      <svg className={`rv-force__svg ${className}`} width={width} height={height}>
        <g className="rv-force__static-elements">{staticChildren}</g>
        <ZoomableSVGGroup
          disabled={!zoom}
          height={height}
          width={width}
          minScale={minScale}
          maxScale={maxScale}
          onZoom={(...args) => this.onZoom(...args)}
        >
          <g className="rv-force__zoomable-elements">{zoomableChildren}</g>
          <g className="rv-force__links">{linkElements}</g>
          <g className="rv-force__nodes">{nodeElements}</g>
          <g className="rv-force__labels">{labelElements}</g>
        </ZoomableSVGGroup>
      </svg>
    );
  }
}
