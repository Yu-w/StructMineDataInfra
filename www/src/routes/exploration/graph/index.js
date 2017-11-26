import React from 'react';
import Graph from './Graph';
import Layout from '../../../components/Layout';

import { NetworkExplorationAPI } from './../../apiService';

async function action({ params }) {
  const title = 'Nework Visualization Graph';
  console.log(params);
  const data = await NetworkExplorationAPI.getGraphSearch('Chromosomes', 'Diseases', null, null, 'cytogenetic_abnormality_involves_chromosome')
  return {
    chunks: ['exploration/graph'],
    title: title,
    component: (
      <Layout title={title}>
        <Graph data={data}/>
      </Layout>
    ),
  };
}

export default action;
