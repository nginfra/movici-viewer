'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var FlowProjects = require('./FlowProjects-f9abc485.js');
var plugins = require('./plugins-e1453ab8.js');

var Plugin = {
  install: function install(Vue) {
    plugins.registerComponent(Vue, FlowProjects.FlowProjects);
  }
};

exports.FlowProjects = FlowProjects.FlowProjects;
exports["default"] = Plugin;
