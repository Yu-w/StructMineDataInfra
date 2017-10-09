import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {TreeList} from 'react-treeview-mui'

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Exploration.css';
import SearchBar from './SearchBar'

class Exploration extends React.Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className={s.root}>
          <div className={s.container}>
            <h1>Network Exploration</h1>
            <SearchBar />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

}

export default withStyles(s)(Exploration);
