export const MOCK_TIMEOUT = 1000;
export default require.context('.', true, /[A-Za-z0-9-_,\s]+\.json$/i);
