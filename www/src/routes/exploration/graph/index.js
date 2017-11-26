import React from 'react';
import Graph from './Graph';
import Layout from '../../../components/Layout';

async function action() {
  const title = 'Nework Visualization Graph';
  return {
    chunks: ['exploration/graph'],
    title: title,
    component: (
      <Layout title={title}>
        <Graph />
      </Layout>
    ),
  };
}

export default action;
