'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ActionBar = require('./ActionBar-20c3094c.js');
var plugins = require('./plugins-e1453ab8.js');

var Plugin = {
  install: function install(Vue) {
    plugins.registerComponent(Vue, ActionBar.MovActionBar);
  }
};

exports.MovActionBar = ActionBar.MovActionBar;
exports["default"] = Plugin;
