'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var MapVis = require('./MapVis-641617ef.js');
var plugins = require('./plugins-e1453ab8.js');

var Plugin = {
  install: function install(Vue) {
    plugins.registerComponent(Vue, MapVis.MapVis);
  }
};

exports.MapVis = MapVis.MapVis;
exports["default"] = Plugin;
