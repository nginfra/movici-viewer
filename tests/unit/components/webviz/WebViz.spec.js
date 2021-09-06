import WebViz from '@/components/webviz/WebViz';
import { createComponentWrapper, createStore } from '../../helpers';

describe('WebViz.vue', () => {
  let wrapper, store;

  beforeEach(() => {
    // best way so far to spy on module methods if they are called on mounted
    store = createStore({
      getters: {
        activeProject() {
          return {
            uuid: '<uuid>',
            name: 'some_project',
            display_name: 'Some Project'
          };
        }
      }
    });
    wrapper = createComponentWrapper(WebViz, { store }, { shallowMount: true });
  });
  it('renders correctly', async () => {
    expect(wrapper.element).toMatchSnapshot();
  });
});
