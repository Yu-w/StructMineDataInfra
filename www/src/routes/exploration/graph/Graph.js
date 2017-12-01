import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Graph.css';

import VisualizationGraph from './VisualizationGraph';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';

import SearchBar from './../SearchBar';
import SideBar from './SideBar';

class Graph extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
    }
  }

  onSelectNode = (event, node) => {
    event.preventDefault()
    const articles = node.sents.map(x => { return {title: x.artitle_title, subtitle: x.sent, pmid: x.pmid, highlights:[node.name]} })
    this.setState({
      articles: articles
    })
  }

  onDeselect = (event) => {
    event.preventDefault()
    this.setState({
      articles: []
    })
  }

  onSelectEdge = (event, edge) => {
    event.preventDefault()
    const articles = edge.sents.map(x => { return {title: x.article_title, subtitle: x.sent, pmid: x.pmid} })
    this.setState({
      articles: articles
    })
  }

  render() {
    let {
      nodes,
      edges,
    } = this.props.data;
    nodes = nodes.map(x => Object.assign({}, x, {id: x.name}));
    edges = edges.map(x => Object.assign({}, x, {id: `${x.source}@${x.target}`}));
    const {
      articles
    } = this.state;

    const SIDE_BAR_WIDTH = 400;
    return (
      <div className={s.root}>
        <div className={s.container} style={{marginRight: SIDE_BAR_WIDTH}}>
          <SearchBar
            style={{marginTop: 12}}
            {...this.props.query}
          />
          <VisualizationGraph
            nodes={nodes}
            edges={edges}
            onSelectNode={this.onSelectNode}
            onDeselect={this.onDeselect}
            onSelectEdge={this.onSelectEdge}
          />
          <Drawer width={SIDE_BAR_WIDTH} openSecondary={true} open={true} >
            <AppBar title="Graph Exploration" />
            <SideBar articles={articles} />
          </Drawer>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Graph);
