'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ActionMenu = require('./ActionMenu-607d7858.js');
var plugins = require('./plugins-e1453ab8.js');

var Plugin = {
  install: function install(Vue) {
    plugins.registerComponent(Vue, ActionMenu.MovActionMenu);
  }
};

exports.MovActionMenu = ActionMenu.MovActionMenu;
exports["default"] = Plugin;
