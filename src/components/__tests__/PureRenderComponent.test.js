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
import { shallow } from 'enzyme';

import PureRenderComponent from '../PureRenderComponent';

describe('PureRenderComponent', () => {
  class TestComponent extends PureRenderComponent {
    constructor(props) {
      super(props);
      this.state = { c: 1, d: 2 };
    }
    static get propTypes() {
      return {
        a: PropTypes.string.isRequired,
        b: PropTypes.string.isRequired,
        e: PropTypes.string,
      };
    }
    render() {
      const { a } = this.props;
      return <div>{a}</div>;
    }
  }

  it('should re-render if state changes', () => {
    const wrapper = shallow(<TestComponent a="hello" b="world" />);

    expect(wrapper.instance().shouldComponentUpdate({
      a: 'hello',
      b: 'world',
      e: 'testing',
    }, {
      c: 1,
      d: 2,
    })).toEqual(true);
  });

  it('should re-render if props change', () => {
    const wrapper = shallow(<TestComponent a="hello" b="world" />);

    expect(wrapper.instance().shouldComponentUpdate({
      a: 'hello',
      b: 'world',
    }, {
      c: 1,
      d: 3,
    })).toEqual(true);
  });

  it('should not re-render otherwise', () => {
    const wrapper = shallow(<TestComponent a="hello" b="world" />);

    expect(wrapper.instance().shouldComponentUpdate({
      a: 'hello',
      b: 'world',
    }, {
      c: 1,
      d: 2,
    })).toEqual(false);
  });
});
