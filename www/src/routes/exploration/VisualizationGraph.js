import React, { cloneElement } from 'react';

import { InteractiveForceGraph, ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';
import sizeMe from 'react-sizeme'
const d3 = require('d3');

import lesMisJSON from './les-miserables.json';
import graphData from './graphSampleData.json';

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

    let nodes = []
    nodes = nodes.concat(Object.keys(graphData['node_a']).map(x => { return { id: x, group: 0 } }));
    nodes = nodes.concat(Object.keys(graphData['node_b']).map(x => { return { id: x, group: 1 } }));

    const edges = graphData['edge'].map(x => { return { source: x.source, target: x.target, value: x.sents.length } })
    console.log(edges)

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
        {nodes.map(node => (
          <ForceGraphNode
            key={node.id}
            fill={scale(node.group)}
            node={{ ...node, radius: 8 }}
          />
        ))}
        {edges.map(link => (
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
