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

import ForceGraphNode from '../ForceGraphNode';

const defaultProps = {
  node: {
    id: 'a',
    radius: 5,
  },
};


describe('<ForceGraphNode />', () => {
  it('should render a circle', () => {
    const wrapper = shallow(<ForceGraphNode {...defaultProps} />);

    expect(wrapper.matchesElement(<circle />)).toEqual(true);
  });

  it('should use the radius off the node', () => {
    const wrapper = shallow(
      <ForceGraphNode {...defaultProps} node={{ ...defaultProps.node, radius: 10 }} />
    );

    expect(wrapper.find('circle').first().prop('r')).toEqual(10);
  });

  it('should use a provided r', () => {
    const wrapper = shallow(
      <ForceGraphNode {...defaultProps} r={4} node={{ ...defaultProps.node, radius: 10 }} />
    );

    expect(wrapper.find('circle').first().prop('r')).toEqual(4);
  });

  it('should apply a className', () => {
    const wrapper = shallow(<ForceGraphNode {...defaultProps} className={'my-class'} />);

    expect(wrapper.find('circle').first().prop('className')).toEqual('rv-force__node my-class');
  });

  it('should strip label props off', () => {
    const wrapper = shallow(<ForceGraphNode {...defaultProps} />);

    expect(wrapper.find('circle').first().prop('labelStyle')).toBeUndefined();
    expect(wrapper.find('circle').first().prop('labelClass')).toBeUndefined();
    expect(wrapper.find('circle').first().prop('showLabel')).toBeUndefined();
  });

  it('should spread the rest of the props over the line', () => {
    const wrapper = shallow(<ForceGraphNode {...defaultProps} cx={50} cy={70} />);

    expect(wrapper.find('circle').first().prop('cx')).toEqual(50);
    expect(wrapper.find('circle').first().prop('cy')).toEqual(70);
  });
});
