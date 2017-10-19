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
      leftEntityLabel: null,
      rightEntityLabel: null,
    };
  }

  handleChipChange(chips) {

  }

  render() {
    return (
      <Toolbar style={{borderRadius: 30}}>
        <ToolbarGroup>
          {/* <ToolbarTitle style={{fontSize: 17}} text={'Left Entity:'} /> */}
          <TreeView
            label={this.state.leftEntityLabel || 'Make a Selection'}
            onSelection={(label) => this.setState({leftEntityLabel: label})} />
          <ChipInput
            defaultValue={['foo', 'bar']}
            dataSource={['Yo', 'Yoo', 'This is awesome']}
            onChange={(chips) => this.handleChipChange(chips)}
            chipContainerStyle={{margin: 8}}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarTitle style={{fontSize: 17, marginLeft: 16}} text={'Right Entity:'} />
          <TreeView
            label={this.state.rightEntityLabel || 'Make a Selection'}
            onSelection={(label) => this.setState({rightEntityLabel: label})} />
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
