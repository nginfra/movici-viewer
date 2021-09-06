import VizSidebar from '@/components/webviz/VizSidebar';
import { createComponentWrapper } from '../../helpers';

describe('VizSidebar.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = createComponentWrapper(VizSidebar, {}, { shallowMount: true });
  });
  it('renders correctly when expanded', () => {
    wrapper.setData({ reduced: false });
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly when reduced', async () => {
    await wrapper.setData({ reduced: true });
    expect(wrapper).toMatchSnapshot();
  });
  it('reduces on click', () => {
    wrapper.setData({ reduced: false });
    wrapper.findComponent({ name: 'BButton' }).vm.$emit('click');
    expect(wrapper.vm.reduced).toBe(true);
  });
  it('expands when reduced', () => {
    wrapper.setData({ reduced: true });
    wrapper.findComponent({ name: 'BButton' }).vm.$emit('click');
    expect(wrapper.vm.reduced).toBe(false);
  });
});
