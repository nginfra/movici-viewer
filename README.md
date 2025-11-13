# Movici Viewer
The Movici Viewer is a tool to visualize simulations which are performed using Movici and stored
on a local disk

## Install using pip 
```bash
pip install movici-viewer
```

## Usage
The Movici Viewer can be started using the following command and pointing it to a
valid simulations directory. The required content of the directory is explained below

```bash
movici-viewer /path/to/your/simulations
```

### Simulations Directory
A Simulations directory should contain the following:
  * An `init_data` directory with all initial datasets. Datasets files must follow the pattern:
   `<dataset_name>.<ext>`. Only `.json` files are fully supported.
  * A `scenarios` directory that contains, per Scenario:
    * `<scenario_name>.json`: Scenario config.
    * (Optional) `<scenario_name>/` a directory with all updates for this Scenario (if available). The updates
      in this directory must follow the naming pattern
      `t<timestamp>_<iteration>_<dataset_name>.json` which is the default naming pattern of 
      `movici-simulation-core` simulations. If this directory does not exist, the Scenario is
      consired to be not-run.
  * (Optional) A `/views/` directory with `/views/<scenario_name>/` subdirectories per scenario,
    containing View-files names `<view_name>.json`. These directories will be created by default
    upon saving Views in the Movici Viewer.

An example directory tree is as following:
```
├── init_data
│   └── my_dataset.json
├── scenarios
│   ├── my_scenario
│   │   ├── t0_0_my_dataset.json
│   │   └── t0_1_my_dataset.json
│   ├── my_scenario.json
│   └── other_scenario.json
└── views
    └── my_scenario
        └── my_view.json
```


## Development
Development requires `poetry`, a tool for managing and building python packages. Install it using
`pip` or `pipx`. 

Movici Viewer requires Python 3.10 to be installed. Please make sure it is available on your PATH.
Support for newer Python versions will be added in future versions of Movici Viewer

Upon first checkout of this repository, run `make init`. This will
 - install node modules for the client
 - build/bundle the client 
 - populate the server with the client bundle
 - install the server package

### Server development
The development requirements should already be installed after running `make init`. A development
server can be started using
```bash
make run-devel
```
This will run the development server with the tests/data as its simulations directory. To specify
a custom directory run
```bash
make run-devel data_dir=/path/to/my/simulations
```

### Client development
for client development, run the local api server and a Vue development server seperately, eg.:

```bash
make run-devel
```

Then, change the `"baseURL"` in `client/public/static/settings/settings.json` to the address of
the local development server, eg: `"http://localhost:5000`. Be sure **NOT** to commit this change.

Then, in a separate terminal run.

```
npm run --prefix client serve
```

In order to succesfully connect to the local api server, you may need to use and activate a CORS
browser plugin.
