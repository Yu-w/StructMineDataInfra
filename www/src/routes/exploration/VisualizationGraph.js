import React, { cloneElement } from 'react';

import { InteractiveForceGraph, ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';
import sizeMe from 'react-sizeme'
const d3 = require('d3');

import lesMisJSON from './les-miserables.json';

function action(str) {
  console.log(str);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function attachEvents(child) {
  return cloneElement(child, {
    onMouseDown: action(`clicked <${child.type.name} />`),
    onMouseOver: action(`hovered <${child.type.name} />`),
    onMouseOut: action(`blurred <${child.type.name} />`),
  });
}

class VisualizationGraph extends React.Component {


  render() {
    const { width } = this.props.size;
    console.log(this.props.size);
    const scale = d3.scaleOrdinal(d3.schemeCategory20);

    return (
      <InteractiveForceGraph
        zoom
        zoomOptions={{
          minScale: 0.75,
          maxScale: 5,
          onZoom: action('zoomed'),
          onPan: action('panned'),
        }}
        highlightDependencies
        simulationOptions={{
          animate: true,
          height: 400,
          width: width,
        }}
        onSelectNode={action('node selected')}
        onDeselectNode={action('node deselected')}
      >
        {lesMisJSON.nodes.map(node => (
          <ForceGraphNode
            key={node.id}
            fill={scale(node.group)}
            node={{ ...node, radius: getRandomInt(4, 9) }}
          />
        )).map(attachEvents)}
        {lesMisJSON.links.map(link => (
          <ForceGraphLink
            key={`${link.source}=>${link.target}`}
            link={{ ...link, value: 2 }}
          />
        )).map(attachEvents)}
      </InteractiveForceGraph>
    );
  }

}

export default sizeMe({ monitorWidth: true })(VisualizationGraph);
