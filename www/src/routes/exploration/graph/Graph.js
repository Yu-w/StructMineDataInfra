import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Graph.css';

import VisualizationGraph from './../VisualizationGraph';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';

class Graph extends React.Component {

  render() {
    const SIDE_BAR_WIDTH = 400;
    return (
      <div className={s.root}>
        <div className={s.container} style={{marginRight: SIDE_BAR_WIDTH}}>
          <VisualizationGraph />
          <Drawer width={SIDE_BAR_WIDTH} openSecondary={true} open={true} >
            <AppBar title="Entities" />
          </Drawer>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Graph);
