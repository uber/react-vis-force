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
import { shallow } from 'enzyme';

const defaultProps = {};

describe('<ForceGraph />', () => {
  let ForceGraph;

  beforeAll(() => {
    jest.mock('d3-force');
    /* eslint-disable global-require */
    ForceGraph = require('../ForceGraph').default;
    /* eslint-enable global-require */
  });

  afterAll(() => {
    jest.unmock('d3-force');
  });

  it('should render an <svg />', () => {
    const wrapper = shallow(<ForceGraph {...defaultProps} />);

    expect(wrapper.type()).toEqual('svg');
  });

  it('should render static and zoomable children through for zoom', () => {
    const wrapper = shallow(
      <ForceGraph {...defaultProps} zoom>
        <div className="my-static-element" />
        <div className="my-zoomable-element" zoomable />
      </ForceGraph>
    );

    expect(wrapper.find('.rv-force__static-elements').first().children().length).toEqual(1);
    expect(wrapper.find('.rv-force__zoomable-elements').first().children().length).toEqual(1);
  });

  it('should render static children through for non-zoom', () => {
    const wrapper = shallow(
      <ForceGraph {...defaultProps}>
        <div className="my-static-element" />
        <div className="my-zoomable-element" zoomable />
      </ForceGraph>
    );

    expect(wrapper.find('.rv-force__static-elements').first().children().length).toEqual(2);
    expect(wrapper.find('.rv-force__zoomable-elements').first().children().length).toEqual(0);
  });
});
