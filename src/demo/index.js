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

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { document } from 'global';
import { PrismCode } from 'react-prism';

import './Demo.css';
import SimpleExample from './SimpleExample';
import ZoomableExample from './ZoomableExample';
import InteractiveExample from './InteractiveExample';
import LesMisExample from './LesMisExample';

const DemoExample = ({ children, codeSample, title }) => (
  <article>
    <h2>{title}</h2>
    <div className="ui two column grid">
      <div className="column">
        <h4>Demo</h4>
        {children}
      </div>
      <div className="column">
        <h4>Code</h4>
        <pre className="ui segment">
          <PrismCode className="language-javascript language-jsx">
            {codeSample}
          </PrismCode>
        </pre>
      </div>
    </div>
  </article>
);

DemoExample.propTypes = {
  children: PropTypes.any,
  codeSample: PropTypes.string,
  title: PropTypes.any,
};

ReactDOM.render(
  <section style={{ padding: '1em' }}>
    <a href="https://github.com/uber/react-vis-force">
      <img
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          border: 0,
        }}
        data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"
        src="https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67"
        alt="Fork me on GitHub"
      />
    </a>

    <h1>{'react-vis-force demo'}</h1>

    <DemoExample
      title="Simple Example"
      codeSample={`<ForceGraph simulationOptions={{ height: 300, width: 300 }}>
  <ForceGraphNode node={{ id: 'first-node', radius: 5 }} fill="red" />
  <ForceGraphNode showLabel node={{ id: 'second-node', radius: 5 }} fill="blue" />
  <ForceGraphLink link={{ source: 'first-node', target: 'second-node' }} />
</ForceGraph>`}
    >
      <SimpleExample />
    </DemoExample>

    <DemoExample
      title="Zoomable Example"
      codeSample={`<ForceGraph zoom minScale={1} maxScale={3} simulationOptions={{ height: 300, width: 300 }}>
  <ForceGraphNode node={{ id: 'first-node', radius: 5 }} fill="red" />
  <ForceGraphNode node={{ id: 'second-node', radius: 5 }} fill="blue" />
  <ForceGraphLink link={{ source: 'first-node', target: 'second-node' }} />
  <line x1={150} y1={-1000} x2={150} y2={1300} zoomable stroke="green" />
  <text x={100} y={100}>{'not zoomed'}</text>
</ForceGraph>`}
    >
      <ZoomableExample />
    </DemoExample>

    <DemoExample
      title="Interactive Example"
      codeSample={`<InteractiveForceGraph
  simulationOptions={{ height: 300, width: 300 }}
  labelAttr="label"
  onSelectNode={(event, node) => console.log(node)}
>
  <ForceGraphNode node={{ id: 'first-node', label: 'First node', radius: 5 }} fill="red" />
  <ForceGraphNode node={{ id: 'second-node', label: 'Second node', radius: 5 }} fill="blue" />
  <ForceGraphLink link={{ source: 'first-node', target: 'second-node' }} />
</InteractiveForceGraph>`}
    >
      <InteractiveExample />
    </DemoExample>

    <DemoExample
      title={(
        <span>
          {'Les Mis demo, adapted from '}
          <a href="https://bl.ocks.org/mbostock/4062045">
            {'Mike Bostock\'s d3-force demo.'}
          </a>
        </span>
      )}
      codeSample={`<InteractiveForceGraph
  simulationOptions={{
    animate: true,
    strength: {
      charge: node => -15.5 * node.radius,
      collide: () => 0.75,
    },
  }}
  zoom
  highlightDependencies
  minScale={(1 / 2)}
  maxScale={4}
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
      key={\`\${link.source}=>\${link.target}\`}
      link={link}
    />
  ))}
</InteractiveForceGraph>`}
    >
      <LesMisExample />
    </DemoExample>
  </section>,
  document.getElementById('root')
);
