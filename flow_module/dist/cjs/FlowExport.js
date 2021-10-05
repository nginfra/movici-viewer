'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var FlowExport = require('./FlowExport-b6cf283d.js');
var plugins = require('./plugins-e1453ab8.js');

var Plugin = {
  install: function install(Vue) {
    plugins.registerComponent(Vue, FlowExport.FlowExport);
  }
};

exports.FlowExport = FlowExport.FlowExport;
exports["default"] = Plugin;
