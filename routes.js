const fs = require('fs'),
  path = require('path'),
  doRouting = (app, entries) => {
    entries.forEach(([url, cb]) => {
      app.get(url, cb);
    })
  };
  

module.exports = {
  configRoutes: (app) => {
    // Create a endpoint that will list the updates   
    // iteration, dataset_uuid (same as fileName), name, and timestamp
    const routes = {
      '/scenarios/:scenario_uuid/updates': (req, res) => {  
        const { scenario_uuid } = req.params,
          dir = path.join(__dirname, `/data/scenarios/${scenario_uuid}/updates`)
          fileNames = fs.readdirSync(dir),
          updates = fileNames
            .filter(fileName => fileName.includes('.json'))
            .map(fileName => {
              const [timestamp, iteration] = fileName.split('_'), // splits by underscore
                name = removeLastChars(fileName.substring(getPosition(fileName, '_', 2) + 1), 5) // gets the substring after the 2nd underscore in the filename, also remove last 5 chars to remove '.json'
  
              return {
                name,
                uuid: scenario_uuid,
                update_uuid: scenario_uuid,
                dataset_uuid: scenario_uuid,
                timestamp: Number(timestamp.substring(1)),
                iteration: Number(iteration)
              }
            });
  
        res.send({ updates });
      },
      '/scenarios/:scenario_uuid/state': (req, res) => {
        const { scenario_uuid } = req.params,
          { entity_group, dataset_uuid } = req.query,
          dir = path.join(__dirname, `/data/scenarios/${scenario_uuid}/state`)
          fileNames = fs.readdirSync(dir);
        
        let full_content = {};

        fileNames
          .filter(fileName => fileName.includes('.json'))
          .forEach((fileName) => {
            try {
              const filePath = path.join(dir, fileName),
                content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
              
              if (content.uuid === dataset_uuid) {
                full_content = content
                return;
              }
            } catch (err) {
              console.error(err);
            }
          });

        res.send(full_content);
      }
    };

    doRouting(app, Object.entries(routes));
  }
}