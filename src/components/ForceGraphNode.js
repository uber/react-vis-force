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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import nodePropTypes from '../propTypes/node';

export default class ForceGraphNode extends PureComponent {
  static get propTypes() {
    return {
      node: nodePropTypes.isRequired,
      cx: PropTypes.number,
      cy: PropTypes.number,
      r: PropTypes.number,
      className: PropTypes.string,
      // these props only have an impact on the parent.
      labelStyle: PropTypes.object,
      labelClass: PropTypes.string,
      showLabel: PropTypes.bool,
    };
  }

  static get defaultProps() {
    return {
      className: '',
      fill: '#333',
      opacity: 1,
      stroke: '#FFF',
      strokeWidth: 1.5,
    };
  }

  render() {
    const {
      node, className, r,
      /* eslint-disable no-unused-vars */
      labelStyle, labelClass, showLabel,
      /* eslint-enable no-unused-vars */
      ...spreadable
    } = this.props;

    const { radius = 5 } = node;

    return (
      <circle
        className={`rv-force__node ${className}`}
        r={r || radius}
        {...spreadable}
      />
    );
  }
}
