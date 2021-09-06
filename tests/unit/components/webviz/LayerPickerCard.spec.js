import LayerPickerCard from '@/components/webviz/LayerPickerCard';
import { VisualizationMode } from '@/types';
import { VisualizerInfo } from '@/visualizers';
import { createComponentWrapper } from '../../helpers';

describe('LayerPickerCard.vue', () => {
  let wrapper;
  beforeEach(async () => {
    wrapper = createComponentWrapper(LayerPickerCard, {
      propsData: {
        value: new VisualizerInfo({
          name: 'some_dataset',
          entityGroup: 'some_entity',
          componentProperty: 'component/property',
          mode: VisualizationMode.SCENARIO,
          visible: true
        })
      }
    });
  });
  it('renders correctly in expanded mode', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly in reduced mode', async () => {
    await wrapper.setProps({ reduce: true });
    expect(wrapper).toMatchSnapshot();
  });
});
