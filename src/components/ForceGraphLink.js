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

import linkPropTypes from '../propTypes/link';

export default class ForceGraphLink extends PureComponent {
  static get propTypes() {
    return {
      link: linkPropTypes.isRequired,
      edgeOffset: PropTypes.number,
      strokeWidth: PropTypes.number,
      className: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      className: '',
      opacity: 0.6,
      stroke: '#999',
      edgeOffset: 0,
    };
  }

  render() {
    const { link, strokeWidth, className, edgeOffset, ...spreadable } = this.props;

    if (typeof edgeOffset === 'number') {
      const { x1, x2, y1, y2 } = spreadable;
      const xLen = x1 + x2;
      const yLen = y1 + y2;
      const length = Math.sqrt(Math.pow(xLen, 2) + Math.pow(yLen, 2));
      const offsetFactor = edgeOffset / length;
      const xOffset = offsetFactor * xLen;
      const yOffset = offsetFactor * yLen;

      if (x1 > x2) {
        spreadable.x1 -= xOffset;
        spreadable.x2 += xOffset;
      } else if (x1 < x2) {
        spreadable.x1 += xOffset;
        spreadable.x2 -= xOffset;
      }

      if (y1 > y2) {
        spreadable.y1 -= yOffset;
        spreadable.y2 += yOffset;
      } else if (y1 < y2) {
        spreadable.y1 += yOffset;
        spreadable.y2 -= yOffset;
      }
    }

    return (
      <line
        className={`rv-force__link ${className}`}
        strokeWidth={strokeWidth || Math.sqrt(link.value)}
        {...spreadable}
      />
    );
  }
}
