import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationMoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TreeView from './TreeView'

export default class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      leftEntityLabel: 'Left Entity',
      rightEntityLabel: 'Right Entity',
    };
  }

  handleChange = (event, index, value) => this.setState({value});

  render() {
    return (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarTitle style={{fontSize: 17}} text={'Left Entity:'} />
          <TreeView
            label={this.state.leftEntityLabel}
            onSelection={
              (label) => this.setState({leftEntityLabel: label})
            } />
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarTitle style={{fontSize: 17}} text={'Right Entity:'} />
          <TreeView
            label={this.state.rightEntityLabel}
            onSelection={
              (label) => this.setState({rightEntityLabel: label})
            } />
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarSeparator />
          <RaisedButton label="Entity Relationship" primary={true} />
          <IconMenu
            iconButtonElement={
              <IconButton touch={true}>
                <NavigationMoreHorizIcon />
              </IconButton>
            }
          >
            <MenuItem primaryText="Download" />
            <MenuItem primaryText="More Info" />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
