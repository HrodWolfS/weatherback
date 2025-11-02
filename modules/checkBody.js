const checkBody = (body, keys) => {
  let isValid = true;
  for (let key of keys) {
    if (!body[key]) {
      isValid = false;
      break;
    }
  }
  return isValid;
};

module.exports = { checkBody };
