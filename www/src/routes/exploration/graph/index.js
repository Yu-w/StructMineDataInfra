import React from 'react';
import Graph from './Graph';
import Layout from '../../../components/Layout';

import { NetworkExplorationAPI } from './../../apiService';

async function action({ path, params, query }) {
  const title = 'Nework Visualization Graph';
  const data = await NetworkExplorationAPI.getGraphSearch(
    query.categoryLeft,
    query.categoryRight,
    query.entitiesLeft,
    query.entitiesRight,
    query.relation
  );
  
  return {
    chunks: ['exploration/graph'],
    title: title,
    component: (
      <Layout title={title}>
        <Graph data={data} query={query}/>
      </Layout>
    ),
  };
}

export default action;
