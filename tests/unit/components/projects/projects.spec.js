import { mocked } from 'ts-jest/utils';
import Projects from '@/components/projects/Projects.vue';
import ProjectStore from '@/store/modules/ProjectStore';
import { createComponentWrapper } from '../../helpers';

// eslint-disable-next-line
const projectsData = require('../../../data/projects.json');

// mock store module, and stub actions that will be tested.
Object.assign(mocked(ProjectStore), {
  getAllProjects: async () => {
    return projectsData;
  }
});

describe('Projects Component', () => {
  let wrapper;
  const spy = {
    getAllProjects: jest.spyOn(Projects.options.methods, 'getAllProjects')
  };

  beforeEach(() => {
    // best way so far to spy on module methods if they are called on mounted
    wrapper = createComponentWrapper(Projects, {});
  });

  afterEach(() => {
    spy.getAllProjects.mockClear();
  });

  it('get projects on mounted', async () => {
    expect(spy.getAllProjects).toHaveBeenCalled();
    expect(wrapper.vm.projects).toEqual(expect.arrayContaining(projectsData));
  });

  it('clicks name of item on table > go to edit page of that item', async () => {
    await wrapper.find('.table > tbody > tr > td > a').trigger('click');

    expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'ProjectEdit',
      params: {
        uuid: '0001'
      }
    });
  });

  it('clicks edit button of item on table > go to edit page of that item', async () => {
    await wrapper.find('.table > tbody > tr > td .action-edit').trigger('click');
    expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'ProjectEdit',
      params: {
        uuid: '0001'
      }
    });
  });

  //  for now we can't stub router link perfectly
  // it('"add new" clicked > router called', async () => {
  //   await wrapper.find('.level-right a').trigger('click');
  //   expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);
  //   expect(wrapper.vm.$router.push).toHaveBeenCalledWith({ name: 'ProjectAdd' });
  // });
});
