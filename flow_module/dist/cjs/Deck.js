'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Deck = require('./Deck-3eef01ed.js');
var plugins = require('./plugins-e1453ab8.js');

var Plugin = {
  install: function install(Vue) {
    plugins.registerComponent(Vue, Deck.Deck);
  }
};

exports.Deck = Deck.Deck;
exports["default"] = Plugin;
