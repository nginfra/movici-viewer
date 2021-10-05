'use strict';

var FlowExport = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"has-background-white p-4"},[_c('div',{staticClass:"is-flex is-flex is-align-items-center mb-3"},[_c('h1',{staticClass:"is-size-6 has-text-black text-ellipsis"},[_vm._v("\n      "+_vm._s(_vm.$t('flow.export.modalTitle'))+" "+_vm._s(_vm.currentScenario.display_name)+"\n    ")])]),_vm._v(" "),_c('div',{staticClass:"columns mt-2"},[_c('div',{staticClass:"column is-one-third"},[_c('label',{staticClass:"label is-size-7"},[_vm._v(_vm._s(_vm.$t('flow.export.filterData')))]),_vm._v(" "),_c('ExportLayerPicker',{attrs:{"layers":_vm.visualizers},on:{"selectLayer":function($event){_vm.selectedCVI = $event;}}})],1),_vm._v(" "),_c('div',{staticClass:"column"},[(_vm.currentScenario)?_c('div',[_c('ExportForm',{attrs:{"value":_vm.selectedCVI,"validator":_vm.validator,"scenario-uuid":_vm.currentScenario.uuid,"timestamp":_vm.timestamp,"timeline-info":_vm.timelineInfo},on:{"exportConfig":function($event){_vm.exportConfig = $event;}}})],1):_vm._e()])]),_vm._v(" "),_c('div',{staticClass:"bottom is-pulled-right"},[_c('b-button',{staticClass:"mr-2 has-text-weight-bold",attrs:{"size":"is-small","icon-pack":"far"},on:{"click":function($event){return _vm.$emit('close')}}},[_vm._v("\n      "+_vm._s(_vm.$t('actions.cancel'))+"\n    ")]),_vm._v(" "),_c('b-button',{staticClass:"is-primary has-text-weight-bold",attrs:{"size":"is-small","icon-pack":"far"},on:{"click":_vm.exportData}},[_vm._v("\n      "+_vm._s(_vm.$t('flow.export.label'))+"\n    ")])],1),_vm._v(" "),_c('div',{staticClass:"is-clearfix"})])},
staticRenderFns: [],
stub: 1
};

exports.FlowExport = FlowExport;
