var MovLanguagePicker = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('b-field',{attrs:{"label":_vm.label}},[_c('b-select',{model:{value:(_vm.language),callback:function ($$v) {_vm.language=$$v;},expression:"language"}},_vm._l((_vm.languages),function(lang,i){return _c('option',{key:("Lang" + i),domProps:{"value":lang}},[_vm._v(_vm._s(lang))])}),0)],1)},
staticRenderFns: [],
stub: 1
};

export { MovLanguagePicker as M };
