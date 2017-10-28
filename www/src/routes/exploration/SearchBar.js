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
import Snackbar from 'material-ui/Snackbar';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TreeView from './TreeView';
import ChipInput from 'material-ui-chip-input';
import Chip from 'material-ui/Chip';

export default class SearchBar extends React.PureComponent {

  _dataSource = ['Yo', 'Yoo', 'This is Awesome', 'Example', 'Wow', 'More', 'And More'];

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
      openSnackbar: false,
    };
  }

  componentDidMount() {
    this.updateActiveStep();
  }

  handleLeftTreeViewSelect = (label) => {
    this.setState({leftEntity: label}, this.updateActiveStep)
  }

  handleRightTreeViewSelect = (label) => {
    this.setState({rightEntity: label}, this.updateActiveStep)
  }

  handleLeftChipAddRequest = (chip) => {
    if (this._dataSource.indexOf(chip) >= 0) {
      this.setState({leftChips: this.state.leftChips.concat([chip])});
    } else {
      this.setState({openSnackbar: true})
    }
  }

  handleRightChipAddRequest = (chip) => {
    if (this._dataSource.indexOf(chip) >= 0) {
      this.setState({leftChips: this.state.leftChips.concat([chip])});
    } else {
      this.setState({openSnackbar: true})
    }
  }

  handleLeftChipDeleteRequest = (chip, index) => {
    const chips = this.state.leftChips.filter(x => x !== chip);
    this.setState({leftChips: chips});
  }

  handleRightChipDeleteRequest = (chip, index) => {
    const chips = this.state.rightChips.filter(x => x !== chip);
    this.setState({rightChips: chips});
    }

  handleRelationshipMenuTapped = (event) => {
    event.preventDefault();
    this.setState({
      openRelationshipMenu: true,
      relationshipMenuAnchorEl: event.currentTarget,
      relationship: 'yo',
    }, this.updateActiveStep);
  }

  handleLeftChipInputFocus = () => {
    this.setState({onLeftChipInput: true});
  }

  handleRightChipInputFocus = () => {
    this.setState({onRightChipInput: true});
  }

  handleChipInputBlur = () => {
    // To prevent close autocomplete will fire chip input blur
    if (this.state.autocompleteClose) return;
    this.setState({
      onLeftChipInput: false,
      onRightChipInput: false,
    });
  }

  handleAutocompleteOnClose = () => {
    this.setState({autocompleteClose: true});
    setTimeout(() => {
      this.setState({autocompleteClose: false});
    }, 200);
  }

  updateActiveStep = () => {
    let activeStep = 0;
    const {leftEntity, rightEntity, relationship} = this.state;
    if (leftEntity && rightEntity && relationship) {
      activeStep = 3;
    } else if (leftEntity && rightEntity) {
      activeStep = 2;
    } else if (leftEntity) {
      activeStep = 1;
    }
    this.setState({activeStep: activeStep});
    this.props.onActiveStepChange(activeStep);
  }

  render() {
    const {
      leftChips,
      rightChips,
      onLeftChipInput,
      onRightChipInput,
    } = this.state;
    const barHeight = (!onLeftChipInput && !onRightChipInput) ? 64 : 108;
    const chipInputStyle = { height: barHeight, marginLeft: 4, paddingLeft: 4, marginRight: 4, paddingRight: 4 };
    const chipInputContainerStyle = { overflow: 'auto', maxHeight: 64 };
    let chipRenderer = ({ value, isFocused, isDisabled, handleClick, handleRequestDelete, defaultStyle }, key) => (
      <Chip
        key={key}
        onRequestDelete={() => {}}
        style={{ ...defaultStyle, pointerEvents: isDisabled ? 'none' : undefined }}
        backgroundColor={isFocused ? '#666666': '#fff'}>
        {value}
      </Chip>
    );
    return (
      <div>
        <Toolbar style={{...this.props.style, height: barHeight, borderRadius: barHeight / 2}}>
          <ToolbarGroup style={{paddingLeft: 8}}>
            <TreeView
              label={this.state.leftEntity || 'Left Entity Category'}
              onSelection={this.handleLeftTreeViewSelect}
            />
            <ChipInput
              value={leftChips}
              dataSource={this._dataSource}
              onFocus={this.handleLeftChipInputFocus}
              onClose={this.handleAutocompleteOnClose}
              onBlur={this.handleChipInputBlur}
              onRequestAdd={this.handleLeftChipAddRequest}
              onRequestDelete={this.handleLeftChipDeleteRequest}
              openOnFocus={true}
              hintText={!onLeftChipInput ? 'Specific Entities (Optional)' : null}
              disabled={!this.state.leftEntity}
              style={{...chipInputStyle, backgroundColor: (onLeftChipInput || leftChips.length) ? 'rgba(0, 0, 0, 0.07)' : null}}
              chipContainerStyle={chipInputContainerStyle}
              openOnFocus={true}
              underlineShow={onLeftChipInput === true}
              chipRenderer={chipRenderer}
            />
          </ToolbarGroup>
          <ToolbarGroup>
            <TreeView
              label={this.state.rightEntity || 'Right Entity Category'}
              onSelection={this.handleRightTreeViewSelect}
            />
            <ChipInput
              dataSource={this._dataSource}
              onFocus={this.handleRightChipInputFocus}
              onClose={this.handleAutocompleteOnClose}
              onBlur={this.handleChipInputBlur}
              onRequestAdd={this.handleRightChipAddRequest}
              onRequestDelete={this.handleRightChipDeleteRequest}
              openOnFocus={true}
              hintText={!onRightChipInput ? 'Specific Entities (Optional)' : null}
              disabled={!this.state.rightEntity}
              style={{...chipInputStyle, backgroundColor: (onRightChipInput || rightChips.length) ? 'rgba(0, 0, 0, 0.07)' : null}}
              chipContainerStyle={chipInputContainerStyle}
              openOnFocus={true}
              underlineShow={onRightChipInput === true}
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
        <Snackbar
          open={this.state.openSnackbar}
          message="Invalid entity cannot be added."
          autoHideDuration={3000}
          onRequestClose={() => this.setState({openSnackbar: false})}
        />
      </div>
    );
  }
}
