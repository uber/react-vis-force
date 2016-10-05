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

const TEST_TICK_INTERVAL = 0.01;
const TEST_INITIAL_ALPHA = 1;
const TEST_ALPHA_MIN = 0;

export function createMockSimulation() {
  const forceMap = {};

  let currentAlpha = TEST_INITIAL_ALPHA;
  let currentAlphaDecay = 0;
  let currentAlphaMin = TEST_ALPHA_MIN;
  let currentAlphaTarget = TEST_ALPHA_MIN;
  let currentVelocityDecay = 0;
  let nodeList = [];

  let __events = {};

  return {
    __events,
    restart: jest.fn(() => { currentAlpha = TEST_INITIAL_ALPHA; }),
    stop: jest.fn(),
    on: jest.fn((name, fn) => { __events[name] = fn; }),
    off: jest.fn((name) => { delete __events[name]; }),
    tick: jest.fn(() => { currentAlpha -= TEST_TICK_INTERVAL; }),
    force: jest.fn((key, newValue = forceMap[key]) => {
      forceMap[key] = newValue;
      return newValue;
    }),
    nodes: jest.fn((newNodes = nodeList) => {
      nodeList = newNodes;
      return newNodes.map(node => ({
        ...node,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
    }),
    alpha: jest.fn((newAlpha = currentAlpha) => {
      currentAlpha = newAlpha;
      return currentAlpha;
    }),
    alphaDecay: jest.fn((newAlphaDecay = currentAlphaDecay) => {
      currentAlphaDecay = newAlphaDecay;
      return currentAlphaDecay;
    }),
    alphaMin: jest.fn((newAlphaMin = currentAlphaMin) => {
      currentAlphaMin = newAlphaMin;
      return currentAlphaMin;
    }),
    alphaTarget: jest.fn((newAlphaTarget = currentAlphaTarget) => {
      currentAlphaTarget = newAlphaTarget;
      return currentAlphaTarget;
    }),
    velocityDecay: jest.fn((newVelocityDecay = currentVelocityDecay) => {
      currentVelocityDecay = newVelocityDecay;
      return currentVelocityDecay;
    }),
  };
}

export function createMockForce() {
  let strengthFn = noop => noop;

  return {
    strength: jest.fn((newStrengthFn = strengthFn) => {
      strengthFn = newStrengthFn;
      return newStrengthFn;
    }),
  };
}

export function createMockLinkForce(initialLinks = []) {
  let linkList = initialLinks;
  let idFn = noop => noop;

  const force = {
    ...createMockForce(),
    id: jest.fn((newIdFn = idFn) => {
      idFn = newIdFn;
      return force;
    }),
    links: jest.fn((newLinks = linkList) => {
      linkList = newLinks;
      return newLinks.map((link) => {
        let { source, target } = link;
        if (typeof source === 'string') {
          source = { id: source };
        }
        if (typeof target === 'string') {
          target = { id: target };
        }

        return {
          ...link,
          source: {
            ...source,
            x: Math.random() * 100,
            y: Math.random() * 100,
          },
          target: {
            ...target,
            x: Math.random() * 100,
            y: Math.random() * 100,
          },
        };
      });
    }),
  };

  return force;
}

export function createMockCollideForce() {
  let radius = 0;

  return {
    ...createMockForce(),
    radius: jest.fn((newRadius = radius) => {
      radius = newRadius;
      return newRadius;
    }),
  };
}

export function createMockCenterForce() {
  let x = 0;
  let y = 0;

  return {
    ...createMockForce(),
    x: jest.fn((newX = x) => {
      x = newX;
      return newX;
    }),
    y: jest.fn((newY = y) => {
      y = newY;
      return newY;
    }),
  };
}

// implement d3 mocks
export const forceSimulation = jest.fn((...args) => createMockSimulation(...args));
export const forceLink = jest.fn((...args) => createMockLinkForce(...args));
export const forceManyBody = jest.fn((...args) => createMockForce(...args));
export const forceCenter = jest.fn((...args) => createMockCenterForce(...args));
export const forceCollide = jest.fn((...args) => createMockCollideForce(...args));
export const forceX = jest.fn((...args) => createMockForce(...args));
export const forceY = jest.fn((...args) => createMockForce(...args));
