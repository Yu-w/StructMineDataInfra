import React from 'react';
import NavigationMoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import ActionSearchIcon from 'material-ui/svg-icons/action/search';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import TreeView from './TreeView';
import { StringUtils } from './../utils';
import EntityChipInput from './EntityChipInput';

export default class SearchBar extends React.PureComponent {

  _dataSource = ['Yo', 'Yoo', 'This is Awesome', 'Example', 'Wow', 'More', 'And More'];

  constructor(props) {
    super(props);
    this.state = {
      leftCategory: null,
      rightCategory: null,
      leftEntities: [],
      rightEntities: [],
      openRelationshipMenu: false,
      barHeight: 64,
      activeStep: 0,
      relationship: null,
    };
  }

  componentDidMount() {
    this.updateActiveStep();
  }

  handleLeftTreeViewSelect = (label) => {
    this.setState({leftCategory: StringUtils.trimLength(label)}, this.updateActiveStep)
  }

  handleRightTreeViewSelect = (label) => {
    this.setState({rightCategory: StringUtils.trimLength(label)}, this.updateActiveStep)
  }

  handleRelationshipMenuTapped = (event) => {
    event.preventDefault();
    this.setState({
      openRelationshipMenu: true,
      relationshipMenuAnchorEl: event.currentTarget,
      relationship: 'yo',
    }, this.updateActiveStep);
  }

  updateActiveStep = () => {
    let activeStep = 0;
    const {leftCategory, rightCategory, relationship} = this.state;
    if (leftCategory && rightCategory && relationship) {
      activeStep = 3;
    } else if (leftCategory && rightCategory) {
      activeStep = 2;
    } else if (leftCategory) {
      activeStep = 1;
    }
    this.setState({activeStep: activeStep});
    this.props.onActiveStepChange(activeStep);
  }

  render() {
    const {
      leftCategory,
      rightCategory,
      leftChips,
      rightChips,
      onChipEditing,
      onRightChipInput,
    } = this.state;
    const barHeight = !onChipEditing ? 64 : 108;
    return (
      <Toolbar style={{...this.props.style, height: barHeight, borderRadius: 16}}>
        <ToolbarGroup style={{paddingLeft: 8}}>
          <TreeView
            label={this.state.leftCategory || StringUtils.trimLength('Left Entity Category')}
            onSelection={this.handleLeftTreeViewSelect}
          />
          <EntityChipInput
            onChange={(leftEntities) => this.setState(leftEntities)}
            height={barHeight}
            category={leftCategory}
            dataSource={this._dataSource}
            disabled={!leftCategory}
            onChipEditing={(onChipEditing) => this.setState({onChipEditing})}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <TreeView
            label={this.state.rightCategory || StringUtils.trimLength('Right Entity Category')}
            onSelection={this.handleRightTreeViewSelect}
          />
          <EntityChipInput
            onChange={(rightEntities) => this.setState(rightEntities)}
            height={barHeight}
            dataSource={this._dataSource}
            disabled={!rightCategory}
            onChipEditing={(onChipEditing) => this.setState({onChipEditing})}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarSeparator style={{marginLeft: 0}} />
          <Popover
            open={this.state.openRelationshipMenu}
            anchorEl={this.state.relationshipMenuAnchorEl}
            onRequestClose={() => this.setState({openRelationshipMenu: false})}
            animation={PopoverAnimationVertical}
          >
            <Menu>
              {this._dataSource.map(x => (<MenuItem primaryText={x}/>))}
            </Menu>
          </Popover>
          <RaisedButton
            label="Relationship"
            labelPosition="before"
            icon={<NavigationExpandMoreIcon style={{width:16, height: 16}}/>}
            onClick={this.handleRelationshipMenuTapped}
            style={{marginLeft: 16, marginRight: 16}}
          />
          <FloatingActionButton
            mini={true}
            disabled={!this.state.leftCategory || !this.state.rightCategory}
              >
                <ActionSearchIcon />
              </FloatingActionButton>
            </ToolbarGroup>
          </Toolbar>
        );
      }
    }
