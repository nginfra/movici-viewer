import { Action, Module, VuexModule } from 'vuex-module-decorators';

@Module({
  name: 'something',
  namespaced: true
})
class SomethingStore extends VuexModule {
  something_ = 'Something';

  @Action
  changeSomething() {
    this.something_ = 'Something else';
  }

  get something() {
    return this.something_;
  }
}

export default SomethingStore;
