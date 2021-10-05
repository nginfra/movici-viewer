var MapVis = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('Deck',{attrs:{"value":_vm.viewState,"layers":_vm.layers,"basemap":_vm.basemap},on:{"input":function($event){return _vm.updateViewState($event)}},scopedSlots:_vm._u([(_vm.buildings)?{key:"map",fn:function(ref){
var map = ref.map;
return [_c('Buildings',{attrs:{"map":map}})]}}:null,{key:"control-zero",fn:function(ref){
var map = ref.map;
var onViewstateChange = ref.onViewstateChange;
return [_vm._t("control-zero",null,null,Object.assign({}, _vm.slotProps, {map: map, onViewstateChange: onViewstateChange}))]}},{key:"control-left",fn:function(ref){
var map = ref.map;
var onViewstateChange = ref.onViewstateChange;
return [_vm._t("control-left",null,null,Object.assign({}, _vm.slotProps, {map: map, onViewstateChange: onViewstateChange}))]}},{key:"control-right",fn:function(ref){
var map = ref.map;
var onViewstateChange = ref.onViewstateChange;
return [_vm._t("control-right",null,null,Object.assign({}, _vm.slotProps, {map: map, onViewstateChange: onViewstateChange}))]}},{key:"control-bottom",fn:function(ref){
var map = ref.map;
var onViewstateChange = ref.onViewstateChange;
return [_vm._t("control-bottom",null,null,Object.assign({}, _vm.slotProps, {map: map, onViewstateChange: onViewstateChange}))]}}],null,true)})],1)},
staticRenderFns: [],
stub: 1
};

export { MapVis as M };
