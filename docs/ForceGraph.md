# `<ForceGraph />`

## Usage

```javascript
import React from 'react';
import { ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';

<ForceGraph zoom simulationOptions={{ height: 300, width: 300 }}>
  <ForceGraphNode node={{ id: 'first-node' }} fill="red" />
  <ForceGraphNode node={{ id: 'second-node' }} fill="blue" />
  <ForceGraphLink link={{ source: 'first-node', target: 'second-node' }} />
  <line x1={150} y1={0} x2={150} y2={300} zoomable stroke="green" />
</ForceGraph>
```

## Props

### children
`<ForceGraphNode />`s, `<ForceGraphLink />`s, and other children that will be embedded in the container `<svg />` element. Use `zoomable` prop if using `zoom` to opt custom children in or out of zooming.

### zoom
When true, wraps the ForceGraph in a [`<ZoomableSVGGroup />`](https://github.com/uber/react-vis-force/blob/master/src/components/ZoomableSVGGroup.js). Any children that are not `<ForceGraphNode />` or `<ForceGraphLink />` can use the `zoomable` prop to opt them in or out of the `<ZoomableSVGGroup />`.

### zoomOptions
An object of options to pass into d3-force.
* *number* minScale
* *number* maxScale
* *number* zoomSpeed
* *function* onZoom(event: *TouchMoveEvent*, scale: *number*)
* *function* onPan(event: *MouseMoveEvent*, newX: *number*, newY: *number*)

### simulationOptions
An object of options to pass into d3-force.
* *boolean* animate
* *number* height
* *number* width
* *object* strength (see strengths in the [d3-force documentation](https://github.com/d3/d3-force#collide_strength))
  * *function|number* strength.charge
  * *function|number* strength.collide
  * *function|number* strength.x
  * *function|number* strength.y
* *boolean* animate
* *number* alpha
* *number* alphaDecay
* *number* alphaMin
* *number* alphaTarget
* *number* velocityDecay
* *number* radiusMargin

### createSimulation(options)
A function to use as an alternative to [`forceUtils.createSimulation`](https://github.com/uber/react-vis-force/blob/master/src/utils/d3-force.js#L232-L237) for creating a d3-force simulation.

### updateSimulation(simulation, options)
A function to use as an alternative to [`forceUtils.updateSimulation`](https://github.com/uber/react-vis-force/blob/master/src/utils/d3-force.js#L262-L277) for updating a simulation given data and options.

### labelAttr
The attribute on each `node` to use as the label when rendering labels.

### labelOffset
An object with `{ x(node) {}, y(node) {} }` to calculate the position offset to place each label at.

### showLabels
Force show all of the labels. You can also show individual labels with `<ForceGraphNode showLabel />`.
