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

import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
} from 'd3-force';

import setsEqual from './sets-equal';

const ALPHA_FACTORS = [
  'alpha',
  'alphaDecay',
  'alphaMin',
  'alphaTarget',
  'velocityDecay',
];

// ---- PRIVATE METHODS ----
/**
 * return a mapped list of objects where only the attrNames provided
 * remain on the objects in the collection.
 * @param {array} list - array of objects
 * @param {...array} attrNames - keys, spread over the rest of the arguments
 * @return {array} mapped list of new objects with only the attrNames on them
 */
function pick(list, ...attrNames) {
  return list.map(item => attrNames.reduce(
    (obj, attrName) => Object.assign(obj, {
      [attrName]: item[attrName],
    }),
    {}
  ));
}

/**
 * take a function or a value to return as a strength and set it
 * @param {mixed} target
 * @return {function} a strength function
 */
export function asStrengthFn(target) {
  switch (typeof target) {
    case 'function':
      return target;
    default:
      return () => target;
  }
}

function applyAlphaFactors(simulation, options) {
  ALPHA_FACTORS.forEach((alphaFactorName) => {
    if ({}.hasOwnProperty.call(options, alphaFactorName)) {
      simulation[alphaFactorName](options[alphaFactorName]);
    }
  });

  return simulation;
}

function applyCenterForce(simulation, { height, width }) {
  // setup a new center force if it doesn't exist.
  if (!simulation.force('center')) {
    simulation.force('center', forceCenter());
  }

  // set the center force to the center of the graph. only update
  // the value if it is not the same as the previous value.
  const centerX = width ? width / 2 : 0;
  if (width > 0 && simulation.force('center').x() !== centerX) {
    simulation.shouldRun = true;
    simulation.force('center').x(centerX);
  }

  const centerY = height ? height / 2 : 0;
  if (height > 0 && simulation.force('center').y() !== centerY) {
    simulation.shouldRun = true;
    simulation.force('center').y(centerY);
  }

  return simulation;
}

function applyManyBodyChargeForce(simulation, { strength = {} }) {
  if (!simulation.force('charge')) {
    simulation.force('charge', forceManyBody());
  }

  if (strength.charge !== simulation.strength.charge) {
    simulation.strength.charge = strength.charge;
    simulation.shouldRun = true;
    simulation.force('charge').strength(asStrengthFn(strength.charge));
  }
}

function applyCollisionForce(simulation, { radiusMargin = 3, strength = {} }) {
  if (!simulation.force('collide')) {
    simulation.force('collide', forceCollide());
  }

  if (simulation.radiusMargin !== radiusMargin) {
    simulation.radiusMargin = radiusMargin;
    simulation.shouldRun = true;
    simulation.force('collide').radius(({ radius }) => radius + radiusMargin);
  }

  if (strength.collide !== simulation.strength.collide) {
    simulation.strength.collide = strength.collide;
    simulation.shouldRun = true;
    simulation.force('collide').strength(asStrengthFn(strength.collide)());
  }
}

function applyLinkForce(simulation, {
  data: { nodes, links },
  linkAttrs = [],
  nodeAttrs = [],
}) {
  // setup the link force if it isn't already set up
  if (!simulation.force('link')) {
    simulation.force('link', forceLink().id(nodeId));
  }

  // set the nodes and links for this simulation. provide
  // new instances to avoid mutating the underlying values.
  // only update if there are changes.
  const prevNodesSet = new Set(simulation.nodes().map(nodeId));
  const newNodesSet = new Set(nodes.map(nodeId));
  if (!setsEqual(prevNodesSet, newNodesSet)) {
    simulation.shouldRun = true;
    simulation.nodes(
      pick(nodes, 'id', 'radius', 'fx', 'fy', ...nodeAttrs)
    );
  }

  const prevLinksSet = new Set(simulation.force('link').links().map(linkId));
  const newLinksSet = new Set(links.map(linkId));
  if (!setsEqual(prevLinksSet, newLinksSet)) {
    simulation.shouldRun = true;
    simulation.force('link').links(
      pick(links, 'source', 'target', 'value', ...linkAttrs)
    );
  }
}

function applyAxisForce(simulation, { strength = {} }) {
  if (!simulation.force('x')) {
    simulation.force('x', forceX());
  }

  if (!simulation.force('y')) {
    simulation.force('y', forceY());
  }

  if (strength.x !== simulation.strength.x) {
    simulation.strength.x = strength.x;
    simulation.shouldRun = true;
    simulation.force('x').strength(asStrengthFn(strength.x));
  }

  if (strength.y !== simulation.strength.y) {
    simulation.strength.y = strength.y;
    simulation.shouldRun = true;
    simulation.force('y').strength(asStrengthFn(strength.y));
  }
}

// ---- PUBLIC METHODS ----
/**
 * given a force-directed graph node, return its id.
 * @param {object} node
 * @returns {string} id
 */
export function nodeId(node) {
  return node.id;
}

/**
 * given a force-directed graph link, return its id.
 * @param {object} link
 * @returns {string} id
 */
export function linkId(link) {
  return `${link.source.id || link.source}=>${link.target.id || link.target}`;
}

/**
 * run the simulation and stop it after the appropriate number of steps.
 * @param {object} simulation - a d3-force simulation ready to be run
 * @param {number} steps - the number of times to call tick
 * @returns {object} the run simulation
 */
export function runSimulation(simulation) {
  simulation.restart();

  // run the simulation to fruition and stop it.
  while (simulation.alpha() > simulation.alphaMin()) {
    simulation.tick();
  }

  simulation.stop();

  return simulation;
}

/**
 * given the options, update a simulation
 * @param {object} options
 * @returns {object} d3-force simulation
 */
export function createSimulation(options) {
  // update center force
  const simulation = forceSimulation();
  simulation.strength = {};
  return updateSimulation(simulation, options);
}

/**
 * given the options, update a simulation.
 * @param {object} simulation - a d3-force simulation
 * @param {object} options
 * @param {number} options.height
 * @param {number} options.width
 * @param {object} options.data
 * @param {array} options.data.nodes
 * @param {array} options.data.links
 * @param {object} [options.strength]
 * @param {function|number} [options.strength.charge]
 * @param {function|number} [options.strength.collide]
 * @param {function|number} [options.strength.x]
 * @param {function|number} [options.strength.y]
 * @param {boolean} [options.animate]
 * @param {number} [options.alpha]
 * @param {number} [options.alphaDecay]
 * @param {number} [options.alphaMin]
 * @param {number} [options.alphaTarget]
 * @param {number} [options.velocityDecay]
 * @param {number} [options.radiusMargin]
 * @returns {object} d3-force simulation
 */
export function updateSimulation(simulation, options) {
  applyAlphaFactors(simulation, options);
  applyCenterForce(simulation, options);
  applyManyBodyChargeForce(simulation, options);
  applyCollisionForce(simulation, options);
  applyLinkForce(simulation, options);
  applyAxisForce(simulation, options);

  if (!options.animate && simulation.shouldRun) {
    runSimulation(simulation);
  }

  simulation.shouldRun = null;

  return simulation;
}
