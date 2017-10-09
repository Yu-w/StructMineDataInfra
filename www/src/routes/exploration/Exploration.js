import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Subheader from 'material-ui/Subheader';
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
            <div style={{height: 44}}/>
            <Subheader>Network Exploration: Explanation comes here</Subheader>
            <SearchBar />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

}

export default withStyles(s)(Exploration);
