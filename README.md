# react-vis ![Build Status](https://travis-ci.org/uber/react-vis-force.svg?branch=master)

![react-vis-force demo](http://uber.github.io/public/images/react-vis-force.gif)

See the live demo at http://uber.github.io/react-vis-force

## Overview

react-vis-force applies the [react-vis](https://github.com/uber/react-vis) and [d4-style component approach](https://d4.js.org/) to the [d3-force](https://github.com/d3/d3-force) library. This allows users to declaratively provide links and nodes as children of a ForceGraph component.

## Example

```javascript
import React from 'react';
import {ForceGraph, ForceGraphNode, ForceGraphLink} from 'react-vis-force';

<ForceGraph simulationOptions={{ height: 300, width: 300 }}>
  <ForceGraphNode node={{ id: 'first-node', radius: 5 }} fill="red" />
  <ForceGraphNode node={{ id: 'second-node', radius: 5 }} fill="blue" />
  <ForceGraphLink link={{ source: 'first-node', target: 'second-node' }} />
</ForceGraph>
```

## Docs

* InteractiveForceGraph
* ForceGraph
