const baseAddress = 'http://192.17.58.208:8010';

function getQueryString(params) {
  var esc = encodeURIComponent;
  return Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
}

function request(params) {
  var method = params.method || 'GET';
  var qs = '';
  var body;
  var headers = params.headers || {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (['GET', 'DELETE'].indexOf(method) > -1)
  qs = '?' + getQueryString(params.data);
  else // POST or PUT
  body = JSON.stringify(params.data);

  var url = params.url + qs;

  return fetch(url, { method, headers, body });
}

const get = params => request(Object.assign({ method: 'GET' }, params))
const post = params => request(Object.assign({ method: 'POST' }, params))
const put = params => request(Object.assign({ method: 'PUT' }, params))

function NetworkExplorationAPI() {}

const urlWithParams = (url, params) => {
  const resUrl = new URL(baseAddress + url)
  Object.keys(params).forEach(key => resUrl.searchParams.append(key, params[key]))
  return resUrl;
}

NetworkExplorationAPI.getRelationships = (categoryLeft, categoryRight, entitiesLeft, entitiesRight) => {
  fetch(
    urlWithParams('/network_exploration/get_relations', {
      type_a: categoryLeft,
      type_b: categoryRight,
      entities_left: entitiesLeft || [],
      entities_right: entitiesRight || [],
    })
  ).then(x => console.log(x));
}

export {
  NetworkExplorationAPI
}
