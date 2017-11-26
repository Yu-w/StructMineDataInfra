import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Graph.css';

import VisualizationGraph from './VisualizationGraph';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';

import SearchBar from './../SearchBar';

class Graph extends React.Component {

  render() {
    const{
      nodes,
      edges,
    } = this.props.data;

    const SIDE_BAR_WIDTH = 400;
    return (
      <div className={s.root}>
        <div className={s.container} style={{marginRight: SIDE_BAR_WIDTH}}>
          <SearchBar
            style={{marginTop: 8}}
            {...this.props.query}
          />
          <VisualizationGraph
            nodes={nodes}
            edges={edges}
          />
          <Drawer width={SIDE_BAR_WIDTH} openSecondary={true} open={true} >
            <AppBar title="Entities" />
          </Drawer>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Graph);
