export default {
  local: require.context('.', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  flow: require.context('@movici-flow-common/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
};
