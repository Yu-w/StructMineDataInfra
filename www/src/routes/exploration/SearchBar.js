import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationMoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TreeView from './TreeView'
import ChipInput from 'material-ui-chip-input'
import Chip from 'material-ui/Chip'

export default class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      leftEntity: null,
      rightEntity: null,
    };
  }

  handleChipChange(chips) {

  }

  render() {
    // const leftLabel = !this.state.leftLabel ? (<ToolbarTitle style={{fontSize: 17}} text={'Left Entities:'} />) : null;
    // const rightLabel = !this.state.rightLabel ? <ToolbarTitle style={{fontSize: 17}} text={'Right Entities:'} /> : null;
    const chipInput = (
      <ChipInput
        dataSource={['Yo', 'Yoo', 'This is awesome']}
        onChange={(chips) => this.handleChipChange(chips)}
        hintText={'Specific Entities'}
        fullWidthInput={true}
        disabled={!this.state.leftEntity}
        style={{height: 64, marginLeft: 8, color: 'black'}}
        chipContainerStyle={{ overflow: 'auto', maxHeight: 64 }}
        openOnFocus={true}
        underlineShow={false}
        chipRenderer={({ value, isFocused, isDisabled, handleClick, handleRequestDelete, defaultStyle }, key) => (
          <Chip
            key={key}
            style={{ ...defaultStyle, pointerEvents: isDisabled ? 'none' : undefined }}
            backgroundColor={isFocused ? 'gray': 'white'}
          >
            {value}
          </Chip>
        )}
      />
    )
    return (
      <Toolbar style={{height:64, borderRadius: 64 / 2}}>
        <ToolbarGroup style={{paddingLeft: 8}}>
          <TreeView
            label={this.state.leftEntity || 'Left Entity Categories'}
            onSelection={(label) => this.setState({leftEntity: label})}
          />
          {chipInput}
        </ToolbarGroup>
        <ToolbarGroup>
          <TreeView
            label={this.state.rightEntity || 'Left Entity Categories'}
            onSelection={(label) => this.setState({rightEntity: label})}
          />
          {chipInput}
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarSeparator />
          <RaisedButton label="Entity Relationship" primary={true} disabled={true} />
          <IconMenu iconButtonElement={
            <IconButton touch={true}>
              <NavigationMoreHorizIcon />
            </IconButton> }>
            <MenuItem primaryText="Download" />
            <MenuItem primaryText="More Info" />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
