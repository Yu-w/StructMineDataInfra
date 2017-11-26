import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Graph.css';

import VisualizationGraph from './VisualizationGraph';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';

import SearchBar from './../SearchBar';
import SideBar from './SideBar';

class Graph extends React.Component {

  render() {
    const{
      nodes,
      edges,
    } = this.props.data;

    const articles = nodes
      .filter(x => x.sents && x.sents.length)
      .map(x => x.sents[0])
      .map(x => { return {title: x.artitle_title, subtitle: x.sent, pmid: x.pmid} });

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
