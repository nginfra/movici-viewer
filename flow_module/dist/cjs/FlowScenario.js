'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var FlowScenario = require('./FlowScenario-995ab579.js');
var plugins = require('./plugins-e1453ab8.js');

var Plugin = {
  install: function install(Vue) {
    plugins.registerComponent(Vue, FlowScenario.FlowScenario);
  }
};

exports.FlowScenario = FlowScenario.FlowScenario;
exports["default"] = Plugin;
