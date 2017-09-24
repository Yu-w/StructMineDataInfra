import React from 'react';
import Summarization from './Summarization';
import Layout from '../../components/Layout';

async function action() {
  const title = 'Distinctive Summarization';
  return {
    chunks: ['summarization'],
    title: title,
    component: (
      <Layout title={title}>
        <Summarization />
      </Layout>
    ),
  };
}

export default action;
