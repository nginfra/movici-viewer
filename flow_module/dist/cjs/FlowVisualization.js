'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var FlowVisualization = require('./FlowVisualization-0fd3c043.js');
var plugins = require('./plugins-e1453ab8.js');

var Plugin = {
  install: function install(Vue) {
    plugins.registerComponent(Vue, FlowVisualization.FlowVisualization);
  }
};

exports.FlowVisualization = FlowVisualization.FlowVisualization;
exports["default"] = Plugin;
