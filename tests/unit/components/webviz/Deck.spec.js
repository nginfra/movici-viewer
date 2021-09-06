jest.mock('@deck.gl/core');
import Deck from '@/components/webviz/Deck';
import { Deck as DeckGL } from '@deck.gl/core';
import { createComponentWrapper } from '../../helpers';

describe('Deck.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = createComponentWrapper(Deck, {}, { shallowMount: true });
  });
  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });
  it('creates a Deck.gl instance', () => {
    expect(wrapper.vm.deck).toBeInstanceOf(DeckGL);
  });
});
