import React, { Component } from 'react'
// import Dropdown from './dropdown'
import {TreeList} from 'react-treeview-mui'

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Exploration.css';
import TreeView from './TreeView'

class Exploration extends React.Component {
  render() {
    const listItems = [
      {
        depth: 0, // Used to style the list item. Items with 0 depth will not be rendered and act as the root parent
        children: [1, 3, 10] // Indexes for child list items. If undefined, list item will be treated as leaf
      },
      {
        title: 'Tree in Dropdown',
        depth: 1,
        children: [4],
        parentIndex: 0, // Index of parent list item
      },
      {
        title: 'Hello',
        depth: 1,
        children: [],
        parentIndex: 0,
      },
      {
        title: 'World',
        depth: 1,
        children: [],
        parentIndex: 0,
      },
      {
        title: 'okay, now hello world',
        depth: 2,
        children: [],
        parentIndex: 3,
      },
    ];
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Network Exploration</h1>
          {/* <Dropdown /> */}
          {/* <TreeList
            listItems={listItems}
            contentKey={'title'}
            useFolderIcons={true}
            haveSearchbar={true}
            expandedListItems={[3]}
            activeListItem={4}
            icons={{
              leftIconCollapsed: <i style={{height: 16, width: 16, color: '#CCCCCC'}} className="fa fa-caret-right" />,
              leftIconExpanded: <i style={{height: 16, width: 16, color: '#CCCCCC'}} className="fa fa-caret-down" />
            }}
          /> */}
          <TreeView />
        </div>
      </div>
    );
  }

}

export default withStyles(s)(Exploration);
