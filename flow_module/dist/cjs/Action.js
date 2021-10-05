'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Action = require('./Action-ba223848.js');
var plugins = require('./plugins-e1453ab8.js');

var Plugin = {
  install: function install(Vue) {
    plugins.registerComponent(Vue, Action.MovAction);
  }
};

exports.MovAction = Action.MovAction;
exports["default"] = Plugin;
