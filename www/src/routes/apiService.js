const baseAddress = 'http://192.17.58.208:8009';

import { StringUtils } from './Utils';

function NetworkExplorationAPI() {}

const urlWithParams = (url, params) => {
  // const resUrl = new URL(baseAddress + url)
  // Object.keys(params).forEach(key => resUrl.searchParams.append(key, params[key]))
  // return resUrl;
  return baseAddress + url + '?' + StringUtils.getQueryString(params);
}

const header = new Headers({
        'Access-Control-Allow-Origin':'*',
});

NetworkExplorationAPI.getRelationships = (categoryLeft, categoryRight, entitiesLeft, entitiesRight) => {
  const url = urlWithParams('/network_exploration/get_relations', {
    type_a: categoryLeft,
    type_b: categoryRight,
    entities_left: entitiesLeft,
    entities_right: entitiesRight,
  });
  console.log(url)
  return fetch(url).then(response => response.json())
}

NetworkExplorationAPI.getGraphSearch = (categoryLeft, categoryRight, entitiesLeft, entitiesRight, relation) => {
  const url = urlWithParams('/network_exploration', {
    type_a: categoryLeft,
    type_b: categoryRight,
    entities_left: entitiesLeft || [],
    entities_right: entitiesRight || [],
    relation_type: relation,
    num_edges: 20,
    num_pps: 5,
  });
  console.log(url);
  return fetch(url).then(response => response.json())
}

export {
  NetworkExplorationAPI
}
