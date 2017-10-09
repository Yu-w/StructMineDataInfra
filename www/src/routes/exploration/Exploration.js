import React, { Component } from 'react'
import {TreeList} from 'react-treeview-mui'

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Exploration.css';
import TreeView from './TreeView'

class Exploration extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Network Exploration</h1>
          <TreeView />
        </div>
      </div>
    );
  }

}

export default withStyles(s)(Exploration);
