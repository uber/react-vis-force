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

import React, { cloneElement } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { scaleCategory20 } from 'd3-scale';

import { InteractiveForceGraph, ForceGraph, ForceGraphNode, ForceGraphLink } from '../src/';
import lesMisJSON from './les-miserables.json';

import './demo-styles.css';

function attachEvents(child) {
  return cloneElement(child, {
    onMouseDown: action(`clicked <${child.type.name} />`),
    onMouseOver: action(`hovered <${child.type.name} />`),
    onMouseOut: action(`blurred <${child.type.name} />`),
  });
}

const twoChildren = [
  <ForceGraphNode node={{ id: 'first-node' }} fill="#11939A" />,
  <ForceGraphNode node={{ id: 'second-node' }} fill="#47d3d9" />,
  <ForceGraphLink link={{ source: 'first-node', target: 'second-node' }} />,
].map(attachEvents);

const tenChildren = [
  <ForceGraphNode node={{ id: 'first-node', radius: 5 }} fill="#11939A" />,
  <ForceGraphNode node={{ id: 'second-node', radius: 10 }} fill="#47d3d9" />,
  <ForceGraphNode node={{ id: 'third-node', radius: 15 }} fill="#11939A" />,
  <ForceGraphNode node={{ id: 'fourth-node', radius: 15 }} fill="#47d3d9" />,
  <ForceGraphNode node={{ id: 'fifth-node', radius: 5 }} fill="#11939A" />,
  <ForceGraphNode node={{ id: 'sixth-node', radius: 15 }} fill="#47d3d9" />,
  <ForceGraphNode node={{ id: 'seventh-node', radius: 10 }} fill="#11939A" />,
  <ForceGraphNode node={{ id: 'eighth-node', radius: 5 }} fill="#47d3d9" />,
  <ForceGraphNode node={{ id: 'ninth-node', radius: 5 }} fill="#11939A" />,
  <ForceGraphNode node={{ id: 'tenth-node', radius: 5 }} fill="#47d3d9" />,
  <ForceGraphLink link={{ source: 'first-node', target: 'second-node' }} />,
  <ForceGraphLink link={{ source: 'third-node', target: 'second-node' }} />,
  <ForceGraphLink link={{ source: 'third-node', target: 'fourth-node' }} />,
  <ForceGraphLink link={{ source: 'fifth-node', target: 'fourth-node' }} />,
  <ForceGraphLink link={{ source: 'fifth-node', target: 'fourth-node' }} />,
  <ForceGraphLink link={{ source: 'sixth-node', target: 'fourth-node' }} />,
  <ForceGraphLink link={{ source: 'seventh-node', target: 'fourth-node' }} />,
  <ForceGraphLink link={{ source: 'eighth-node', target: 'fourth-node' }} />,
  <ForceGraphLink link={{ source: 'ninth-node', target: 'tenth-node' }} />,
  <ForceGraphLink link={{ source: 'tenth-node', target: 'fifth-node' }} />,
].map(attachEvents);

