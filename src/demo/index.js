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
import ReactDOM from 'react-dom';
import { document } from 'global';

import './Demo.css';
import SimpleExample from './SimpleExample';
import ZoomableExample from './ZoomableExample';
import InteractiveExample from './InteractiveExample';
import LesMisExample from './LesMisExample';

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

    <h2>{'Simple example'}</h2>
    <SimpleExample />

    <h2>{'Zoomable example'}</h2>
    <ZoomableExample />

    <h2>{'Interactive example'}</h2>
    <InteractiveExample />

    <h2>
      {'Les Mis demo, adapted from '}
      <a href="https://bl.ocks.org/mbostock/4062045">
        {'Mike Bostock\'s d3-force demo.'}
      </a>
    </h2>
    <LesMisExample />
  </section>,
  document.getElementById('root')
);
