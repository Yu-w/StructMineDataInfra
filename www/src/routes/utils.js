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


export {
  StringUtils
}