storiesOf('<ForceGraph />', module)
  .add('two nodes', () => (
    <ForceGraph>{twoChildren}</ForceGraph>
  ))
  .add('10 nodes', () => (
    <ForceGraph>{tenChildren}</ForceGraph>
  ))
  .add('10 nodes (animated)', () => (
    <ForceGraph simulationOptions={{ animate: true }}>{tenChildren}</ForceGraph>
  ))
  .add('10 nodes (strength on x and y)', () => (
    <ForceGraph
      simulationOptions={{
        strength: {
          x: ({ radius }) => 15 / radius,
          y: ({ radius }) => 3 / radius,
        }
      }}
    >
      {tenChildren}
    </ForceGraph>
  ))
  .add('10 nodes (strength on collisions)', () => (
    <ForceGraph
      simulationOptions={{
        animate: true,
        strength: {
          collide: 8,
        }
      }}
    >
      {tenChildren}
    </ForceGraph>
  ))
  .add('labelled nodes', () => (
    <ForceGraph showLabels>
      {twoChildren}
    </ForceGraph>
  ))
  .add('Characters from Les Mis', () => {
    const scale = scaleCategory20();

    return (
      <ForceGraph>
        {lesMisJSON.nodes.map(node => (
          <ForceGraphNode
            key={node.id}
            fill={scale(node.group)}
            node={{ ...node, radius: 5 }}
          />
        )).map(attachEvents)}
        {lesMisJSON.links.map(link => (
          <ForceGraphLink
            key={`${link.source}=>${link.target}`}
            link={{ ...link, value: 2 }}
          />
        )).map(attachEvents)}
      </ForceGraph>
    );
  })
  .add('Characters from Les Mis (animated)', () => {
    const scale = scaleCategory20();

    return (
      <ForceGraph simulationOptions={{ animate: true }} xmlnsXlink="http://www.w3.org/1999/xlink">
        <a href="https://bl.ocks.org/mbostock/4062045" target="_blank">
          <text x={25} y={25} style={{ fontSize: 10 }}>{'https://bl.ocks.org/mbostock/4062045'}</text>
        </a>

        {lesMisJSON.nodes.map(node => (
          <ForceGraphNode
            key={node.id}
            fill={scale(node.group)}
            node={{ ...node, radius: 5 }}
          />
        )).map(attachEvents)}
        {lesMisJSON.links.map(link => (
          <ForceGraphLink
            key={`${link.source}=>${link.target}`}
            link={{ ...link, value: 2 }}
          />
        )).map(attachEvents)}
      </ForceGraph>
    );
  })
  .add('Characters from Les Mis (zoomable)', () => {
    const scale = scaleCategory20();

    return (
      <ForceGraph
        zoom
        minScale={0.25}
        maxScale={5}
        onZoom={action('zoomed')}
        onPan={action('panned')}
      >
        {lesMisJSON.nodes.map(node => (
          <ForceGraphNode
            key={node.id}
            fill={scale(node.group)}
            node={{ ...node, radius: 5 }}
          />
        )).map(attachEvents)}
        {lesMisJSON.links.map(link => (
          <ForceGraphLink
            key={`${link.source}=>${link.target}`}
            link={{ ...link, value: 2 }}
          />
        )).map(attachEvents)}
      </ForceGraph>
    );
  });;

  storiesOf('<InteractiveForceGraph />', module)
    .add('two nodes', () => (
      <InteractiveForceGraph onSelectNode={action('node selected')} onDeselectNode={action('node deselected')}>
        {twoChildren}
      </InteractiveForceGraph>
    ))
    .add('10 nodes', () => (
      <InteractiveForceGraph onSelectNode={action('node selected')} onDeselectNode={action('node deselected')}>
        {tenChildren}
      </InteractiveForceGraph>
    ))
    .add('10 nodes (animated)', () => (
      <InteractiveForceGraph onSelectNode={action('node selected')} onDeselectNode={action('node deselected')} simulationOptions={{ animate: true }}>
        {tenChildren}
      </InteractiveForceGraph>
    ))
    .add('10 nodes (strength on x and y)', () => (
      <InteractiveForceGraph
        onSelectNode={action('node selected')}
        onDeselectNode={action('node deselected')}
        simulationOptions={{
          strength: {
            x: ({ radius }) => 15 / radius,
            y: ({ radius }) => 3 / radius,
          }
        }}
      >
        {tenChildren}
      </InteractiveForceGraph>
    ))
    .add('10 nodes (strength on collisions)', () => (
      <InteractiveForceGraph
        onSelectNode={action('node selected')}
        onDeselectNode={action('node deselected')}
        simulationOptions={{
          animate: true,
          strength: {
            collide: 8,
          }
        }}
      >
        {tenChildren}
      </InteractiveForceGraph>
    ))
    .add('labelled nodes', () => (
      <InteractiveForceGraph
        showLabels
        onSelectNode={action('node selected')}
        onDeselectNode={action('node deselected')}
      >
        {twoChildren}
      </InteractiveForceGraph>
    ))
    .add('Characters from Les Mis', () => {
      const scale = scaleCategory20();

      return (
        <InteractiveForceGraph
          onSelectNode={action('node selected')}
          onDeselectNode={action('node deselected')}
        >
          {lesMisJSON.nodes.map(node => (
            <ForceGraphNode
              key={node.id}
              fill={scale(node.group)}
              node={{ ...node, radius: 5 }}
            />
          )).map(attachEvents)}
          {lesMisJSON.links.map(link => (
            <ForceGraphLink
              key={`${link.source}=>${link.target}`}
              link={{ ...link, value: 2 }}
            />
          )).map(attachEvents)}
        </InteractiveForceGraph>
      );
    })
    .add('Characters from Les Mis (highlighted dependencies)', () => {
      const scale = scaleCategory20();

      return (
        <InteractiveForceGraph
          highlightDependencies
          onSelectNode={action('node selected')}
          onDeselectNode={action('node deselected')}
        >
          {lesMisJSON.nodes.map(node => (
            <ForceGraphNode
              key={node.id}
              fill={scale(node.group)}
              node={{ ...node, radius: 5 }}
            />
          )).map(attachEvents)}
          {lesMisJSON.links.map(link => (
            <ForceGraphLink
              key={`${link.source}=>${link.target}`}
              link={{ ...link, value: 2 }}
            />
          )).map(attachEvents)}
        </InteractiveForceGraph>
      );
    })
    .add('Characters from Les Mis (animated)', () => {
      const scale = scaleCategory20();

      return (
        <InteractiveForceGraph
          highlightDependencies
          simulationOptions={{ animate: true }}
          onSelectNode={action('node selected')}
          onDeselectNode={action('node deselected')}
        >
          {lesMisJSON.nodes.map(node => (
            <ForceGraphNode
              key={node.id}
              fill={scale(node.group)}
              node={{ ...node, radius: 5 }}
            />
          )).map(attachEvents)}
          {lesMisJSON.links.map(link => (
            <ForceGraphLink
              key={`${link.source}=>${link.target}`}
              link={{ ...link, value: 2 }}
            />
          )).map(attachEvents)}
        </InteractiveForceGraph>
      );
    });
