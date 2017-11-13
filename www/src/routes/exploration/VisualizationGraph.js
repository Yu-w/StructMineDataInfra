import React, { cloneElement } from 'react';

import { InteractiveForceGraph, ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';
import sizeMe from 'react-sizeme'
const d3 = require('d3');

import lesMisJSON from './les-miserables.json';

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
          panLimit: 1,
          onZoom: () => {},
          onPan: () => {},
        }}
        highlightDependencies
        simulationOptions={{
          animate: true,
          height: 720,
          width: width,
        }}
        onSelectNode={(event, node) => console.log(node)}
        onDeselectNode={(event, node) => console.log(node)}
      >
        {lesMisJSON.nodes.map(node => (
          <ForceGraphNode
            key={node.id}
            fill={scale(node.group)}
            node={{ ...node, radius: 8 }}
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
