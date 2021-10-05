'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var FlowMain = require('./FlowMain-9ad9724c.js');
var plugins = require('./plugins-e1453ab8.js');

var Plugin = {
  install: function install(Vue) {
    plugins.registerComponent(Vue, FlowMain.FlowMain);
  }
};

exports.FlowMain = FlowMain.FlowMain;
exports["default"] = Plugin;
