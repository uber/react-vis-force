# `<InteractiveForceGraph />`

## Usage

```javascript
import React from 'react';
import { InteractiveForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';

<InteractiveForceGraph
  simulationOptions={{ height: 300, width: 300 }}
  labelAttr="label"
  onSelectNode={(node) => console.log(node)}
  highlightDependencies
>
  <ForceGraphNode node={{ id: 'first-node', label: 'First node' }} fill="red" />
  <ForceGraphNode node={{ id: 'second-node', label: 'Second node' }} fill="blue" />
  <ForceGraphLink link={{ source: 'first-node', target: 'second-node' }} />
</InteractiveForceGraph>
```

## Props

`<InteractiveForceGraph />` inherits all of the props from [`<ForceGraph />`](ForceGraph.md), and adds:

### onSelectNode(event, node)
Called each time the user selects a new node.

### onDeselectNode(event, node)
Called each time the user deselects a node.

### selectedNode
The node to set to use as selected, if you want to treat the `<InteractiveForceGraph />` as a managed component.

### defaultSelectedNode
The node to set as selected by default.

### highlightDependencies
When true, the dependencies of a hovered or selected node are given the highlighted treatment.

### opacityFactor
Used to scale opacity when hovering or selecting nodes. Ex. `0.6`
