import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationMoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import ActionSearchIcon from 'material-ui/svg-icons/action/search';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TreeView from './TreeView';
import ChipInput from 'material-ui-chip-input';
import Chip from 'material-ui/Chip';

export default class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      leftEntity: null,
      rightEntity: null,
      openRelationshipMenu: false,
      barHeight: 64,
    };
  }

  handleChipChange(chips) {

  }

  handleRelationshipMenuTapped = (event) => {
    event.preventDefault();
    this.setState({
      openRelationshipMenu: true,
      relationshipMenuAnchorEl: event.currentTarget,
    });
  }

  handleChipInputClicked = () => {
    this.setState({onChipInput: true})
  }

  handleChipInputBlurred = () => {
    this.setState({onChipInput: false})
  }

  render() {
    // const leftLabel = !this.state.leftLabel ? (<ToolbarTitle style={{fontSize: 17}} text={'Left Entities:'} />) : null;
    // const rightLabel = !this.state.rightLabel ? <ToolbarTitle style={{fontSize: 17}} text={'Right Entities:'} /> : null;
    let chipRenderer = ({ value, isFocused, isDisabled, handleClick, handleRequestDelete, defaultStyle }, key) => (
      <Chip
        key={key}
        style={{ ...defaultStyle, pointerEvents: isDisabled ? 'none' : undefined }}
        backgroundColor={isFocused ? 'gray': 'white'}
      >
        {value}
      </Chip>
    );
    const barHeight = !this.state.onChipInput ? 64 : 100;
    const chipInputHintText = !this.state.onChipInput ? 'Specific Entities' : null;
    const chipInputStyle = {height: barHeight, marginLeft: 8, color: 'black'};
    const chipInputContainerStyle = { overflow: 'auto', maxHeight: 64 };
    return (
      <Toolbar style={{height: barHeight, borderRadius: barHeight / 2}}>
        <ToolbarGroup style={{paddingLeft: 8}}>
          <TreeView
            label={this.state.leftEntity || 'Left Entity Category'}
            onSelection={(label) => this.setState({leftEntity: label})}
          />
          <ChipInput
            dataSource={['Yo', 'Yoo', 'This is awesome']}
            onClick={this.handleChipInputClicked}
            onBlur={this.handleChipInputBlurred}
            onChange={(chips) => this.handleChipChange(chips)}
            openOnFocus={true}
            hintText={chipInputHintText}
            disabled={!this.state.leftEntity}
            style={chipInputStyle}
            chipContainerStyle={chipInputContainerStyle}
            openOnFocus={true}
            underlineShow={false}
            chipRenderer={chipRenderer}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <TreeView
            label={this.state.rightEntity || 'Right Entity Category'}
            onSelection={(label) => this.setState({rightEntity: label})}
          />
          <ChipInput
            dataSource={['Yo', 'Yoo', 'This is awesome']}
            onClick={this.handleChipInputClicked}
            onBlur={this.handleChipInputBlurred}
            onChange={(chips) => this.handleChipChange(chips)}
            openOnFocus={true}
            hintText={chipInputHintText}
            disabled={!this.state.rightEntity}
            style={chipInputStyle}
            chipContainerStyle={chipInputContainerStyle}
            openOnFocus={true}
            underlineShow={false}
            chipRenderer={chipRenderer}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarSeparator />
          <Popover
            open={this.state.openRelationshipMenu}
            anchorEl={this.state.relationshipMenuAnchorEl}
            onRequestClose={() => this.setState({openRelationshipMenu: false})}
            animation={PopoverAnimationVertical}
          >
            <Menu>
              <MenuItem primaryText="Refresh" />
              <MenuItem primaryText="Help &amp; feedback" />
              <MenuItem primaryText="Settings" />
              <MenuItem primaryText="Sign out" />
            </Menu>
          </Popover>
          <RaisedButton
            label="Relationship"
            labelPosition="before"
            icon={<NavigationExpandMoreIcon style={{width:16, height: 16}}/>}
            onClick={this.handleRelationshipMenuTapped}
          />
          <FloatingActionButton
            mini={true}
            disabled={!this.state.leftEntity || !this.state.rightEntity}
          >
            <ActionSearchIcon />
          </FloatingActionButton>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
