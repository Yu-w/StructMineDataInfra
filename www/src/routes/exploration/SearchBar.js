import React from 'react';
import NavigationMoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import ActionSearchIcon from 'material-ui/svg-icons/action/search';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Snackbar from 'material-ui/Snackbar';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import TreeView from './TreeView';
import { StringUtils } from './../utils';
import EntityChipInput from './EntityChipInput';

import { NetworkExplorationAPI } from './../apiService';
import history from './../../history';

import entityMap from './entityData.json';

export default class SearchBar extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      categoryLeft: props.categoryLeft,
      categoryRight: props.categoryRight,
      entitiesLeft: props.entitiesLeft || [],
      entitiesRight: props.entitiesRight || [],
      selectedRelation: props.relation,
      openRelationshipMenu: false,
      barHeight: 64,
      activeStep: 0,
      relations: [],
      snackbarOpen: false,
      showFullscreenLoader: false,
    };
  }

  componentDidMount() {
    this.updateActiveStep();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.categoryLeft !== this.state.categoryLeft
      || prevState.categoryRight !== this.state.categoryRight) {
      this.setState({relations: [], selectedRelation: null}, this.updateActiveStep)
    }
  }

  handleLeftTreeViewSelect = (label) => {
    this.setState({categoryLeft: label})
  }

  handleRightTreeViewSelect = (label) => {
    this.setState({categoryRight: label})
  }

  handleRelationshipMenuTapped = (event) => {
    event.preventDefault();
    this.setState({
      openRelationshipMenu: true,
      relationshipMenuAnchorEl: event.currentTarget,
    });
  }

  handleSearchButtonTapped = (event) => {
    event.preventDefault();
    const {
      categoryLeft,
      categoryRight,
      entitiesLeft,
      entitiesRight,
      selectedRelation,
    } = this.state;
    this.setState({showFullscreenLoader: true});
    history.push({
      pathname: '/exploration/graph',
      search: '?' + StringUtils.getQueryString({
        categoryLeft: categoryLeft,
        categoryRight: categoryRight,
        entitiesLeft: entitiesLeft,
        entitiesRight: entitiesRight,
        relation: selectedRelation,
      }),
    });
  }

  updateActiveStep = () => {
    let activeStep = 0;
    const {categoryLeft, categoryRight, selectedRelation} = this.state;
    if (categoryLeft && categoryRight && selectedRelation) {
      activeStep = 3;
    } else if (categoryLeft && categoryRight) {
      activeStep = 2;
      const {
        categoryLeft,
        categoryRight,
        entitiesLeft,
        entitiesRight,
      } = this.state;
      NetworkExplorationAPI.getRelationships(categoryLeft, categoryRight, entitiesLeft, entitiesRight)
      .then(data => {
        if (!data.relations || !data.relations.length) {
          this.setState({ snackbarOpen: true });
        } else {
          this.setState({ relations: data.relations || [] })
        }
      }).catch(error => this.setState({ snackbarOpen: true }));

    } else if (categoryLeft) {
      activeStep = 1;
    }
    this.setState({activeStep: activeStep});
    this.props.onActiveStepChange && this.props.onActiveStepChange(activeStep);
  }

  render() {
    const {
      categoryLeft,
      categoryRight,
      leftChips,
      rightChips,
      onChipEditing,
      onRightChipInput,
      relations,
      selectedRelation,
      showFullscreenLoader,
    } = this.state;

    const barHeight = !onChipEditing ? 64 : 108;
    return (
      <div>
        <Toolbar style={{...this.props.style, height: barHeight, borderRadius: 16}}>
          <ToolbarGroup style={{paddingLeft: 8}}>
            <TreeView
              label={StringUtils.trimLength(this.state.categoryLeft) || 'Left Entity Category'}
              onSelection={this.handleLeftTreeViewSelect}
            />
            {entityMap[categoryLeft]
              ? <EntityChipInput
                onChange={(entitiesLeft) => this.setState(entitiesLeft)}
                height={barHeight}
                category={categoryLeft}
                dataSource={entityMap[categoryLeft]}
                disabled={!categoryLeft}
                onChipEditing={(onChipEditing) => this.setState({onChipEditing})}
                />
              : null}
          </ToolbarGroup>
          <ToolbarGroup>
            <TreeView
              label={StringUtils.trimLength(this.state.categoryRight) || 'Right Entity Category'}
              onSelection={this.handleRightTreeViewSelect}
            />
            {entityMap[categoryRight]
              ? <EntityChipInput
                onChange={(entitiesRight) => this.setState(entitiesRight)}
                height={barHeight}
                category={categoryRight}
                dataSource={entityMap[categoryRight]}
                disabled={!categoryRight}
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
              disabled={(relations && !relations.length) && !selectedRelation}
              icon={<NavigationExpandMoreIcon style={{width:16, height: 16}}/>}
              onClick={this.handleRelationshipMenuTapped}
              style={{marginLeft: 16, marginRight: 16}}
            />
            <Snackbar
              open={this.state.snackbarOpen}
              message={`No relation found between '${StringUtils.trimLength(categoryLeft)}' and '${StringUtils.trimLength(categoryRight)}'`}
              autoHideDuration={3000}
              onRequestClose={() => this.setState({snackbarOpen: false})}
            />
            <FloatingActionButton
              mini={true}
              disabled={!categoryLeft || !categoryRight || !selectedRelation}
              onClick={this.handleSearchButtonTapped}
            >
              <ActionSearchIcon />
            </FloatingActionButton>
          </ToolbarGroup>
        </Toolbar>
        {showFullscreenLoader ? <CircularProgress size={80} thickness={5} style={styles.mainLoader}/> : null}
      </div>
    );
    }

  }

  const styles = {
    mainLoader: {
      flex: 0,
      position: 'absolute',
      paddingTop: '15%',
      width: '100%',
      height: '100%',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1000,
      backgroundColor: '#000000',
      opacity: 0.5,
      textAlign: 'center',
    }
  }
