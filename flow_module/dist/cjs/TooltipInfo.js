'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var TooltipInfo = require('./TooltipInfo-141f96e9.js');
var plugins = require('./plugins-e1453ab8.js');

var Plugin = {
  install: function install(Vue) {
    plugins.registerComponent(Vue, TooltipInfo.MovTooltipInfo);
  }
};

exports.MovTooltipInfo = TooltipInfo.MovTooltipInfo;
exports["default"] = Plugin;
