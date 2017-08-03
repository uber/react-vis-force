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
import { linkId } from '../utils/d3-force';
import ForceGraphLink from './ForceGraphLink';

export default class ForceGraphArrowLink extends PureComponent {
  static get propTypes() {
    return {
      link: linkPropTypes.isRequired,
      targetRadius: PropTypes.number,
    };
  }

  static get defaultProps() {
    return {
      className: '',
      opacity: 0.6,
      stroke: '#999',
      targetRadius: 2,
      strokeWidth: 1,
    };
  }

  render() {
    const { link, targetRadius, ...spreadable } = this.props;
    const id = `arrow-${linkId(link)}`;

    return (
      <g>
        <defs>
          <marker
            id={id}
            markerWidth={(targetRadius * 3) + 1}
            markerHeight={(targetRadius * 3) + 1}
            refX={(targetRadius * 3) + 1}
            refY={targetRadius}
            orient="auto"
            markerUnits="strokeWidth"
          >
            {targetRadius > 0 && (
              <path
                d={`M0,0 L0,${targetRadius * 2} L${targetRadius * 3},${targetRadius} z`}
                fill={spreadable.stroke || spreadable.color}
              />
            )}
          </marker>
        </defs>

        <ForceGraphLink {...spreadable} link={link} edgeOffset={targetRadius} markerEnd={`url(#${id})`} />
      </g>
    );
  }
}
