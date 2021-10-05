'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var LanguagePicker = require('./LanguagePicker-322ce485.js');
var plugins = require('./plugins-e1453ab8.js');

var Plugin = {
  install: function install(Vue) {
    plugins.registerComponent(Vue, LanguagePicker.MovLanguagePicker);
  }
};

exports.MovLanguagePicker = LanguagePicker.MovLanguagePicker;
exports["default"] = Plugin;
