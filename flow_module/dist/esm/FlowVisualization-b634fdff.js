var FlowVisualization = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('FlowContainer',{staticClass:"flow-visualization",scopedSlots:_vm._u([{key:"leftPanel",fn:function(){return [_c('ProjectInfoBox',{staticClass:"mb-2"}),_vm._v(" "),_c('ScenarioInfoBox',{staticClass:"mb-2"}),_vm._v(" "),_c('ViewInfoBox',{staticClass:"mb-3",attrs:{"name":_vm.viewName},on:{"update:name":function($event){_vm.viewName=$event;},"load-view":_vm.loadView,"delete-view":_vm.confirmDeleteView,"save-view":_vm.confirmSaveView,"save-view-as-new":_vm.saveViewAsNew,"reset-view":_vm.confirmResetViewWithName}}),_vm._v(" "),_c('b-tabs',{ref:"tabs",staticClass:"flow-tabs uppercase field is-flex-grow-0 is-flex-shrink-2",style:(_vm.tabHeight)},[_c('b-tab-item',{attrs:{"label":_vm.$t('flow.visualization.tabs.visualizers')}},[_c('FlowLayerPicker',{attrs:{"scenario":_vm.currentScenario,"timestamp":_vm.timestamp},model:{value:(_vm.visualizers),callback:function ($$v) {_vm.visualizers=$$v;},expression:"visualizers"}})],1),_vm._v(" "),_c('b-tab-item',{attrs:{"disabled":"","label":_vm.$t('flow.visualization.tabs.kpi')}})],1)]},proxy:true},{key:"mainView",fn:function(){return [_c('MapVis',{attrs:{"layer-infos":_vm.visualizers,"view-state":_vm.viewState,"timestamp":_vm.timestamp,"buildings":""},on:{"update:viewState":function($event){_vm.viewState=$event;},"update:view-state":function($event){_vm.viewState=$event;},"update:timestamp":function($event){_vm.timestamp=$event;}},scopedSlots:_vm._u([{key:"control-zero",fn:function(ref){
var map = ref.map;
var dynamicPopup = ref.dynamicPopup;
var popupContent = ref.popupContent;
var closePopup = ref.closePopup;
return [(popupContent && dynamicPopup)?_c('DynamicDataView',{attrs:{"value":popupContent,"map":map,"view-state":_vm.viewState,"borderPadding":_vm.popupBorderPadding}},[_c('DataViewContent',{attrs:{"value":popupContent,"timestamp":_vm.timestamp},on:{"close":closePopup}})],1):_vm._e()]}},{key:"control-left",fn:function(ref){
var map = ref.map;
var onViewstateChange = ref.onViewstateChange;
var basemap = ref.basemap;
var setBasemap = ref.setBasemap;
return [(_vm.hasGeocodeCapabilities)?_c('SearchBar',{attrs:{"map":map,"view-state":_vm.viewState},on:{"update:view-state":function($event){return onViewstateChange($event)}}}):_vm._e(),_vm._v(" "),_c('NavigationControl',{attrs:{"value":_vm.viewState},on:{"input":function($event){return onViewstateChange($event)}}}),_vm._v(" "),_c('BaseMapControl',{attrs:{"value":basemap},on:{"input":setBasemap}})]}},{key:"control-right",fn:function(ref){
var popupContent = ref.popupContent;
var dynamicPopup = ref.dynamicPopup;
var closePopup = ref.closePopup;
return [(_vm.visualizers.length)?_c('FlowLegend',{attrs:{"value":_vm.visualizers}}):_vm._e(),_vm._v(" "),(popupContent && !dynamicPopup)?_c('StaticDataView',[_c('DataViewContent',{attrs:{"value":popupContent,"timestamp":_vm.timestamp},on:{"close":closePopup}})],1):_vm._e()]}},{key:"control-bottom",fn:function(ref){
var updateTimestamp = ref.updateTimestamp;
return [_c('TimeSlider',{attrs:{"value":_vm.timestamp,"timeline-info":_vm.timelineInfo},on:{"input":function($event){return updateTimestamp($event)}}})]}}])})]},proxy:true}])})},
staticRenderFns: [],
stub: 1
};

export { FlowVisualization as F };
