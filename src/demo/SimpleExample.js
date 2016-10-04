import React from 'react';
import { ForceGraph, ForceGraphNode, ForceGraphLink } from '../';

export default function SimpleExample() {
  return (
    <ForceGraph simulationOptions={{ height: 300, width: 300 }}>
      <ForceGraphNode node={{ id: 'first-node', radius: 5 }} fill="red" />
      <ForceGraphNode node={{ id: 'second-node', radius: 5 }} fill="blue" />
      <ForceGraphLink link={{ source: 'first-node', target: 'second-node' }} />
    </ForceGraph>
  );
}
