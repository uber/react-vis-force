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

import PureRenderComponent from './PureRenderComponent';
import linkPropTypes from '../propTypes/link';

export default class ForceGraphArrowLink extends PureRenderComponent {
  static get propTypes() {
    return {
      link: linkPropTypes.isRequired,
    };
  }

  static get defaultProps() {
    return {
      className: '',
      opacity: 0.6,
      stroke: '#999',
    };
  }

  render() {
    const { link, strokeWidth, className, targetRadius, ...spreadable } = this.props;
    const { x1, x2, y1, y2 } = spreadable;
    if (x1 && !isNaN(x1) &&
        x2 && !isNaN(x2) &&
        y1 && !isNaN(y1) &&
        y2 && !isNaN(y2) &&
        targetRadius && !isNaN(targetRadius)) {
      // Total difference in x and y from source to target
      const diffX = x2 - x1;
      const diffY = y2 - y1;

      // Length of path from center of source node to center of target node
      const pathLength = Math.sqrt((diffX * diffX) + (diffY * diffY));

      // x and y distances from center to outside edge of target node
      const offsetX = (diffX * targetRadius) / pathLength;
      const offsetY = (diffY * targetRadius) / pathLength;
      if (pathLength !== 0) {
        spreadable.d = `M${x1},${y1}L${x2 - offsetX},${y2 - offsetY}`;
      }
    }
    return (
      <path
        className={`rv-force__link ${className}`}
        strokeWidth={strokeWidth || Math.sqrt(link.value)}
        {...spreadable}
      />
    );
  }
}
