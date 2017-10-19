import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationMoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TreeView from './TreeView'
import ChipInput from 'material-ui-chip-input'

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
    const leftLabel = this.state.leftLabel ? null : <ToolbarTitle style={{fontSize: 17}} text={'Left Entity:'} />;
    const rightLabel = this.state.rightLabel ? null : <ToolbarTitle style={{fontSize: 17}} text={'Right Entity:'} />;
    return (
      <Toolbar style={{height:72, borderRadius: 36}}>
        <ToolbarGroup>
          {leftLabel}
          <TreeView
            label={this.state.leftEntity || 'Make a Selection'}
            onSelection={(label) => this.setState({leftEntity: label})} />
          <ChipInput
            dataSource={['Yo', 'Yoo', 'This is awesome']}
            onChange={(chips) => this.handleChipChange(chips)}
            hintText={'Specific Entities'}
            fullWidthInput={true}
            disabled={!this.state.leftEntity}
            style={{height: 60, marginLeft: 8}}
            chipContainerStyle={{ overflow: 'auto', maxHeight: 60 }}
            openOnFocus={true}
            underlineShow={false}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          {rightLabel}
          <TreeView
            label={this.state.rightEntity || 'Make a Selection'}
            onSelection={(label) => this.setState({rightEntity: label})} />
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
