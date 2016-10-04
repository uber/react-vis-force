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

import React from 'react';
import { scaleCategory20 } from 'd3-scale';
import Perf from 'react-addons-perf';
import { window } from 'global';

import { ForceGraphNode, ForceGraphLink, InteractiveForceGraph } from '../';
import lesMisJSON from './les-miserables.json';

window.Perf = Perf;
Perf.start();

// create a color scale for use in colorizing the groups
const scale = scaleCategory20();

// data set from https://bl.ocks.org/mbostock/4062045
// adjust the radii based on "traffic"
const radii = lesMisJSON.nodes.reduce(
  (obj, node) => Object.assign(obj, {
    [node.id]: lesMisJSON.links.reduce((total, link) => (
      (link.target === node.id || link.source === node.id) ?
        total + link.value :
        total
      ), 2),
  }),
  {}
);

export default function LesMisDemo() {
  return (
    <InteractiveForceGraph
      simulationOptions={{
        animate: true,
        strength: {
          charge: node => -15.5 * node.radius,
          collide: () => 0.75,
          // x: node => 0.01 * node.radius,
          // y: node => 0.01 * node.radius,
        },
      }}
      zoom
      highlightDependencies
      minScale={(1 / 2)}
      maxScale={4}
      // defaultSelectedNode={lesMisJSON.nodes.find(node => node.id === 'Valjean')}
    >
      {lesMisJSON.nodes.map(node => (
        <ForceGraphNode
          key={node.id}
          fill={scale(node.group)}
          node={{
            ...node,
            radius: Math.floor(Math.sqrt(radii[node.id])) * 2,
          }}
        />
      ))}
      {lesMisJSON.links.map(link => (
        <ForceGraphLink
          key={`${link.source}=>${link.target}`}
          link={link}
        />
      ))}
    </InteractiveForceGraph>
  );
}
