var MovActionBar = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._t("before"),_vm._v(" "),_vm._l((_vm.actionList),function(action,idx){return _c('MovAction',{key:idx,class:_vm.additionalClasses,attrs:{"action":action,"size":_vm.size,"disabled":_vm.isDisabled(action)},on:{"click":function($event){return _vm.$emit(action)}}})}),_vm._v(" "),_vm._t("after")],2)},
staticRenderFns: [],
stub: 1
};

export { MovActionBar as M };
