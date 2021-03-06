/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import UniversalLoaderManager from './UniversalLoaderManager';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import s from './Layout.css';
import Header from '../Header';
import Feedback from '../Feedback';
import Footer from '../Footer';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
  };

  componentDidMount() {
    UniversalLoaderManager.connectComponent(this);
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          {/* <Header title={this.props.title}/> */}
          {this.props.children}
          {/* <Footer /> */}
          {UniversalLoaderManager.loaderComponent()}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(normalizeCss, s)(Layout);
