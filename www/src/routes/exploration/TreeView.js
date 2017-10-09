import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Drawer from 'material-ui/Drawer'
import Subheader from 'material-ui/Subheader'
import {TreeList} from 'react-treeview-mui'


const listItems = [
  {
    depth: 0, // Used to style the list item. Items with 0 depth will not be rendered and act as the root parent
    children: [1, 5] // Indexes for child list items. If undefined, list item will be treated as leaf
  },
  {
    title: 'Tree in Dropdown',
    depth: 1,
    children: [2, 3, 4],
    parentIndex: 0,
  },
  {
    title: 'Tree',
    depth: 2,
    parentIndex: 1,
  },
  {
    title: 'Tree in',
    depth: 2,
    parentIndex: 1,
  },
  {
    title: 'Tree in Dropdown',
    depth: 2,
    children: [6],
    parentIndex: 1,
  },
  {
    title: 'Subtree lol',
    depth: 3,
    parentIndex: 4,
  },
  {
    title: 'Hello World',
    depth: 1,
    children: [7, 8],
    parentIndex: 0,
  },
  {
    title: 'Hello',
    depth: 2,
    parentIndex: 6,
  },
  {
    title: 'Hello World',
    depth: 2,
    parentIndex: 6,
  }
];

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expandedListItems: [],
      activeListItem: null,
      listItems,
      searchTerm: '',
    }
    this.collapseAll = this.collapseAll.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleTouchTap = this.handleTouchTap.bind(this)
    this.handleTouchTapInSearchMode = this.handleTouchTapInSearchMode.bind(this)
  }

  collapseAll() {
    this.setState({expandedListItems: []})
  }

  handleSearch(searchTerm) {
    this.setState({searchTerm})
  }

  handleTouchTap(listItem, index) {
    if (listItem.children) {
      const indexOfListItemInArray = this.state.expandedListItems.indexOf(index)
      if  (indexOfListItemInArray === -1) {
        this.setState({
          expandedListItems: this.state.expandedListItems.concat([index])
        })
      } else {
        let newArray = [].concat(this.state.expandedListItems)
        newArray.splice(indexOfListItemInArray, 1)
        this.setState({
          expandedListItems: newArray
        })
      }
    } else {
      this.setState({
        activeListItem: index
      })
    }
  }

  handleTouchTapInSearchMode(listItem, index) {
    if (!listItem.children) {
      const expandedListItems = getAllParents(listItem, listItems)

      this.setState({
        activeListItem: index,
        expandedListItems,
        searchTerm: ''
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {activeListItem, listItems} = this.state
    if (activeListItem !== prevState.activeListItem) {
      const expandedListItems = getAllParents(listItems[activeListItem], listItems)
      this.setState({
        expandedListItems: expandedListItems
      })
    }
  }

  render() {
    const {listItems, expandedListItems, activeListItem, searchTerm} = this.state

    const icons = {
      leftIconCollapsed: <i style={{height: 16, width: 16, color: '#CCCCCC'}} className="fa fa-caret-right" />,
      leftIconExpanded: <i style={{height: 16, width: 16, color: '#CCCCCC'}} className="fa fa-caret-down" />
    }

    return (
      <TreeList
        listItems={listItems}
        contentKey={'title'}
        useFolderIcons={true}
        haveSearchbar={true}
        expandedListItems={expandedListItems}
        activeListItem={activeListItem}
        handleTouchTap={this.handleTouchTap}
        handleTouchTapInSearchMode={this.handleTouchTapInSearchMode}
        handleSearch={this.handleSearch}
        searchTerm={searchTerm}
        icons={icons}>
      </TreeList>
    );
  }
}

export default App;

function getAllParents(listItem, listItems, parents=[]) {
  if (listItem.parentIndex) {
    return getAllParents(listItems[listItem.parentIndex], listItems, parents.concat([listItem.parentIndex]))
  } else {
    return parents
  }
}
