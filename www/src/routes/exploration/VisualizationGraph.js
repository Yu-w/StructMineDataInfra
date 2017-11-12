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

class VisualizationGraph extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      hoveredLink: null,
    }
  }

  render() {
    const {
      hoveredLink
    } = this.state;
    const { width } = this.props.size;
    const scale = d3.scaleOrdinal(d3.schemeCategory20);

    return (
      <InteractiveForceGraph
        zoom
        zoomOptions={{
          minScale: 1,
          maxScale: 5,
          onZoom: () => {},
          onPan: () => {},
        }}
        highlightDependencies
        simulationOptions={{
          animate: true,
          height: 720,
          width: width,
        }}
      >
        {lesMisJSON.nodes.map(node => (
          <ForceGraphNode
            key={node.id}
            fill={scale(node.group)}
            node={{ ...node, radius: 8 }}
            onClick={_ => console.log(node)}
          />
        ))}
        {lesMisJSON.links.map(link => (
          <ForceGraphLink
            key={`${link.source}=>${link.target}`}
            onMouseEnter={() => this.setState({hoveredLink: link})}
            onMouseLeave={() => this.setState({hoveredLink: null})}
            link={{ ...link, value: hoveredLink === link ? 12 : 1 }}
            strokeWidth={!hoveredLink ? 2 : null}
            onClick={_ => console.log(link)}
          />
        ))}
      </InteractiveForceGraph>
      );
    }

}

export default sizeMe({ monitorWidth: true })(VisualizationGraph);
