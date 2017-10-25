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

export default class SearchBar extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      leftEntity: null,
      rightEntity: null,
      leftChips: [],
      rightChips: [],
      openRelationshipMenu: false,
      barHeight: 64,
      activeStep: 0,
      relationship: null,
    };
  }

  handleLeftTreeViewSelect = (label) => {
    this.setState({leftEntity: label}, this.updateActiveStep)
  }

  handleRightTreeViewSelect = (label) => {
    this.setState({rightEntity: label}, this.updateActiveStep)
  }

  handleLeftChipChange = (chips) => {
    this.setState({leftChips: chips}, this.updateActiveStep);
  }

  handleRightChipChange = (chips) => {
    this.setState({rightChips: chips}, this.updateActiveStep);
  }

  handleRelationshipMenuTapped = (event) => {
    event.preventDefault();
    this.setState({
      openRelationshipMenu: true,
      relationshipMenuAnchorEl: event.currentTarget,
      relationship: 'yo',
    }, this.updateActiveStep);
  }

  handleChipInputFocus = () => {
    this.setState({onChipInput: true});
  }

  handleChipInputBlur = () => {
    // To prevent close autocomplete will fire chip input blur
    if (this.state.autocompleteClose) return;
    this.setState({onChipInput: false}, this.updateActiveStep);
  }

  handleAutocompleteOnClose = () => {
    this.setState({autocompleteClose: true});
    setTimeout(() => {
      this.setState({autocompleteClose: false});
    }, 200);
  }

  updateActiveStep = () => {
    let activeStep = 0;
    const {leftEntity, rightEntity, leftChips, rightChips, relationship} = this.state;
    if (leftEntity && rightEntity && leftChips.length && rightChips.length && relationship) {
      activeStep = 5;
    } else if (leftEntity && rightEntity && leftChips.length && rightChips.length) {
      activeStep = 4;
    } else if (leftEntity && rightEntity && leftChips.length) {
      activeStep = 3;
    } else if (leftEntity && this.state.leftChips.length) {
      activeStep = 2;
    } else if (leftEntity) {
      activeStep = 1;
    }
    this.setState({activeStep: activeStep});
    this.props.onActiveStepChange(activeStep);
  }

  render() {
    const dataSource = ['Yo', 'Yoo', 'This is Awesome', 'Example', 'Wow', 'More', 'And More'];
    const barHeight = !this.state.onChipInput ? 64 : 108;
    const chipInputHintText = !this.state.onChipInput ? 'Specific Entities' : null;
    const chipInputStyle = {height: barHeight, marginLeft: 8, color: 'black'};
    const chipInputContainerStyle = { overflow: 'auto', maxHeight: 64 };
    let chipRenderer = ({ value, isFocused, isDisabled, handleClick, handleRequestDelete, defaultStyle }, key) => (
      <Chip
        key={key}
        style={{ ...defaultStyle, pointerEvents: isDisabled ? 'none' : undefined }}
        backgroundColor={isFocused ? '#666666': '#fff'}>
        {value}
      </Chip>
    );
    return (
      <Toolbar style={{height: barHeight, borderRadius: barHeight / 2}}>
        <ToolbarGroup style={{paddingLeft: 8}}>
          <TreeView
            label={this.state.leftEntity || 'Left Entity Category'}
            onSelection={this.handleLeftTreeViewSelect}
          />
          <ChipInput
            dataSource={dataSource}
            onFocus={this.handleChipInputFocus}
            onClose={this.handleAutocompleteOnClose}
            onBlur={this.handleChipInputBlur}
            onChange={(chips) => this.handleLeftChipChange(chips)}
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
            onSelection={this.handleRightTreeViewSelect}
          />
          <ChipInput
            dataSource={dataSource}
            onFocus={this.handleChipInputFocus}
            onClose={this.handleAutocompleteOnClose}
            onBlur={this.handleChipInputBlur}
            onChange={(chips) => this.handleRightChipChange(chips)}
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
