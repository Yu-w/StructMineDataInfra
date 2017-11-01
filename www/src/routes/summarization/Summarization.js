import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Summarization.css';

import VisualizationGraph from './../exploration/VisualizationGraph';

class Summarization extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <VisualizationGraph />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Summarization);
