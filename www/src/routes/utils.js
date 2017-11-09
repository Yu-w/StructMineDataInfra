function StringUtils() {}

const stringLengthLimit = 22;

StringUtils.trimLength = (string) => {
  if (string.length > stringLengthLimit) {
    return string.substring(0, stringLengthLimit - 2) + '...';
  } else {
    return string
  }
}


export {
  StringUtils
}
