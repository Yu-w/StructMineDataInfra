import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Exploration.css';

class Exploration extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Network Exploration</h1>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Exploration);
