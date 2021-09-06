import { mocked } from 'ts-jest/utils';
import Scenarios from '@/components/scenarios/Scenarios.vue';
import ScenarioStore from '@/store/modules/ScenarioStore';
import ProjectStore from '@/store/modules/ProjectStore';
import { createComponentWrapper } from '../../helpers';

// eslint-disable-next-line
const scenariosData = require('../../../data/scenarios.json'),
  // eslint-disable-next-line
  activeProjectData = require('../../../data/activeProject.json');

// mock store module, and stub actions that will be tested.
const mockedProjectStore = mocked(ProjectStore);
const mockedScenarioStore = mocked(ScenarioStore);

mockedScenarioStore.getScenariosWithSimulationInfo = async () => {
  mockedScenarioStore.SET_SCENARIOS(scenariosData.scenarios);
  return scenariosData.scenarios;
};

describe('Scenarios Component', () => {
  let wrapper;
  const spy = {
    getScenarios: jest.spyOn(Scenarios.options.methods, 'getScenarios')
  };

  beforeEach(() => {
    // best way so far to spy on module methods if they are called on mounted
    wrapper = createComponentWrapper(Scenarios, {});
    mockedProjectStore.SET_ACTIVE_PROJECT(activeProjectData);
  });

  afterEach(() => {
    spy.getScenarios.mockClear();
  });

  it('get datasets on uuid change', async () => {
    expect(spy.getScenarios).toHaveBeenCalled();
    expect(wrapper.vm.scenarios).toEqual(expect.arrayContaining(scenariosData.scenarios));
  });

  it.each(['.table > tbody > tr > td a', '.table > tbody > tr > td .action-edit'])(
    'clicks  %s, then go to edit page of that item',
    async path => {
      await wrapper.find(path).trigger('click');
      expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
        name: 'ScenarioEdit',
        params: {
          uuid: '0001'
        }
      });
    }
  );
});
