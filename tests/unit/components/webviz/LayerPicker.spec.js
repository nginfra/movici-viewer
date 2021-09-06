import LayerPicker from '@/components/webviz/LayerPicker';
import { VisualizerInfo } from '@/visualizers';
import { createComponentWrapper } from '../../helpers';

describe('LayerPicker.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = createComponentWrapper(LayerPicker, {
      propsData: {
        value: [
          new VisualizerInfo({
            name: 'my_dataset',
            entityGroup: 'electrical_node_entities',
            componentProperty: 'operational_status_properties/is_working_properly',
            visible: true
          })
        ]
      }
    });
  });
  it('renders correctly for geometryOnly layer', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('emits data on update', async () => {
    const sentinel = { key: 'sentinel' };
    await wrapper.findComponent({ name: 'LayerPickerCard' }).vm.$emit('input', sentinel);
    expect(wrapper.emitted().input[0]).toStrictEqual([[sentinel]]);
  });
});
