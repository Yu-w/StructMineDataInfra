function StringUtils() {}

let getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

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

StringUtils.trimStringWithHighlight = (string, highlight) => {
  if (!highlight) return string;
  const startingPoint = string.indexOf(highlight) - getRandomInt(12, 50);
  return startingPoint <= 0 ? string : '...' + string.substring(startingPoint);
}


export {
  StringUtils
}
