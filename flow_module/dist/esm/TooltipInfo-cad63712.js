var MovTooltipInfo = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('span',{staticClass:"b-tooltip is-white is-bottom is-medium",class:_vm.color},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.visible),expression:"visible"}],ref:"popupRef",staticClass:"tooltip-content",style:(_vm.style)},[_vm._t("tooltip-content",[_c('span',{staticClass:"is-size-7"},[_vm._v("\n          "+_vm._s(_vm.text)+"\n        ")])])],2),_vm._v(" "),_c('div',{ref:"anchorRef",staticClass:"tooltip-trigger",on:{"mouseover":function($event){return _vm.toggle(true)},"mouseleave":function($event){return _vm.toggle(false)}}},[(!this.$slots.default)?_c('b-icon',{attrs:{"icon":_vm.icon}}):_vm._e(),_vm._v(" "),_vm._t("default")],2)])])},
staticRenderFns: [],
stub: 1
};

export { MovTooltipInfo as M };
