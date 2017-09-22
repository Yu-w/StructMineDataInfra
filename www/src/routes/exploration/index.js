import React from 'react';
import Exploration from './Exploration';
import Layout from '../../components/Layout';

async function action() {
  return {
    chunks: ['exploration'],
    title: 'Network Exploration',
    component: (
      <Layout>
        <Exploration />
      </Layout>
    ),
  };
}

export default action;
