'use strict';

var FlowMain = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{staticClass:"flow columns is-gapless is-margin-less"},[_c('b-menu',{staticClass:"column flow-menu",attrs:{"activable":false}},[_c('b-menu-list',{attrs:{"aria-role":"menu"}},[_c('b-menu-item',{staticClass:"home",scopedSlots:_vm._u([{key:"label",fn:function(){return [_c('b-image',{attrs:{"src":"/static/movici-logo.svg","title":_vm.$t('flow.leftMenu.returnToDashboard')}})]},proxy:true}])}),_vm._v(" "),_vm._l((_vm.sectionMenu),function(section){return _c('b-menu-item',{key:section.name,attrs:{"aria-role":"menuitem","label":_vm.$t(section.label),"icon-pack":section.iconPack,"icon":section.icon,"disabled":!section.enabled,"active":_vm.isActive(section.to),"size":"is-medium","tag":"a"},on:{"click":function($event){return _vm.click(section)}}})}),_vm._v(" "),(_vm.hasUserCapabilities)?_c('b-menu-item',{staticClass:"bottom",scopedSlots:_vm._u([{key:"label",fn:function(){return [_c('span',{staticClass:"is-small icon user-initials"},[_vm._v("\n            "+_vm._s(_vm.userInitials)+"\n          ")])]},proxy:true}],null,false,465899525)}):_vm._e()],2)],1),_vm._v(" "),_c('b-tooltip',{staticClass:"collapse-button",attrs:{"type":"is-black","position":"is-right","label":(_vm.collapse ? _vm.$t('flow.leftMenu.expand') : _vm.$t('flow.leftMenu.collapse')) + ' menu'}},[(!_vm.disableCollapser)?_c('b-button',{attrs:{"size":"is-small","icon-left":_vm.collapse ? 'angle-right' : 'angle-left'},on:{"click":function($event){return _vm.toggleCollapse()}}}):_vm._e()],1),_vm._v(" "),_c('main',{staticClass:"column"},[_c('router-view')],1)],1)},
staticRenderFns: [],
stub: 1
};

exports.FlowMain = FlowMain;
