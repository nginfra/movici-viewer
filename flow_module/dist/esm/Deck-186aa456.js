var Deck = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{attrs:{"id":"mapbox-container"}},[_c('div',{attrs:{"id":"map"}}),_vm._v(" "),_c('canvas',{attrs:{"id":"deckgl-overlay"}}),_vm._v(" "),(_vm.loaded)?_c('div',{staticClass:"map-control-zero"},[_vm._t("control-zero",null,{"map":_vm.map,"onViewstateChange":_vm.updateViewState})],2):_vm._e(),_vm._v(" "),(_vm.loaded)?_c('div',{staticClass:"map-control-left"},[_vm._t("control-left",null,{"map":_vm.map,"onViewstateChange":_vm.updateViewState})],2):_vm._e(),_vm._v(" "),(_vm.loaded)?_c('div',{staticClass:"map-control-right"},[_vm._t("control-right",null,{"map":_vm.map,"onViewstateChange":_vm.updateViewState})],2):_vm._e(),_vm._v(" "),(_vm.loaded)?_c('div',{staticClass:"map-control-bottom"},[_vm._t("control-bottom",null,{"map":_vm.map,"onViewstateChange":_vm.updateViewState})],2):_vm._e(),_vm._v(" "),(_vm.loaded)?[_vm._t("map",null,{"map":_vm.map,"deck":_vm.deck,"viewState":_vm.value})]:_vm._e()],2)])},
staticRenderFns: [],
stub: 1
};

export { Deck as D };
