const path = require('path'),
  express = require('express'),
  cors = require('cors'),
  app = express(),
  port = 5000,
  expressStaticOpts = {
    index: ['index.json'], // serves index.json files when GET to folder, i.e.: GET scenarios/ will get `scenarios\index.json`
    extensions: ['json'] // ignore the json extension when serving files, i.e.: GET scenarios/test_integration_scenario will get `scenarios\test_integration_scenario.json`
  },
  log = console.log;

log('Movici Flow local server is starting...\n');
log(' - Running preloader...');
const { initDatasets, initUpdates} = require('./preloader');
initDatasets();
initUpdates();

// TODO
// allow CORS 
app.use(cors({origin: '*'}));

log(' - Configuring local folder structure...');
app.use(express.static(path.join(__dirname, 'data'), expressStaticOpts));

log(' - Configuring custom routes...');
require('./routes').configRoutes(app);

app.listen(port);
log(`\nMovici Flow local server is listening on http://localhost:${port}.`);
