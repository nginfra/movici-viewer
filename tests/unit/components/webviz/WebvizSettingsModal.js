import WebvizSettingsModal from '@/components/webviz/WebvizSettingsModal';
import { createComponentWrapper } from '../../helpers';

describe('ProjectPickerModal.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = createComponentWrapper(WebvizSettingsModal, {
      propsData: {
        value: { name: 'some-project', display_name: 'Some Project' },
        projects: [
          { name: 'some-project', display_name: 'Some Project' },
          { name: 'other-project', display_name: 'Other Project' }
        ]
      }
    });
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('enumerates projects', () => {
    const options = wrapper.findAll('option');
    expect(options.length).toBe(2);
  });

  it('updates fields on save-and-close', async () => {
    await wrapper.setData({ local: 'other-project' });
    wrapper.find('#save-btn').trigger('click');
    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toStrictEqual(['other-project']);
  });
});
