import React from 'react';
import { ForceGraph, ForceGraphNode, ForceGraphLink } from '../';

export default function SimpleExample() {
  return (
    <ForceGraph zoom minScale={1} maxScale={3} simulationOptions={{ height: 300, width: 300 }}>
      <ForceGraphNode node={{ id: 'first-node', radius: 5 }} fill="red" />
      <ForceGraphNode node={{ id: 'second-node', radius: 5 }} fill="blue" />
      <ForceGraphLink link={{ source: 'first-node', target: 'second-node' }} />
      <line x1={150} y1={-1000} x2={150} y2={1300} zoomable stroke="green" />
      <text x={100} y={100}>{'not zoomed'}</text>
    </ForceGraph>
  );
}
