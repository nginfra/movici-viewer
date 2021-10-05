'use strict';

var MovActionMenu = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"dropdown dropdown-menu-animation is-mobile-modal",attrs:{"tabindex":"0"},on:{"blur":function($event){_vm.visible = false;}}},[_c('div',{ref:"anchorRef",staticClass:"dropdown-trigger",attrs:{"role":"button","aria-haspopup":"true"},on:{"click":_vm.toggle}},[_c('span',{staticClass:"ellipsis"},[_c('b-icon',{attrs:{"size":"is-small","pack":"far","icon":"ellipsis-v"}})],1)]),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.visible),expression:"visible"}],ref:"popupRef",staticClass:"dropdown-menu",style:(_vm.style)},[_c('div',{staticClass:"dropdown-content"},_vm._l((_vm.value),function(item,index){return _c('a',{key:index,staticClass:"dropdown-item",class:item.colorScheme,attrs:{"focusable":false,"disabled":item.isDisabled ? item.isDisabled() : null},on:{"click":function($event){return _vm.emitAndClose(item.event, $event)}}},[_c('b-icon',{staticClass:"mr-2",attrs:{"icon":item.icon,"pack":item.iconPack || 'far'}}),_vm._v(" "),_c('span',[_vm._v("\n          "+_vm._s(item.label)+"\n        ")])],1)}),0)])])},
staticRenderFns: [],
stub: 1
};

exports.MovActionMenu = MovActionMenu;
