import React from 'react';
import { InteractiveForceGraph, ForceGraphNode, ForceGraphLink } from '../';

export default function SimpleExample() {
  return (
    <InteractiveForceGraph
      simulationOptions={{ height: 300, width: 300 }}
      labelAttr="label"
      onSelectNode={(event, node) => console.log(node)}
    >
      <ForceGraphNode node={{ id: 'first-node', label: 'First node', radius: 5 }} fill="red" />
      <ForceGraphNode node={{ id: 'second-node', label: 'Second node', radius: 5 }} fill="blue" />
      <ForceGraphLink link={{ source: 'first-node', target: 'second-node' }} />
    </InteractiveForceGraph>
  );
}
