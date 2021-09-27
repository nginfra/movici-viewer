import * as components from './components';
import SnackBarProgramatic from './utils/snackbar';

import { use, registerComponent, registerComponentProgrammatic } from './plugins';

const Flow = {
  install(Vue, options = {}) {
    // Options
    // setOptions(merge(config, options, true))
    // Components
    Object.values(components).forEach(component => {
      registerComponent(component.name, component);
    });

    registerComponentProgrammatic(Vue, 'snackbar', SnackBarProgramatic);
  }
};

use(Flow);

export default Flow;

// export all components as vue plugin
export * from './components';
// export programmatic component
export * from './utils';
export * from './errors';
export * from './crs';
