import React, { cloneElement } from 'react';

import { InteractiveForceGraph, ForceGraph, ForceGraphNode, ForceGraphLink } from './../../../UIComponents/ReactVisForceGraph';
import sizeMe from 'react-sizeme'
const d3 = require('d3');

class VisualizationGraph extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      hoveredEdge: null,
    }
  }

  render() {
    const {
      hoveredEdge,
    } = this.state;
    let {
      nodes,
      edges,
    } = this.props;
    const { width } = this.props.size;
    const scale = d3.scaleOrdinal(d3.schemeCategory20);

    nodes = nodes.map( x => Object.assign({}, x, {id: x.name}))
    return (
      <InteractiveForceGraph
        zoom
        zoomOptions={{
          minScale: 1,
          maxScale: 5,
          panLimit: 1,
        }}
        highlightDependencies
        simulationOptions={{
          animate: true,
          height: 600,
          width: width,
        }}
        onSelectNode={(event, node) => this.props.onSelectNode(event, node)}
        onDeselectNode={(event, node) => this.props.onDeselectNode(event, node)}
      >
        {nodes.map(node => (
          <ForceGraphNode
            key={node.id}
            fill={scale(node.group)}
            node={{ ...node, radius: 8 }}
            showLabel
          />
        ))}
        {edges.map(edge => (
          <ForceGraphLink
            key={`${edge.source}=>${edge.target}`}
            onMouseEnter={() => this.setState({ hoveredEdge: edge })}
            onMouseLeave={() => this.setState({ hoveredEdge: null })}
            link={{ ...edge, value: hoveredEdge === edge ? 12 : 1 }}
            strokeWidth={!hoveredEdge ? 2 : null}
            onClick={event => this.props.onSelectEdge(event, edge)}
          />
        ))}
      </InteractiveForceGraph>
      );
    }

}

export default sizeMe({ monitorWidth: true })(VisualizationGraph);
