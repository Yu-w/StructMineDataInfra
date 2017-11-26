import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Summarization.css';

class Summarization extends React.Component {

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Summarization);
