import React, { cloneElement } from 'react';
import Graph from "react-graph-vis";
import sizeMe from 'react-sizeme'
const d3 = require('d3');

class VisualizationGraph extends React.Component {

  constructor(props) {
    super(props)
  }

  onSelect = (bigEvent) => {
    const completeNodes = this.props.nodes;
    const completeEdges = this.props.edges;
    let { nodes, edges, event } = bigEvent;
    if (!nodes.length && !edges.length) { // Deselect
      this.props.onDeselect(event)
    } else if (!nodes.length) { // Select Edge
      const targetEdge = completeEdges.filter(x => x.id === edges[0])[0]
      this.props.onSelectEdge(event, targetEdge)
    } else { //Select Node
      const targetNode = completeNodes.filter(x => x.id === nodes[0])[0]
      this.props.onSelectNode(event, targetNode)
    }
  }

  render() {
    let {
      nodes,
      edges,
    } = this.props;
    const { width } = this.props.size;
    const scale = d3.scaleOrdinal(d3.schemeCategory20);

    nodes = nodes.map( x => Object.assign({}, x, styles.nodeStyle, {label: x.name, color: scale(x.group)}));
    edges = edges.map( x => Object.assign({}, x, {from: x.source, to: x.target}));

    const graph = {
      nodes,
      edges
    };

    const options = {
      layout: {
        hierarchical: false
      },
      edges: {
        color: "#000000"
      },
      interaction:{
        hover:true
      }
    };

    const events = {
      select: this.onSelect,
    };

    return (
      <Graph
        graph={graph}
        options={options}
        events={events}
        style={{
          width: width,
          height: 640
        }} />
      );
    }

}

const styles = {
  nodeStyle: {
    shape: 'dot',
    size: 22,
    shadow: true
  }
}

export default sizeMe({ monitorWidth: true })(VisualizationGraph);
