import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Summarization.css';

class Summarization extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Distinctive Summarization</h1>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Summarization);
