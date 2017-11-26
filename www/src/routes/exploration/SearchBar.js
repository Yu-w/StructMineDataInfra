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
import { NetworkExplorationAPI } from './../apiService';

import entityMap from './entityData.json';

export default class SearchBar extends React.PureComponent {

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
      relations: [],
      selectedRelation: null,
    };
  }

  componentDidMount() {
    this.updateActiveStep();
  }

  handleLeftTreeViewSelect = (label) => {
    this.setState({leftCategory: label, selectedRelation: null}, this.updateActiveStep)
  }

  handleRightTreeViewSelect = (label) => {
    this.setState({rightCategory: label, selectedRelation: null}, this.updateActiveStep)
  }

  handleRelationshipMenuTapped = (event) => {
    event.preventDefault();
    this.setState({
      openRelationshipMenu: true,
      relationshipMenuAnchorEl: event.currentTarget,
    });
  }

  updateActiveStep = () => {
    let activeStep = 0;
    const {leftCategory, rightCategory, selectedRelation} = this.state;
    if (leftCategory && rightCategory && selectedRelation) {
      activeStep = 3;
    } else if (leftCategory && rightCategory) {
      activeStep = 2;

      const {
        leftCategory,
        rightCategory,
        leftEntities,
        rightEntities,
      } = this.state;
      NetworkExplorationAPI.getRelationships(leftCategory, rightCategory, leftEntities, rightEntities)
      .then(data => this.setState({ relations: data.relations || [] }))

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
      relations,
      selectedRelation,
    } = this.state;

    const barHeight = !onChipEditing ? 64 : 108;
    return (
      <Toolbar style={{...this.props.style, height: barHeight, borderRadius: 16}}>
        <ToolbarGroup style={{paddingLeft: 8}}>
          <TreeView
            label={StringUtils.trimLength(this.state.leftCategory) || 'Left Entity Category'}
            onSelection={this.handleLeftTreeViewSelect}
          />
          {entityMap[leftCategory]
            ? <EntityChipInput
              onChange={(leftEntities) => this.setState(leftEntities)}
              height={barHeight}
              category={leftCategory}
              dataSource={entityMap[leftCategory]}
              disabled={!leftCategory}
              onChipEditing={(onChipEditing) => this.setState({onChipEditing})}
              />
            : null}
        </ToolbarGroup>
        <ToolbarGroup>
          <TreeView
            label={StringUtils.trimLength(this.state.rightCategory) || 'Right Entity Category'}
            onSelection={this.handleRightTreeViewSelect}
          />
          {entityMap[rightCategory]
            ? <EntityChipInput
              onChange={(rightEntities) => this.setState(rightEntities)}
              height={barHeight}
              category={rightCategory}
              dataSource={entityMap[rightCategory]}
              disabled={!rightCategory}
              onChipEditing={(onChipEditing) => this.setState({onChipEditing})}
              />
            : null}
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
              {relations.map(x =>
                <MenuItem
                  primaryText={x}
                  key={x}
                  onClick={() => this.setState({selectedRelation: x, openRelationshipMenu: false}, this.updateActiveStep)}
                />)}
            </Menu>
          </Popover>
          <RaisedButton
            label={StringUtils.trimLength(selectedRelation) || 'Relationship'}
            labelPosition="before"
            disabled={relations && relations.length <= 0}
            icon={<NavigationExpandMoreIcon style={{width:16, height: 16}}/>}
            onClick={this.handleRelationshipMenuTapped}
            style={{marginLeft: 16, marginRight: 16}}
          />
          <FloatingActionButton
            mini={true}
            disabled={!leftCategory || !rightCategory || !selectedRelation}
          >
            <ActionSearchIcon />
          </FloatingActionButton>
        </ToolbarGroup>
          </Toolbar>
        );
      }
    }
