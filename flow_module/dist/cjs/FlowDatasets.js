'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var FlowDatasets = require('./FlowDatasets-f457f822.js');
var plugins = require('./plugins-e1453ab8.js');

var Plugin = {
  install: function install(Vue) {
    plugins.registerComponent(Vue, FlowDatasets.FlowDatasets);
  }
};

exports.FlowDatasets = FlowDatasets.FlowDatasets;
exports["default"] = Plugin;
