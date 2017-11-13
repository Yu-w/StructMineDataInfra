import React, { Component } from 'react';
import { MuiTreeList } from 'react-treeview-mui';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';

import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Dialog from 'material-ui/Dialog';

import listItems from './entityCategoryData.json'

class TreeView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expandedListItems: [],
      activeListItem: null,
      listItems,
      searchTerm: '',
      open: false,
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.handleTreeViewTap = this.handleTreeViewTap.bind(this)
    this.handleTouchTapInSearchMode = this.handleTouchTapInSearchMode.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
  }

  handleSearch(searchTerm) {
    this.setState({searchTerm})
  }

  handleTreeViewTap(listItem, index) {
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
      }, () => {
        if (this.state.activeListItem !== null)
          this.props.onSelection(listItems[index].title)
        this.handleRequestClose();
      })
    }
  }

  handleTouchTapInSearchMode(listItem, index) {
    if (!listItem.children) {
      this.handleTreeViewTap(listItem, index);
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

  handleButtonClick = (event) => {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
      expandedListItems: [],
    });
  };

  render() {
    const {listItems, expandedListItems, activeListItem, searchTerm} = this.state

    return (
      <div>
        <RaisedButton
          onClick={this.handleButtonClick}
          label={this.props.label}
          labelPosition='before'
          icon={<NavigationExpandMoreIcon style={{width:18, height: 18}} />}
        />
        <Dialog
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationVertical}
          autoScrollBodyContent={true}
          open={this.state.open}
        >
          <MuiTreeList
            listItems={listItems}
            contentKey={'title'}
            useFolderIcons={false}
            haveSearchbar={true}
            expandedListItems={expandedListItems}
            activeListItem={activeListItem}
            handleTouchTap={this.handleTreeViewTap}
            handleTouchTapInSearchMode={this.handleTouchTapInSearchMode}
            handleSearch={this.handleSearch}
            searchTerm={searchTerm}>
          </MuiTreeList>
        </Dialog>
      </div>
    );
  }
}

export default TreeView;

function getAllParents(listItem, listItems, parents=[]) {
  if (listItem.parentIndex) {
    return getAllParents(listItems[listItem.parentIndex], listItems, parents.concat([listItem.parentIndex]))
  } else {
    return parents
  }
}
