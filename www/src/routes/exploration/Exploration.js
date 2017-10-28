import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {TreeList} from 'react-treeview-mui'
import FlatButton from 'material-ui/FlatButton';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Exploration.css';
import SearchBar from './SearchBar';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

class Exploration extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
    };
  }

  render() {
    console.log(this.state.activeStep)
    return (
      <MuiThemeProvider>
        <div
          className={s.root}
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        >
          <div className={s.container}>
            <span className={s.title} >Life-iNet</span>
            <SearchBar
              style={{marginTop: 8}}
              onActiveStepChange={(activeStep) => this.setState({activeStep: activeStep})}
            />
            <Stepper activeStep={this.state.activeStep}>
              <Step>
                <StepLabel>Select Left Entity Category </StepLabel>
              </Step>
              <Step>
                <StepLabel>Select Right Entity Category</StepLabel>
              </Step>
              <Step>
                <StepLabel>Choose Relationship between Entities</StepLabel>
              </Step>
            </Stepper>
            {/* <div>
              <div style={{marginTop: 12}}>
                <FlatButton
              label="Sample Entities"
              disabled={this.state.activeStep !== 0}
                />
              </div>
            </div> */}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

}

export default withStyles(s)(Exploration);
