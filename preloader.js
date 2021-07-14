const fs = require('fs'),
  path = require('path'),
  { getPosition, removeLastChars, resetDirectory } = require('./utils'),
  DATA_DIR = path.join(__dirname, 'data');

module.exports = {
  initDatasets: () => {
    const datasetsDir = path.join(DATA_DIR, 'datasets');
    resetDirectory(datasetsDir);

    const scenarios = fs.readdirSync(path.join(DATA_DIR, 'scenarios'));    
    scenarios.forEach(scenario_uuid => {
      const statesDir = path.join(DATA_DIR, 'scenarios', scenario_uuid, 'state'),
        statesFiles = fs.readdirSync(path.join(DATA_DIR, 'scenarios', scenario_uuid, 'state'));

      statesFiles
        .filter(fileName => fileName.includes('.json'))
        .forEach(fileName => {
          try {
            const filePath = path.join(statesDir, fileName),
              content = JSON.parse(fs.readFileSync(filePath, 'utf8')),
              datasetFolder = path.join(datasetsDir, content.uuid);
            
            resetDirectory(datasetFolder);

            fs.writeFileSync(path.join(datasetFolder, 'data.json'), JSON.stringify(content), { enconding: 'utf-8' });
          } catch (err) {
            console.error(err);
          }
        });
    });
  },
  initUpdates: () => {
    resetDirectory(path.join(DATA_DIR, 'updates'));

    const summary = [], scenarios = fs.readdirSync(path.join(DATA_DIR, 'scenarios'));    

    scenarios.forEach(scenario_uuid => {
      const updates = fs.readdirSync(path.join(DATA_DIR, 'scenarios', scenario_uuid, 'updates'));

      updates
        .filter(fileName => fileName.includes('.json'))
        .forEach(fileName => {
          const [timestamp, iteration] = fileName.split('_'), // splits by underscore
            name = removeLastChars(fileName.substring(getPosition(fileName, '_', 2) + 1), 5), // gets the substring after the 2nd underscore in the filename, also remove last 5 chars to remove '.json'
            content = {
              name,
              uuid: scenario_uuid,
              update_uuid: scenario_uuid,
              dataset_uuid: scenario_uuid,
              timestamp: Number(timestamp.substring(1)),
              iteration: Number(iteration)
            };
          
          const updateFilePath = path.join(DATA_DIR, 'updates', fileName);
          fs.writeFileSync(updateFilePath, content, { enconding: 'utf-8' });
          summary.push(content);
        });
      
      const summaryContent = JSON.stringify({ updates: summary });
      fs.writeFileSync(path.join(DATA_DIR, 'scenarios', scenario_uuid, 'updates/index.json'), summaryContent, { enconding: 'utf-8' });
    });
  }
}


