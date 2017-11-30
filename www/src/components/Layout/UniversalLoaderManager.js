import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

function UniversalLoaderManager() {
   this.isLoading = false;
}

UniversalLoaderManager.loaderComponent = function() {
  return this.isLoading
    ? <CircularProgress size={80} thickness={5} style={styles.mainLoader}/>
    : null;
}

UniversalLoaderManager.connectComponent = function(component) {
  this.component = component;
}

UniversalLoaderManager.startLoading = function() {
  this.isLoading = true;
  this.component && this.component.forceUpdate();
}

UniversalLoaderManager.stopLoading = function() {
  this.isLoading = false;
  this.component && this.component.forceUpdate();
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

export default UniversalLoaderManager;
