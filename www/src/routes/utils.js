function StringUtils() {}

const stringLengthLimit = 32;

StringUtils.trimLength = (string) => {
  if (!string) return null;
  if (string.length > stringLengthLimit) {
    return string.substring(0, stringLengthLimit - 2) + '...';
  } else {
    return string
  }
}

StringUtils.getQueryString = (params) => {
  var esc = encodeURIComponent;
  return Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
}


export {
  StringUtils
}
