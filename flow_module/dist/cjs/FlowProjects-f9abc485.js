'use strict';

var FlowProjects = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('FlowContainer',{staticClass:"flow-projects",scopedSlots:_vm._u([{key:"leftPanel",fn:function(){return [_c('ProjectInfoBox',{staticClass:"mb-2",attrs:{"edit":""},on:{"setProject":_vm.setProject}}),_vm._v(" "),(_vm.currentProject)?_c('div',{staticClass:"project-info"},[(_vm.details)?_c('div',{staticClass:"details is-size-7 mb-3"},_vm._l((_vm.details),function(prop,key){return _c('div',{key:key,staticClass:"mb-1"},[_c('label',[_vm._v(_vm._s(_vm.$t('flow.projects.details.' + key))+": ")]),_vm._v(" "),_c('span',{staticClass:"value"},[_vm._v(_vm._s(prop))])])}),0):_vm._e(),_vm._v(" "),(_vm.countDetails)?_c('div',{staticClass:"count-details is-size-7 mb-3"},[_c('div',{staticClass:"mb-1"},[_c('label',[_vm._v(_vm._s(_vm.$t('flow.projects.details.dataset_count'))+": ")]),_vm._v(" "),_c('router-link',{staticClass:"value",attrs:{"custom":"","to":_vm.toDatasets},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var navigate = ref.navigate;
return [_c('a',{attrs:{"role":"link"},on:{"click":navigate,"keypress":function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return navigate($event)}}},[_vm._v("\n              "+_vm._s(_vm.countDetails.dataset_count)+"\n            ")])]}}],null,false,912513050)})],1),_vm._v(" "),_c('div',{staticClass:"mb-1"},[_c('label',[_vm._v(_vm._s(_vm.$t('flow.projects.details.scenario_count'))+": ")]),_vm._v(" "),_c('router-link',{staticClass:"value",attrs:{"custom":"","to":_vm.toScenario},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var navigate = ref.navigate;
return [_c('a',{attrs:{"role":"link"},on:{"click":navigate,"keypress":function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return navigate($event)}}},[_vm._v("\n              "+_vm._s(_vm.countDetails.scenario_count)+"\n            ")])]}}],null,false,1536954086)})],1)]):_vm._e(),_vm._v(" "),(_vm.currentProject.description)?_c('div',{staticClass:"description is-size-6 mt-5"},[_vm._v("\n        "+_vm._s(_vm.currentProject.description)+"\n      ")]):_vm._e()]):_vm._e()]},proxy:true},{key:"mainView",fn:function(){return [(!_vm.currentProject)?[_c('div',{staticClass:"no-resource"},[_c('b-image',{attrs:{"src":"/static/no-project.png"}}),_vm._v(" "),_c('div',{staticClass:"has-text-centered mt-3"},[_c('h1',{staticClass:"is-size-4 has-text-weight-bold"},[_vm._v(_vm._s(_vm.$t('flow.mainView.noProjectTitle')))]),_vm._v(" "),_c('h2',{staticClass:"is-size-6"},[_vm._v(_vm._s(_vm.$t('flow.mainView.noProjectText')))])])],1)]:[_c('MapVis',{attrs:{"layer-infos":_vm.validLayers,"view-state":_vm.viewState},on:{"update:viewState":function($event){_vm.viewState=$event;},"update:view-state":function($event){_vm.viewState=$event;}},scopedSlots:_vm._u([{key:"control-left",fn:function(ref){
var map = ref.map;
var onViewstateChange = ref.onViewstateChange;
var basemap = ref.basemap;
var setBasemap = ref.setBasemap;
return [(_vm.hasGeocodeCapabilities)?_c('SearchBar',{attrs:{"map":map,"view-state":_vm.viewState},on:{"update:view-state":function($event){return onViewstateChange($event)}}}):_vm._e(),_vm._v(" "),_c('NavigationControl',{attrs:{"value":_vm.viewState},on:{"input":function($event){return onViewstateChange($event)}}}),_vm._v(" "),_c('BaseMapControl',{attrs:{"value":basemap},on:{"input":setBasemap}})]}}])})]]},proxy:true}])})},
staticRenderFns: [],
stub: 1
};

exports.FlowProjects = FlowProjects;
