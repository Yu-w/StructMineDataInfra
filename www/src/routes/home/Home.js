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
import Link from '../../components/Link';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';

class Home extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Link to="/exploration">
            <button className={[s.goItemLeft, s.goItemCommon].join(' ')}>
              Network <br></br>
              Exploration
            </button>
          </Link>
          <Link to="/summarization">
            <button className={[s.goItemRight, s.goItemCommon].join(' ')}>
              Distinctive <br></br>
              Summarization
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
