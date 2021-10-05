import axios from 'axios';
import proj4 from 'proj4';
import { reproject } from 'reproject';
import Vue from 'vue';
import VueI18n from 'vue-i18n';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global_1 =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
var isCallable = function (argument) {
  return typeof argument === 'function';
};

var isObject$1 = function (it) {
  return typeof it === 'object' ? it !== null : isCallable(it);
};

var document$1 = global_1.document;
// typeof document.createElement is 'object' in old IE
var EXISTS$1 = isObject$1(document$1) && isObject$1(document$1.createElement);

var documentCreateElement = function (it) {
  return EXISTS$1 ? document$1.createElement(it) : {};
};

// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`


var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

var domTokenListPrototype = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;

var tryToString = function (argument) {
  try {
    return String(argument);
  } catch (error) {
    return 'Object';
  }
};

// `Assert: IsCallable(argument) is true`
var aCallable = function (argument) {
  if (isCallable(argument)) return argument;
  throw TypeError(tryToString(argument) + ' is not a function');
};

// optional / simple context binding
var functionBindContext = function (fn, that, length) {
  aCallable(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

var toString$2 = {}.toString;

var classofRaw = function (it) {
  return toString$2.call(it).slice(8, -1);
};

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

var ceil = Math.ceil;
var floor$2 = Math.floor;

// `ToInteger` abstract operation
// https://tc39.es/ecma262/#sec-tointeger
var toInteger = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor$2 : ceil)(argument);
};

var min$2 = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
var toLength = function (argument) {
  return argument > 0 ? min$2(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
var isArray$1 = Array.isArray || function isArray(argument) {
  return classofRaw(argument) == 'Array';
};

var isPure = false;

var setGlobal = function (key, value) {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty(global_1, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global_1[key] = value;
  } return value;
};

var SHARED = '__core-js_shared__';
var store$1 = global_1[SHARED] || setGlobal(SHARED, {});

var sharedStore = store$1;

var shared = createCommonjsModule(function (module) {
(module.exports = function (key, value) {
  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.18.1',
  mode: 'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});
});

var hasOwnProperty$2 = {}.hasOwnProperty;

var has$1 = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty$2.call(toObject(it), key);
};

var id = 0;
var postfix = Math.random();

var uid = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global_1[namespace]) : global_1[namespace] && global_1[namespace][method];
};

var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

var process$1 = global_1.process;
var Deno = global_1.Deno;
var versions = process$1 && process$1.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] < 4 ? 1 : match[0] + match[1];
} else if (engineUserAgent) {
  match = engineUserAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = engineUserAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

var engineV8Version = version && +version;

/* eslint-disable es/no-symbol -- required for testing */



// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && engineV8Version && engineV8Version < 41;
});

/* eslint-disable es/no-symbol -- required for testing */


var useSymbolAsUid = nativeSymbol
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

var WellKnownSymbolsStore = shared('wks');
var Symbol$2 = global_1.Symbol;
var createWellKnownSymbol = useSymbolAsUid ? Symbol$2 : Symbol$2 && Symbol$2.withoutSetter || uid;

var wellKnownSymbol = function (name) {
  if (!has$1(WellKnownSymbolsStore, name) || !(nativeSymbol || typeof WellKnownSymbolsStore[name] == 'string')) {
    if (nativeSymbol && has$1(Symbol$2, name)) {
      WellKnownSymbolsStore[name] = Symbol$2[name];
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
    }
  } return WellKnownSymbolsStore[name];
};

var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG$3] = 'z';

var toStringTagSupport = String(test) === '[object z]';

var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof = toStringTagSupport ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};

var functionToString = Function.toString;

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(sharedStore.inspectSource)) {
  sharedStore.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

var inspectSource = sharedStore.inspectSource;

var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = constructorRegExp.exec;
var INCORRECT_TO_STRING = !constructorRegExp.exec(function () { /* empty */ });

var isConstructorModern = function (argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(Object, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function (argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
    // we can't check .prototype since constructors produced by .bind haven't it
  } return INCORRECT_TO_STRING || !!exec.call(constructorRegExp, inspectSource(argument));
};

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
var isConstructor = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;

var SPECIES$4 = wellKnownSymbol('species');

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesConstructor = function (originalArray) {
  var C;
  if (isArray$1(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === Array || isArray$1(C.prototype))) C = undefined;
    else if (isObject$1(C)) {
      C = C[SPECIES$4];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod$3 = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = indexedObject(O);
    var boundFunction = functionBindContext(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push.call(target, value); // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

var arrayIteration = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod$3(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod$3(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod$3(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod$3(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod$3(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod$3(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod$3(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod$3(7)
};

var arrayMethodIsStrict = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

var $forEach = arrayIteration.forEach;


var STRICT_METHOD$1 = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
var arrayForEach = !STRICT_METHOD$1 ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
} : [].forEach;

// Detect IE8's incomplete defineProperty implementation
var descriptors = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

// Thank's IE8 for his funny defineProperty
var ie8DomDefine = !descriptors && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

// `Assert: Type(argument) is Object`
var anObject = function (argument) {
  if (isObject$1(argument)) return argument;
  throw TypeError(String(argument) + ' is not an object');
};

var isSymbol$1 = useSymbolAsUid ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && Object(it) instanceof $Symbol;
};

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
var getMethod = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable(func);
};

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
var ordinaryToPrimitive = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject$1(val = fn.call(input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject$1(val = fn.call(input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject$1(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
var toPrimitive = function (input, pref) {
  if (!isObject$1(input) || isSymbol$1(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = exoticToPrim.call(input, pref);
    if (!isObject$1(result) || isSymbol$1(result)) return result;
    throw TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
var toPropertyKey = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol$1(key) ? key : String(key);
};

// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
var f$5 = descriptors ? $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var objectDefineProperty = {
	f: f$5
};

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var createNonEnumerableProperty = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var handlePrototype$1 = function (CollectionPrototype) {
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
  } catch (error) {
    CollectionPrototype.forEach = arrayForEach;
  }
};

for (var COLLECTION_NAME$1 in domIterables) {
  if (domIterables[COLLECTION_NAME$1]) {
    handlePrototype$1(global_1[COLLECTION_NAME$1] && global_1[COLLECTION_NAME$1].prototype);
  }
}

handlePrototype$1(domTokenListPrototype);

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
var f$4 = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor$1(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f$4
};

// toObject with fallback for non-array-like ES3 strings



var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
var f$3 = descriptors ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (ie8DomDefine) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has$1(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$3
};

var WeakMap$1 = global_1.WeakMap;

var nativeWeakMap = isCallable(WeakMap$1) && /native code/.test(inspectSource(WeakMap$1));

var keys = shared('keys');

var sharedKey = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var hiddenKeys$1 = {};

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var WeakMap = global_1.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject$1(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (nativeWeakMap || sharedStore.state) {
  var store = sharedStore.state || (sharedStore.state = new WeakMap());
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    if (wmhas.call(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys$1[STATE] = true;
  set = function (it, metadata) {
    if (has$1(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return has$1(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return has$1(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

var FunctionPrototype$1 = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = descriptors && Object.getOwnPropertyDescriptor;

var EXISTS = has$1(FunctionPrototype$1, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!descriptors || (descriptors && getDescriptor(FunctionPrototype$1, 'name').configurable));

var functionName = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

var redefine = createCommonjsModule(function (module) {
var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;

var getInternalState = internalState.get;
var enforceInternalState = internalState.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var name = options && options.name !== undefined ? options.name : key;
  var state;
  if (isCallable(value)) {
    if (String(name).slice(0, 7) === 'Symbol(') {
      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
    }
    if (!has$1(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
      createNonEnumerableProperty(value, 'name', name);
    }
    state = enforceInternalState(value);
    if (!state.source) {
      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
    }
  }
  if (O === global_1) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
});
});

var max = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod$2 = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod$2(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod$2(false)
};

var indexOf = arrayIncludes.indexOf;


var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has$1(hiddenKeys$1, key) && has$1(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has$1(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
var f$2 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys);
};

var objectGetOwnPropertyNames = {
	f: f$2
};

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
var f$1 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
	f: f$1
};

// all object keys, includes non-enumerable and symbols
var ownKeys$2 = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = objectGetOwnPropertyNames.f(anObject(it));
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

var copyConstructorProperties = function (target, source) {
  var keys = ownKeys$2(source);
  var defineProperty = objectDefineProperty.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has$1(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

var isForced_1 = isForced;

var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;






/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
  options.name        - the .name of the function if it does not match the key
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global_1;
  } else if (STATIC) {
    target = global_1[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global_1[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

var propertyIsEnumerable = objectPropertyIsEnumerable.f;

// `Object.{ entries, values }` methods implementation
var createMethod$1 = function (TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject(it);
    var keys = objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!descriptors || propertyIsEnumerable.call(O, key)) {
        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};

var objectToArray = {
  // `Object.entries` method
  // https://tc39.es/ecma262/#sec-object.entries
  entries: createMethod$1(true),
  // `Object.values` method
  // https://tc39.es/ecma262/#sec-object.values
  values: createMethod$1(false)
};

var $values = objectToArray.values;

// `Object.values` method
// https://tc39.es/ecma262/#sec-object.values
_export({ target: 'Object', stat: true }, {
  values: function values(O) {
    return $values(O);
  }
});

var MapVis = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('Deck',{attrs:{"value":_vm.viewState,"layers":_vm.layers,"basemap":_vm.basemap},on:{"input":function($event){return _vm.updateViewState($event)}},scopedSlots:_vm._u([(_vm.buildings)?{key:"map",fn:function(ref){
var map = ref.map;
return [_c('Buildings',{attrs:{"map":map}})]}}:null,{key:"control-zero",fn:function(ref){
var map = ref.map;
var onViewstateChange = ref.onViewstateChange;
return [_vm._t("control-zero",null,null,Object.assign({}, _vm.slotProps, {map: map, onViewstateChange: onViewstateChange}))]}},{key:"control-left",fn:function(ref){
var map = ref.map;
var onViewstateChange = ref.onViewstateChange;
return [_vm._t("control-left",null,null,Object.assign({}, _vm.slotProps, {map: map, onViewstateChange: onViewstateChange}))]}},{key:"control-right",fn:function(ref){
var map = ref.map;
var onViewstateChange = ref.onViewstateChange;
return [_vm._t("control-right",null,null,Object.assign({}, _vm.slotProps, {map: map, onViewstateChange: onViewstateChange}))]}},{key:"control-bottom",fn:function(ref){
var map = ref.map;
var onViewstateChange = ref.onViewstateChange;
return [_vm._t("control-bottom",null,null,Object.assign({}, _vm.slotProps, {map: map, onViewstateChange: onViewstateChange}))]}}],null,true)})],1)},
staticRenderFns: [],
stub: 1
};

var Deck = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{attrs:{"id":"mapbox-container"}},[_c('div',{attrs:{"id":"map"}}),_vm._v(" "),_c('canvas',{attrs:{"id":"deckgl-overlay"}}),_vm._v(" "),(_vm.loaded)?_c('div',{staticClass:"map-control-zero"},[_vm._t("control-zero",null,{"map":_vm.map,"onViewstateChange":_vm.updateViewState})],2):_vm._e(),_vm._v(" "),(_vm.loaded)?_c('div',{staticClass:"map-control-left"},[_vm._t("control-left",null,{"map":_vm.map,"onViewstateChange":_vm.updateViewState})],2):_vm._e(),_vm._v(" "),(_vm.loaded)?_c('div',{staticClass:"map-control-right"},[_vm._t("control-right",null,{"map":_vm.map,"onViewstateChange":_vm.updateViewState})],2):_vm._e(),_vm._v(" "),(_vm.loaded)?_c('div',{staticClass:"map-control-bottom"},[_vm._t("control-bottom",null,{"map":_vm.map,"onViewstateChange":_vm.updateViewState})],2):_vm._e(),_vm._v(" "),(_vm.loaded)?[_vm._t("map",null,{"map":_vm.map,"deck":_vm.deck,"viewState":_vm.value})]:_vm._e()],2)])},
staticRenderFns: [],
stub: 1
};

var Action = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('b-tooltip',{attrs:{"label":_vm.label,"type":"is-black"}},[_c('b-button',{staticClass:"is-borderless",class:_vm.actionClass,attrs:{"disabled":_vm.disabled},on:{"click":function($event){return _vm.$emit('click')}}},[_c('b-icon',{attrs:{"icon":_vm.icon,"size":_vm.minIconSize,"type":_vm.type}})],1)],1)},
staticRenderFns: [],
stub: 1
};

var ActionBar = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._t("before"),_vm._v(" "),_vm._l((_vm.actionList),function(action,idx){return _c('MovAction',{key:idx,class:_vm.additionalClasses,attrs:{"action":action,"size":_vm.size,"disabled":_vm.isDisabled(action)},on:{"click":function($event){return _vm.$emit(action)}}})}),_vm._v(" "),_vm._t("after")],2)},
staticRenderFns: [],
stub: 1
};

var ActionMenu = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"dropdown dropdown-menu-animation is-mobile-modal",attrs:{"tabindex":"0"},on:{"blur":function($event){_vm.visible = false;}}},[_c('div',{ref:"anchorRef",staticClass:"dropdown-trigger",attrs:{"role":"button","aria-haspopup":"true"},on:{"click":_vm.toggle}},[_c('span',{staticClass:"ellipsis"},[_c('b-icon',{attrs:{"size":"is-small","pack":"far","icon":"ellipsis-v"}})],1)]),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.visible),expression:"visible"}],ref:"popupRef",staticClass:"dropdown-menu",style:(_vm.style)},[_c('div',{staticClass:"dropdown-content"},_vm._l((_vm.value),function(item,index){return _c('a',{key:index,staticClass:"dropdown-item",class:item.colorScheme,attrs:{"focusable":false,"disabled":item.isDisabled ? item.isDisabled() : null},on:{"click":function($event){return _vm.emitAndClose(item.event, $event)}}},[_c('b-icon',{staticClass:"mr-2",attrs:{"icon":item.icon,"pack":item.iconPack || 'far'}}),_vm._v(" "),_c('span',[_vm._v("\n          "+_vm._s(item.label)+"\n        ")])],1)}),0)])])},
staticRenderFns: [],
stub: 1
};

var LanguagePicker = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('b-field',{attrs:{"label":_vm.label}},[_c('b-select',{model:{value:(_vm.language),callback:function ($$v) {_vm.language=$$v;},expression:"language"}},_vm._l((_vm.languages),function(lang,i){return _c('option',{key:("Lang" + i),domProps:{"value":lang}},[_vm._v(_vm._s(lang))])}),0)],1)},
staticRenderFns: [],
stub: 1
};

var TooltipInfo = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('span',{staticClass:"b-tooltip is-white is-bottom is-medium",class:_vm.color},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.visible),expression:"visible"}],ref:"popupRef",staticClass:"tooltip-content",style:(_vm.style)},[_vm._t("tooltip-content",[_c('span',{staticClass:"is-size-7"},[_vm._v("\n          "+_vm._s(_vm.text)+"\n        ")])])],2),_vm._v(" "),_c('div',{ref:"anchorRef",staticClass:"tooltip-trigger",on:{"mouseover":function($event){return _vm.toggle(true)},"mouseleave":function($event){return _vm.toggle(false)}}},[(!this.$slots.default)?_c('b-icon',{attrs:{"icon":_vm.icon}}):_vm._e(),_vm._v(" "),_vm._t("default")],2)])])},
staticRenderFns: [],
stub: 1
};

var components = /*#__PURE__*/Object.freeze({
	__proto__: null,
	MovMapVis: MapVis,
	MovDeck: Deck,
	MovAction: Action,
	MovActionBar: ActionBar,
	MovActionMenu: ActionMenu,
	MovLanguagePicker: LanguagePicker,
	MovTooltipInfo: TooltipInfo
});

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys$1(Object(source), true).forEach(function (key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys$1(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _typeof$1(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$1 = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof$1 = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof$1(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

/**
 * Merge function to replace Object.assign with deep merging possibility
 */

var isObject = function isObject(item) {
  return _typeof$1(item) === 'object' && !Array.isArray(item);
};

var mergeFn = function mergeFn(target, source) {
  var deep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (deep || !Object.assign) {
    var isDeep = function isDeep(prop) {
      return isObject(source[prop]) && target !== null && target.hasOwnProperty(prop) && isObject(target[prop]);
    };

    var replaced = Object.getOwnPropertyNames(source).map(function (prop) {
      return _defineProperty({}, prop, isDeep(prop) ? mergeFn(target[prop], source[prop], deep) : source[prop]);
    }).reduce(function (a, b) {
      return _objectSpread2({}, a, {}, b);
    }, {});
    return _objectSpread2({}, target, {}, replaced);
  } else {
    return Object.assign(target, source);
  }
};

var merge = mergeFn;
function removeElement(el) {
  if (typeof el.remove !== 'undefined') {
    el.remove();
  } else if (typeof el.parentNode !== 'undefined' && el.parentNode !== null) {
    el.parentNode.removeChild(el);
  }
}

var config = {
  defaultContainerElement: null,
  defaultIconPack: 'mdi',
  defaultIconComponent: null,
  defaultIconPrev: 'chevron-left',
  defaultIconNext: 'chevron-right',
  defaultLocale: undefined,
  defaultDialogConfirmText: null,
  defaultDialogCancelText: null,
  defaultSnackbarDuration: 3500,
  defaultSnackbarPosition: null,
  defaultToastDuration: 2000,
  defaultToastPosition: null,
  defaultNotificationDuration: 2000,
  defaultNotificationPosition: null,
  defaultTooltipType: 'is-primary',
  defaultTooltipDelay: null,
  defaultInputAutocomplete: 'on',
  defaultDateFormatter: null,
  defaultDateParser: null,
  defaultDateCreator: null,
  defaultTimeCreator: null,
  defaultDayNames: null,
  defaultMonthNames: null,
  defaultFirstDayOfWeek: null,
  defaultUnselectableDaysOfWeek: null,
  defaultTimeFormatter: null,
  defaultTimeParser: null,
  defaultModalCanCancel: ['escape', 'x', 'outside', 'button'],
  defaultModalScroll: null,
  defaultDatepickerMobileNative: true,
  defaultTimepickerMobileNative: true,
  defaultNoticeQueue: true,
  defaultInputHasCounter: true,
  defaultTaginputHasCounter: true,
  defaultUseHtml5Validation: true,
  defaultDropdownMobileModal: true,
  defaultFieldLabelPosition: null,
  defaultDatepickerYearsRange: [-100, 10],
  defaultDatepickerNearbyMonthDays: true,
  defaultDatepickerNearbySelectableMonthDays: false,
  defaultDatepickerShowWeekNumber: false,
  defaultDatepickerWeekNumberClickable: false,
  defaultDatepickerMobileModal: true,
  defaultTrapFocus: true,
  defaultAutoFocus: true,
  defaultButtonRounded: false,
  defaultSwitchRounded: true,
  defaultCarouselInterval: 3500,
  defaultTabsExpanded: false,
  defaultTabsAnimated: true,
  defaultTabsType: null,
  defaultStatusIcon: true,
  defaultProgrammaticPromise: false,
  defaultLinkTags: ['a', 'button', 'input', 'router-link', 'nuxt-link', 'n-link', 'RouterLink', 'NuxtLink', 'NLink'],
  defaultImageWebpFallback: null,
  defaultImageLazy: true,
  defaultImageResponsive: true,
  defaultImageRatio: null,
  defaultImageSrcsetFormatter: null,
  customIconPacks: null
};
var VueInstance;

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var use = function use(plugin) {
  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
  }
};
var registerComponentProgrammatic$1 = function registerComponentProgrammatic(Vue, property, component) {
  if (!Vue.prototype.$buefy) Vue.prototype.$buefy = {};
  Vue.prototype.$buefy[property] = component;
};

var NoticeMixin = {
  props: {
    type: {
      type: String,
      default: 'is-dark'
    },
    message: [String, Array],
    duration: Number,
    queue: {
      type: Boolean,
      default: undefined
    },
    indefinite: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'is-top',
      validator: function validator(value) {
        return ['is-top-right', 'is-top', 'is-top-left', 'is-bottom-right', 'is-bottom', 'is-bottom-left'].indexOf(value) > -1;
      }
    },
    container: String
  },
  data: function data() {
    return {
      isActive: false,
      parentTop: null,
      parentBottom: null,
      newContainer: this.container || config.defaultContainerElement
    };
  },
  computed: {
    correctParent: function correctParent() {
      switch (this.position) {
        case 'is-top-right':
        case 'is-top':
        case 'is-top-left':
          return this.parentTop;

        case 'is-bottom-right':
        case 'is-bottom':
        case 'is-bottom-left':
          return this.parentBottom;
      }
    },
    transition: function transition() {
      switch (this.position) {
        case 'is-top-right':
        case 'is-top':
        case 'is-top-left':
          return {
            enter: 'fadeInDown',
            leave: 'fadeOut'
          };

        case 'is-bottom-right':
        case 'is-bottom':
        case 'is-bottom-left':
          return {
            enter: 'fadeInUp',
            leave: 'fadeOut'
          };
      }
    }
  },
  methods: {
    shouldQueue: function shouldQueue() {
      var queue = this.queue !== undefined ? this.queue : config.defaultNoticeQueue;
      if (!queue) return false;
      return this.parentTop.childElementCount > 0 || this.parentBottom.childElementCount > 0;
    },
    close: function close() {
      var _this = this;

      clearTimeout(this.timer);
      this.isActive = false;
      this.$emit('close'); // Timeout for the animation complete before destroying

      setTimeout(function () {
        _this.$destroy();

        removeElement(_this.$el);
      }, 150);
    },
    showNotice: function showNotice() {
      var _this2 = this;

      if (this.shouldQueue()) {
        // Call recursively if should queue
        setTimeout(function () {
          return _this2.showNotice();
        }, 250);
        return;
      }

      this.correctParent.insertAdjacentElement('afterbegin', this.$el);
      this.isActive = true;

      if (!this.indefinite) {
        this.timer = setTimeout(function () {
          return _this2.close();
        }, this.newDuration);
      }
    },
    setupContainer: function setupContainer() {
      this.parentTop = document.querySelector((this.newContainer ? this.newContainer : 'body') + '>.notices.is-top');
      this.parentBottom = document.querySelector((this.newContainer ? this.newContainer : 'body') + '>.notices.is-bottom');
      if (this.parentTop && this.parentBottom) return;

      if (!this.parentTop) {
        this.parentTop = document.createElement('div');
        this.parentTop.className = 'notices is-top';
      }

      if (!this.parentBottom) {
        this.parentBottom = document.createElement('div');
        this.parentBottom.className = 'notices is-bottom';
      }

      var container = document.querySelector(this.newContainer) || document.body;
      container.appendChild(this.parentTop);
      container.appendChild(this.parentBottom);

      if (this.newContainer) {
        this.parentTop.classList.add('has-custom-container');
        this.parentBottom.classList.add('has-custom-container');
      }
    }
  },
  beforeMount: function beforeMount() {
    this.setupContainer();
  },
  mounted: function mounted() {
    this.showNotice();
  }
};

//
var script = {
  name: 'BSnackbar',
  mixins: [NoticeMixin],
  props: {
    actionText: {
      type: String,
      default: 'OK'
    },
    onAction: {
      type: Function,
      default: function _default() {}
    },
    cancelText: {
      type: String | null,
      default: null
    }
  },
  data: function data() {
    return {
      newDuration: this.duration || config.defaultSnackbarDuration
    };
  },
  methods: {
    /**
    * Click listener.
    * Call action prop before closing (from Mixin).
    */
    action: function action() {
      this.onAction();
      this.close();
    }
  }
};

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"enter-active-class":_vm.transition.enter,"leave-active-class":_vm.transition.leave}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.isActive),expression:"isActive"}],staticClass:"snackbar",class:[_vm.type,_vm.position],attrs:{"role":_vm.actionText ? 'alertdialog' : 'alert'}},[(_vm.$slots.default)?[_vm._t("default")]:[_c('div',{staticClass:"text",domProps:{"innerHTML":_vm._s(_vm.message)}})],(_vm.cancelText)?_c('div',{staticClass:"action is-light is-cancel",on:{"click":_vm.close}},[_c('button',{staticClass:"button"},[_vm._v(_vm._s(_vm.cancelText))])]):_vm._e(),(_vm.actionText)?_c('div',{staticClass:"action",class:_vm.type,on:{"click":_vm.action}},[_c('button',{staticClass:"button"},[_vm._v(_vm._s(_vm.actionText))])]):_vm._e()],2)])};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Snackbar = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

var localVueInstance;
var SnackbarProgrammatic = {
  open: function open(params) {
    var parent;

    if (typeof params === 'string') {
      params = {
        message: params
      };
    }

    var defaultParam = {
      type: 'is-success',
      position: config.defaultSnackbarPosition || 'is-bottom-right'
    };

    if (params.parent) {
      parent = params.parent;
      delete params.parent;
    }

    var slot;

    if (Array.isArray(params.message)) {
      slot = params.message;
      delete params.message;
    }

    var propsData = merge(defaultParam, params);
    var vm = typeof window !== 'undefined' && window.Vue ? window.Vue : localVueInstance || VueInstance;
    var SnackbarComponent = vm.extend(Snackbar);
    var component = new SnackbarComponent({
      parent: parent,
      el: document.createElement('div'),
      propsData: propsData
    });

    if (slot) {
      component.$slots.default = slot;
      component.$forceUpdate();
    }

    return component;
  }
};
var Plugin = {
  install: function install(Vue) {
    localVueInstance = Vue;
    registerComponentProgrammatic$1(Vue, 'snackbar', SnackbarProgrammatic);
  }
};
use(Plugin);

function successMessage(message) {
  openSnackbar({
    message: message,
    type: 'is-success',
    duration: 3000
  });
}
function failMessage(message) {
  openSnackbar({
    message: message,
    type: 'is-danger',
    duration: 60000
  });
}

function openSnackbar(message) {
  SnackbarProgrammatic.open(_objectSpread2$1({
    type: 'is-success',
    position: 'is-top',
    queue: false
  }, message));
}

var MovSnackBarProgramatic = {
  successMessage: successMessage,
  failMessage: failMessage
};

var FUNCTION_NAME_EXISTS = functionName.EXISTS;
var defineProperty$3 = objectDefineProperty.f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (descriptors && !FUNCTION_NAME_EXISTS) {
  defineProperty$3(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}

var registerComponent = function registerComponent(Vue, component) {
  Vue.component(component.name, component);
};
var registerComponentProgrammatic = function registerComponentProgrammatic(Vue, property, component) {
  if (!Vue.prototype.$flow) Vue.prototype.$flow = {};
  Vue.prototype.$flow[property] = component;
};

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
});

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
var objectToString$1 = toStringTagSupport ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!toStringTagSupport) {
  redefine(Object.prototype, 'toString', objectToString$1, { unsafe: true });
}

var toString_1$1 = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return String(argument);
};

// `String.prototype.codePointAt` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString_1$1(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

var stringMultibyte = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
  return O;
};

var html = getBuiltIn('document', 'documentElement');

/* global ActiveXObject -- old IE, WSH */








var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO$1 = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys$1[IE_PROTO$1] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : objectDefineProperties(result, Properties);
};

var correctPrototypeGetter = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (has$1(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof Object ? ObjectPrototype : null;
};

var ITERATOR$7 = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS$1 = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
  else {
    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype$2[ITERATOR$7].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype$2[ITERATOR$7])) {
  redefine(IteratorPrototype$2, ITERATOR$7, function () {
    return this;
  });
}

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype$2,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
};

var defineProperty$2 = objectDefineProperty.f;



var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');

var setToStringTag = function (it, TAG, STATIC) {
  if (it && !has$1(it = STATIC ? it : it.prototype, TO_STRING_TAG$1)) {
    defineProperty$2(it, TO_STRING_TAG$1, { configurable: true, value: TAG });
  }
};

var iterators = {};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





var returnThis$1 = function () { return this; };

var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
  iterators[TO_STRING_TAG] = returnThis$1;
  return IteratorConstructor;
};

var aPossiblePrototype = function (argument) {
  if (typeof argument === 'object' || isCallable(argument)) return argument;
  throw TypeError("Can't set " + String(argument) + ' as a prototype');
};

/* eslint-disable no-proto -- safe */



// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var PROPER_FUNCTION_NAME = functionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
var IteratorPrototype = iteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$6 = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$6]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (objectSetPrototypeOf) {
          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR$6])) {
          redefine(CurrentIteratorPrototype, ITERATOR$6, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return nativeIterator.call(this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if (IterablePrototype[ITERATOR$6] !== defaultIterator) {
    redefine(IterablePrototype, ITERATOR$6, defaultIterator, { name: DEFAULT });
  }
  iterators[NAME] = defaultIterator;

  return methods;
};

var charAt$1 = stringMultibyte.charAt;




var STRING_ITERATOR = 'String Iterator';
var setInternalState$4 = internalState.set;
var getInternalState$2 = internalState.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState$4(this, {
    type: STRING_ITERATOR,
    string: toString_1$1(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState$2(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt$1(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype$1 = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
  objectDefineProperty.f(ArrayPrototype$1, UNSCOPABLES, {
    configurable: true,
    value: objectCreate(null)
  });
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables = function (key) {
  ArrayPrototype$1[UNSCOPABLES][key] = true;
};

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState$3 = internalState.set;
var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState$3(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState$1(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
iterators.Arguments = iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

var ITERATOR$5 = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = es_array_iterator.values;

var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR$5] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR$5, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR$5] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (domIterables[COLLECTION_NAME]) for (var METHOD_NAME in es_array_iterator) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
      }
    }
  }
};

for (var COLLECTION_NAME in domIterables) {
  handlePrototype(global_1[COLLECTION_NAME] && global_1[COLLECTION_NAME].prototype, COLLECTION_NAME);
}

handlePrototype(domTokenListPrototype, 'DOMTokenList');

var ITERATOR$4 = wellKnownSymbol('iterator');

var nativeUrl = !fails(function () {
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return (isPure && !url.toJSON)
    || !searchParams.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || searchParams.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !searchParams[ITERATOR$4]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
});

var anInstance = function (it, Constructor, name) {
  if (it instanceof Constructor) return it;
  throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
};

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty$1 = Object.defineProperty;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
var objectAssign = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (descriptors && $assign({ b: 1 }, $assign(defineProperty$1({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty$1(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
  while (argumentsLength > index) {
    var S = indexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;

var iteratorClose = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = innerResult.call(iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};

// call something on iterator step with safe closing on error
var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};

var ITERATOR$3 = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod = function (it) {
  return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR$3] === it);
};

var createProperty = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

var ITERATOR$2 = wellKnownSymbol('iterator');

var getIteratorMethod = function (it) {
  if (it != undefined) return getMethod(it, ITERATOR$2)
    || getMethod(it, '@@iterator')
    || iterators[classof(it)];
};

var getIterator = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(iteratorMethod.call(argument));
  throw TypeError(String(argument) + ' is not iterable');
};

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var IS_CONSTRUCTOR = isConstructor(this);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod && !(this == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    result = IS_CONSTRUCTOR ? new this() : [];
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = IS_CONSTRUCTOR ? new this(length) : Array(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;
var floor$1 = Math.floor;
var stringFromCharCode = String.fromCharCode;

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor$1(delta / damp) : delta >> 1;
  delta += floor$1(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor$1(delta / baseMinusTMin);
  }
  return floor$1(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
// eslint-disable-next-line max-statements -- TODO
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor$1((maxInt - delta) / handledCPCountPlusOne)) {
      throw RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        for (var k = base; /* no condition */; k += base) {
          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor$1(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
};

var stringPunycodeToAscii = function (input) {
  var encoded = [];
  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
  }
  return encoded.join('.');
};

var redefineAll = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`























var nativeFetch = getBuiltIn('fetch');
var NativeRequest = getBuiltIn('Request');
var RequestPrototype = NativeRequest && NativeRequest.prototype;
var Headers = getBuiltIn('Headers');
var ITERATOR$1 = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState$2 = internalState.set;
var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);

var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function (sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = it.replace(plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = result.replace(percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};

var find = /[!'()~]|%20/g;

var replace = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replace[match];
};

var serialize = function (it) {
  return encodeURIComponent(it).replace(find, replacer);
};

var parseSearchParams = function (result, query) {
  if (query) {
    var attributes = query.split('&');
    var index = 0;
    var attribute, entry;
    while (index < attributes.length) {
      attribute = attributes[index++];
      if (attribute.length) {
        entry = attribute.split('=');
        result.push({
          key: deserialize(entry.shift()),
          value: deserialize(entry.join('='))
        });
      }
    }
  }
};

var updateSearchParams = function (query) {
  this.entries.length = 0;
  parseSearchParams(this.entries, query);
};

var validateArgumentsLength = function (passed, required) {
  if (passed < required) throw TypeError('Not enough arguments');
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState$2(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
});

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var that = this;
  var entries = [];
  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

  setInternalState$2(that, {
    type: URL_SEARCH_PARAMS,
    entries: entries,
    updateURL: function () { /* empty */ },
    updateSearchParams: updateSearchParams
  });

  if (init !== undefined) {
    if (isObject$1(init)) {
      iteratorMethod = getIteratorMethod(init);
      if (iteratorMethod) {
        iterator = getIterator(init, iteratorMethod);
        next = iterator.next;
        while (!(step = next.call(iterator)).done) {
          entryIterator = getIterator(anObject(step.value));
          entryNext = entryIterator.next;
          if (
            (first = entryNext.call(entryIterator)).done ||
            (second = entryNext.call(entryIterator)).done ||
            !entryNext.call(entryIterator).done
          ) throw TypeError('Expected sequence with length 2');
          entries.push({ key: toString_1$1(first.value), value: toString_1$1(second.value) });
        }
      } else for (key in init) if (has$1(init, key)) entries.push({ key: key, value: toString_1$1(init[key]) });
    } else {
      parseSearchParams(
        entries,
        typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : toString_1$1(init)
      );
    }
  }
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

redefineAll(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.append` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength(arguments.length, 2);
    var state = getInternalParamsState(this);
    state.entries.push({ key: toString_1$1(name), value: toString_1$1(value) });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = toString_1$1(name);
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) entries.splice(index, 1);
      else index++;
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = toString_1$1(name);
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = toString_1$1(name);
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) result.push(entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = toString_1$1(name);
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = toString_1$1(name);
    var val = toString_1$1(value);
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) entries.splice(index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) entries.push({ key: key, value: val });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    var entries = state.entries;
    // Array#sort is not stable in some engines
    var slice = entries.slice();
    var entry, entriesIndex, sliceIndex;
    entries.length = 0;
    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
      entry = slice[sliceIndex];
      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
        if (entries[entriesIndex].key > entry.key) {
          entries.splice(entriesIndex, 0, entry);
          break;
        }
      }
      if (entriesIndex === sliceIndex) entries.push(entry);
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = functionBindContext(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
redefine(URLSearchParamsPrototype, ITERATOR$1, URLSearchParamsPrototype.entries, { name: 'entries' });

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
redefine(URLSearchParamsPrototype, 'toString', function toString() {
  var entries = getInternalParamsState(this).entries;
  var result = [];
  var index = 0;
  var entry;
  while (index < entries.length) {
    entry = entries[index++];
    result.push(serialize(entry.key) + '=' + serialize(entry.value));
  } return result.join('&');
}, { enumerable: true });

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

_export({ global: true, forced: !nativeUrl }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
if (!nativeUrl && isCallable(Headers)) {
  var wrapRequestOptions = function (init) {
    if (isObject$1(init)) {
      var body = init.body;
      var headers;
      if (classof(body) === URL_SEARCH_PARAMS) {
        headers = init.headers ? new Headers(init.headers) : new Headers();
        if (!headers.has('content-type')) {
          headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
        return objectCreate(init, {
          body: createPropertyDescriptor(0, String(body)),
          headers: createPropertyDescriptor(0, headers)
        });
      }
    } return init;
  };

  if (isCallable(nativeFetch)) {
    _export({ global: true, enumerable: true, forced: true }, {
      fetch: function fetch(input /* , init */) {
        return nativeFetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
      }
    });
  }

  if (isCallable(NativeRequest)) {
    var RequestConstructor = function Request(input /* , init */) {
      anInstance(this, RequestConstructor, 'Request');
      return new NativeRequest(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
    };

    RequestPrototype.constructor = RequestConstructor;
    RequestConstructor.prototype = RequestPrototype;

    _export({ global: true, forced: true }, {
      Request: RequestConstructor
    });
  }
}

var web_urlSearchParams = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`











var codeAt = stringMultibyte.codeAt;






var NativeURL = global_1.URL;
var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
var getInternalSearchParamsState = web_urlSearchParams.getState;
var setInternalState$1 = internalState.set;
var getInternalURLState = internalState.getterFor('URL');
var floor = Math.floor;
var pow = Math.pow;

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[A-Za-z]/;
// eslint-disable-next-line regexp/no-obscure-range -- safe
var ALPHANUMERIC = /[\d+-.A-Za-z]/;
var DIGIT = /\d/;
var HEX_START = /^0x/i;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\dA-Fa-f]+$/;
/* eslint-disable regexp/no-control-character -- safe */
var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #%/:<>?@[\\\]^|]/;
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\0\t\n\r #/:<>?@[\\\]^|]/;
var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u0020]+|[\u0000-\u0020]+$/g;
var TAB_AND_NEW_LINE = /[\t\n\r]/g;
/* eslint-enable regexp/no-control-character -- safe */
var EOF;

var parseHost = function (url, input) {
  var result, codePoints, index;
  if (input.charAt(0) == '[') {
    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
    result = parseIPv6(input.slice(1, -1));
    if (!result) return INVALID_HOST;
    url.host = result;
  // opaque host
  } else if (!isSpecial(url)) {
    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
    result = '';
    codePoints = arrayFrom(input);
    for (index = 0; index < codePoints.length; index++) {
      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
    }
    url.host = result;
  } else {
    input = stringPunycodeToAscii(input);
    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
    result = parseIPv4(input);
    if (result === null) return INVALID_HOST;
    url.host = result;
  }
};

var parseIPv4 = function (input) {
  var parts = input.split('.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.pop();
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && part.charAt(0) == '0') {
      radix = HEX_START.test(part) ? 16 : 8;
      part = part.slice(radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
      number = parseInt(part, radix);
    }
    numbers.push(number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = numbers.pop();
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// eslint-disable-next-line max-statements -- TODO
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var chr = function () {
    return input.charAt(pointer);
  };

  if (chr() == ':') {
    if (input.charAt(1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (chr()) {
    if (pieceIndex == 8) return;
    if (chr() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && HEX.test(chr())) {
      value = value * 16 + parseInt(chr(), 16);
      pointer++;
      length++;
    }
    if (chr() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (chr()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (chr() == '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!DIGIT.test(chr())) return;
        while (DIGIT.test(chr())) {
          number = parseInt(chr(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece == 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (chr() == ':') {
      pointer++;
      if (!chr()) return;
    } else if (chr()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

var serializeHost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      result.unshift(host % 256);
      host = floor(host / 256);
    } return result.join('.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += host[index].toString(16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentEncode = function (chr, set) {
  var code = codeAt(chr, 0);
  return code > 0x20 && code < 0x7F && !has$1(set, chr) ? chr : encodeURIComponent(chr);
};

var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

var isSpecial = function (url) {
  return has$1(specialSchemes, url.scheme);
};

var includesCredentials = function (url) {
  return url.username != '' || url.password != '';
};

var cannotHaveUsernamePasswordPort = function (url) {
  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
};

var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length == 2 && ALPHA.test(string.charAt(0))
    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
};

var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
    string.length == 2 ||
    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

var shortenURLsPath = function (url) {
  var path = url.path;
  var pathSize = path.length;
  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
    path.pop();
  }
};

var isSingleDot = function (segment) {
  return segment === '.' || segment.toLowerCase() === '%2e';
};

var isDoubleDot = function (segment) {
  segment = segment.toLowerCase();
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

// eslint-disable-next-line max-statements -- TODO
var parseURL = function (url, input, stateOverride, base) {
  var state = stateOverride || SCHEME_START;
  var pointer = 0;
  var buffer = '';
  var seenAt = false;
  var seenBracket = false;
  var seenPasswordToken = false;
  var codePoints, chr, bufferCodePoints, failure;

  if (!stateOverride) {
    url.scheme = '';
    url.username = '';
    url.password = '';
    url.host = null;
    url.port = null;
    url.path = [];
    url.query = null;
    url.fragment = null;
    url.cannotBeABaseURL = false;
    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
  }

  input = input.replace(TAB_AND_NEW_LINE, '');

  codePoints = arrayFrom(input);

  while (pointer <= codePoints.length) {
    chr = codePoints[pointer];
    switch (state) {
      case SCHEME_START:
        if (chr && ALPHA.test(chr)) {
          buffer += chr.toLowerCase();
          state = SCHEME;
        } else if (!stateOverride) {
          state = NO_SCHEME;
          continue;
        } else return INVALID_SCHEME;
        break;

      case SCHEME:
        if (chr && (ALPHANUMERIC.test(chr) || chr == '+' || chr == '-' || chr == '.')) {
          buffer += chr.toLowerCase();
        } else if (chr == ':') {
          if (stateOverride && (
            (isSpecial(url) != has$1(specialSchemes, buffer)) ||
            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
            (url.scheme == 'file' && !url.host)
          )) return;
          url.scheme = buffer;
          if (stateOverride) {
            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
            return;
          }
          buffer = '';
          if (url.scheme == 'file') {
            state = FILE;
          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
            state = SPECIAL_RELATIVE_OR_AUTHORITY;
          } else if (isSpecial(url)) {
            state = SPECIAL_AUTHORITY_SLASHES;
          } else if (codePoints[pointer + 1] == '/') {
            state = PATH_OR_AUTHORITY;
            pointer++;
          } else {
            url.cannotBeABaseURL = true;
            url.path.push('');
            state = CANNOT_BE_A_BASE_URL_PATH;
          }
        } else if (!stateOverride) {
          buffer = '';
          state = NO_SCHEME;
          pointer = 0;
          continue;
        } else return INVALID_SCHEME;
        break;

      case NO_SCHEME:
        if (!base || (base.cannotBeABaseURL && chr != '#')) return INVALID_SCHEME;
        if (base.cannotBeABaseURL && chr == '#') {
          url.scheme = base.scheme;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          url.cannotBeABaseURL = true;
          state = FRAGMENT;
          break;
        }
        state = base.scheme == 'file' ? FILE : RELATIVE;
        continue;

      case SPECIAL_RELATIVE_OR_AUTHORITY:
        if (chr == '/' && codePoints[pointer + 1] == '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = RELATIVE;
          continue;
        } break;

      case PATH_OR_AUTHORITY:
        if (chr == '/') {
          state = AUTHORITY;
          break;
        } else {
          state = PATH;
          continue;
        }

      case RELATIVE:
        url.scheme = base.scheme;
        if (chr == EOF) {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
        } else if (chr == '/' || (chr == '\\' && isSpecial(url))) {
          state = RELATIVE_SLASH;
        } else if (chr == '?') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = '';
          state = QUERY;
        } else if (chr == '#') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          state = FRAGMENT;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.path.pop();
          state = PATH;
          continue;
        } break;

      case RELATIVE_SLASH:
        if (isSpecial(url) && (chr == '/' || chr == '\\')) {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        } else if (chr == '/') {
          state = AUTHORITY;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = PATH;
          continue;
        } break;

      case SPECIAL_AUTHORITY_SLASHES:
        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        if (chr != '/' || buffer.charAt(pointer + 1) != '/') continue;
        pointer++;
        break;

      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
        if (chr != '/' && chr != '\\') {
          state = AUTHORITY;
          continue;
        } break;

      case AUTHORITY:
        if (chr == '@') {
          if (seenAt) buffer = '%40' + buffer;
          seenAt = true;
          bufferCodePoints = arrayFrom(buffer);
          for (var i = 0; i < bufferCodePoints.length; i++) {
            var codePoint = bufferCodePoints[i];
            if (codePoint == ':' && !seenPasswordToken) {
              seenPasswordToken = true;
              continue;
            }
            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
            if (seenPasswordToken) url.password += encodedCodePoints;
            else url.username += encodedCodePoints;
          }
          buffer = '';
        } else if (
          chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
          (chr == '\\' && isSpecial(url))
        ) {
          if (seenAt && buffer == '') return INVALID_AUTHORITY;
          pointer -= arrayFrom(buffer).length + 1;
          buffer = '';
          state = HOST;
        } else buffer += chr;
        break;

      case HOST:
      case HOSTNAME:
        if (stateOverride && url.scheme == 'file') {
          state = FILE_HOST;
          continue;
        } else if (chr == ':' && !seenBracket) {
          if (buffer == '') return INVALID_HOST;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PORT;
          if (stateOverride == HOSTNAME) return;
        } else if (
          chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
          (chr == '\\' && isSpecial(url))
        ) {
          if (isSpecial(url) && buffer == '') return INVALID_HOST;
          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PATH_START;
          if (stateOverride) return;
          continue;
        } else {
          if (chr == '[') seenBracket = true;
          else if (chr == ']') seenBracket = false;
          buffer += chr;
        } break;

      case PORT:
        if (DIGIT.test(chr)) {
          buffer += chr;
        } else if (
          chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
          (chr == '\\' && isSpecial(url)) ||
          stateOverride
        ) {
          if (buffer != '') {
            var port = parseInt(buffer, 10);
            if (port > 0xFFFF) return INVALID_PORT;
            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
            buffer = '';
          }
          if (stateOverride) return;
          state = PATH_START;
          continue;
        } else return INVALID_PORT;
        break;

      case FILE:
        url.scheme = 'file';
        if (chr == '/' || chr == '\\') state = FILE_SLASH;
        else if (base && base.scheme == 'file') {
          if (chr == EOF) {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (chr == '?') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (chr == '#') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
              url.host = base.host;
              url.path = base.path.slice();
              shortenURLsPath(url);
            }
            state = PATH;
            continue;
          }
        } else {
          state = PATH;
          continue;
        } break;

      case FILE_SLASH:
        if (chr == '/' || chr == '\\') {
          state = FILE_HOST;
          break;
        }
        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
          else url.host = base.host;
        }
        state = PATH;
        continue;

      case FILE_HOST:
        if (chr == EOF || chr == '/' || chr == '\\' || chr == '?' || chr == '#') {
          if (!stateOverride && isWindowsDriveLetter(buffer)) {
            state = PATH;
          } else if (buffer == '') {
            url.host = '';
            if (stateOverride) return;
            state = PATH_START;
          } else {
            failure = parseHost(url, buffer);
            if (failure) return failure;
            if (url.host == 'localhost') url.host = '';
            if (stateOverride) return;
            buffer = '';
            state = PATH_START;
          } continue;
        } else buffer += chr;
        break;

      case PATH_START:
        if (isSpecial(url)) {
          state = PATH;
          if (chr != '/' && chr != '\\') continue;
        } else if (!stateOverride && chr == '?') {
          url.query = '';
          state = QUERY;
        } else if (!stateOverride && chr == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (chr != EOF) {
          state = PATH;
          if (chr != '/') continue;
        } break;

      case PATH:
        if (
          chr == EOF || chr == '/' ||
          (chr == '\\' && isSpecial(url)) ||
          (!stateOverride && (chr == '?' || chr == '#'))
        ) {
          if (isDoubleDot(buffer)) {
            shortenURLsPath(url);
            if (chr != '/' && !(chr == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else if (isSingleDot(buffer)) {
            if (chr != '/' && !(chr == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else {
            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
              if (url.host) url.host = '';
              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
            }
            url.path.push(buffer);
          }
          buffer = '';
          if (url.scheme == 'file' && (chr == EOF || chr == '?' || chr == '#')) {
            while (url.path.length > 1 && url.path[0] === '') {
              url.path.shift();
            }
          }
          if (chr == '?') {
            url.query = '';
            state = QUERY;
          } else if (chr == '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += percentEncode(chr, pathPercentEncodeSet);
        } break;

      case CANNOT_BE_A_BASE_URL_PATH:
        if (chr == '?') {
          url.query = '';
          state = QUERY;
        } else if (chr == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (chr != EOF) {
          url.path[0] += percentEncode(chr, C0ControlPercentEncodeSet);
        } break;

      case QUERY:
        if (!stateOverride && chr == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (chr != EOF) {
          if (chr == "'" && isSpecial(url)) url.query += '%27';
          else if (chr == '#') url.query += '%23';
          else url.query += percentEncode(chr, C0ControlPercentEncodeSet);
        } break;

      case FRAGMENT:
        if (chr != EOF) url.fragment += percentEncode(chr, fragmentPercentEncodeSet);
        break;
    }

    pointer++;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLConstructor, 'URL');
  var base = arguments.length > 1 ? arguments[1] : undefined;
  var urlString = toString_1$1(url);
  var state = setInternalState$1(that, { type: 'URL' });
  var baseState, failure;
  if (base !== undefined) {
    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
    else {
      failure = parseURL(baseState = {}, toString_1$1(base));
      if (failure) throw TypeError(failure);
    }
  }
  failure = parseURL(state, urlString, null, baseState);
  if (failure) throw TypeError(failure);
  var searchParams = state.searchParams = new URLSearchParams$1();
  var searchParamsState = getInternalSearchParamsState(searchParams);
  searchParamsState.updateSearchParams(state.query);
  searchParamsState.updateURL = function () {
    state.query = String(searchParams) || null;
  };
  if (!descriptors) {
    that.href = serializeURL.call(that);
    that.origin = getOrigin.call(that);
    that.protocol = getProtocol.call(that);
    that.username = getUsername.call(that);
    that.password = getPassword.call(that);
    that.host = getHost.call(that);
    that.hostname = getHostname.call(that);
    that.port = getPort.call(that);
    that.pathname = getPathname.call(that);
    that.search = getSearch.call(that);
    that.searchParams = getSearchParams.call(that);
    that.hash = getHash.call(that);
  }
};

var URLPrototype = URLConstructor.prototype;

var serializeURL = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var username = url.username;
  var password = url.password;
  var host = url.host;
  var port = url.port;
  var path = url.path;
  var query = url.query;
  var fragment = url.fragment;
  var output = scheme + ':';
  if (host !== null) {
    output += '//';
    if (includesCredentials(url)) {
      output += username + (password ? ':' + password : '') + '@';
    }
    output += serializeHost(host);
    if (port !== null) output += ':' + port;
  } else if (scheme == 'file') output += '//';
  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  if (query !== null) output += '?' + query;
  if (fragment !== null) output += '#' + fragment;
  return output;
};

var getOrigin = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var port = url.port;
  if (scheme == 'blob') try {
    return new URLConstructor(scheme.path[0]).origin;
  } catch (error) {
    return 'null';
  }
  if (scheme == 'file' || !isSpecial(url)) return 'null';
  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
};

var getProtocol = function () {
  return getInternalURLState(this).scheme + ':';
};

var getUsername = function () {
  return getInternalURLState(this).username;
};

var getPassword = function () {
  return getInternalURLState(this).password;
};

var getHost = function () {
  var url = getInternalURLState(this);
  var host = url.host;
  var port = url.port;
  return host === null ? ''
    : port === null ? serializeHost(host)
    : serializeHost(host) + ':' + port;
};

var getHostname = function () {
  var host = getInternalURLState(this).host;
  return host === null ? '' : serializeHost(host);
};

var getPort = function () {
  var port = getInternalURLState(this).port;
  return port === null ? '' : String(port);
};

var getPathname = function () {
  var url = getInternalURLState(this);
  var path = url.path;
  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
};

var getSearch = function () {
  var query = getInternalURLState(this).query;
  return query ? '?' + query : '';
};

var getSearchParams = function () {
  return getInternalURLState(this).searchParams;
};

var getHash = function () {
  var fragment = getInternalURLState(this).fragment;
  return fragment ? '#' + fragment : '';
};

var accessorDescriptor = function (getter, setter) {
  return { get: getter, set: setter, configurable: true, enumerable: true };
};

if (descriptors) {
  objectDefineProperties(URLPrototype, {
    // `URL.prototype.href` accessors pair
    // https://url.spec.whatwg.org/#dom-url-href
    href: accessorDescriptor(serializeURL, function (href) {
      var url = getInternalURLState(this);
      var urlString = toString_1$1(href);
      var failure = parseURL(url, urlString);
      if (failure) throw TypeError(failure);
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.origin` getter
    // https://url.spec.whatwg.org/#dom-url-origin
    origin: accessorDescriptor(getOrigin),
    // `URL.prototype.protocol` accessors pair
    // https://url.spec.whatwg.org/#dom-url-protocol
    protocol: accessorDescriptor(getProtocol, function (protocol) {
      var url = getInternalURLState(this);
      parseURL(url, toString_1$1(protocol) + ':', SCHEME_START);
    }),
    // `URL.prototype.username` accessors pair
    // https://url.spec.whatwg.org/#dom-url-username
    username: accessorDescriptor(getUsername, function (username) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(toString_1$1(username));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.username = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.password` accessors pair
    // https://url.spec.whatwg.org/#dom-url-password
    password: accessorDescriptor(getPassword, function (password) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(toString_1$1(password));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.password = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.host` accessors pair
    // https://url.spec.whatwg.org/#dom-url-host
    host: accessorDescriptor(getHost, function (host) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, toString_1$1(host), HOST);
    }),
    // `URL.prototype.hostname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hostname
    hostname: accessorDescriptor(getHostname, function (hostname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, toString_1$1(hostname), HOSTNAME);
    }),
    // `URL.prototype.port` accessors pair
    // https://url.spec.whatwg.org/#dom-url-port
    port: accessorDescriptor(getPort, function (port) {
      var url = getInternalURLState(this);
      if (cannotHaveUsernamePasswordPort(url)) return;
      port = toString_1$1(port);
      if (port == '') url.port = null;
      else parseURL(url, port, PORT);
    }),
    // `URL.prototype.pathname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-pathname
    pathname: accessorDescriptor(getPathname, function (pathname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      url.path = [];
      parseURL(url, toString_1$1(pathname), PATH_START);
    }),
    // `URL.prototype.search` accessors pair
    // https://url.spec.whatwg.org/#dom-url-search
    search: accessorDescriptor(getSearch, function (search) {
      var url = getInternalURLState(this);
      search = toString_1$1(search);
      if (search == '') {
        url.query = null;
      } else {
        if ('?' == search.charAt(0)) search = search.slice(1);
        url.query = '';
        parseURL(url, search, QUERY);
      }
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.searchParams` getter
    // https://url.spec.whatwg.org/#dom-url-searchparams
    searchParams: accessorDescriptor(getSearchParams),
    // `URL.prototype.hash` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hash
    hash: accessorDescriptor(getHash, function (hash) {
      var url = getInternalURLState(this);
      hash = toString_1$1(hash);
      if (hash == '') {
        url.fragment = null;
        return;
      }
      if ('#' == hash.charAt(0)) hash = hash.slice(1);
      url.fragment = '';
      parseURL(url, hash, FRAGMENT);
    })
  });
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
redefine(URLPrototype, 'toJSON', function toJSON() {
  return serializeURL.call(this);
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
redefine(URLPrototype, 'toString', function toString() {
  return serializeURL.call(this);
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
    return nativeCreateObjectURL.apply(NativeURL, arguments);
  });
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
    return nativeRevokeObjectURL.apply(NativeURL, arguments);
  });
}

setToStringTag(URLConstructor, 'URL');

_export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
  URL: URLConstructor
});

/*
Adapted from https://github.com/bernawil/axios-concurrency

Copyright (C) 2019 Bernardo Wilberger

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */
var ConcurrencyManager = function ConcurrencyManager(axios) {
  var MAX_CONCURRENT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  if (MAX_CONCURRENT < 1) throw 'Concurrency Manager Error: minimun concurrent requests is 1';
  var instance = {
    queue: [],
    running: [],
    shiftInitial: function shiftInitial() {
      setTimeout(function () {
        if (instance.running.length < MAX_CONCURRENT) {
          instance.shift();
        }
      }, 0);
    },
    push: function push(reqHandler) {
      instance.queue.push(reqHandler);
      instance.shiftInitial();
    },
    shift: function shift() {
      if (instance.queue.length) {
        var queued = instance.queue.shift();

        if (queued) {
          queued.resolver(queued.request);
          instance.running.push(queued);
        }
      }
    },
    // Use as interceptor. Queue outgoing requests
    requestHandler: function requestHandler(req) {
      return new Promise(function (resolve) {
        instance.push({
          request: req,
          resolver: resolve
        });
        return req;
      });
    },
    // Use as interceptor. Execute queued request upon receiving a response
    responseHandler: function responseHandler(res) {
      instance.running.shift();
      instance.shift();
      return res;
    },
    responseErrorHandler: function responseErrorHandler(res) {
      return Promise.reject(instance.responseHandler(res));
    },
    interceptors: {
      request: -1,
      response: -1
    },
    detach: function detach() {
      axios.interceptors.request.eject(instance.interceptors.request);
      axios.interceptors.response.eject(instance.interceptors.response);
    }
  }; // queue concurrent requests

  instance.interceptors.request = axios.interceptors.request.use(instance.requestHandler);
  instance.interceptors.response = axios.interceptors.response.use(instance.responseHandler, instance.responseErrorHandler);
  return instance;
};

var Client = /*#__PURE__*/function () {
  function Client(config) {
    _classCallCheck(this, Client);

    var _a;

    this.baseURL = config.baseURL;
    this.apiToken = config.apiToken || null;
    this.http = axios.create();
    this.onError = (_a = config.defaultCallbacks) !== null && _a !== void 0 ? _a : {};

    if (config.concurrency) {
      ConcurrencyManager(this.http, config.concurrency);
    }
  }

  _createClass(Client, [{
    key: "downloadAsFile",
    value: function downloadAsFile(data, filename) {
      var url = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }, {
    key: "request",
    value: function () {
      var _request2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_request, onError) {
        var resp;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this.http.request(_request.generateConfig(this));

              case 3:
                resp = _context.sent;
                return _context.abrupt("return", _request.makeResponse(resp));

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                this.handleError(_context.t0, onError || {});
                return _context.abrupt("return", null);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7]]);
      }));

      function request(_x, _x2) {
        return _request2.apply(this, arguments);
      }

      return request;
    }()
  }, {
    key: "handleError",
    value: function handleError(e, onError) {
      var handlers = _objectSpread2$1(_objectSpread2$1({}, this.onError), onError);

      if (axios.isAxiosError(e)) {
        var payload = parseHTTPError(e);

        if (payload.status && handlers[payload.status]) {
          return handlers[payload.status](payload);
        }

        if (handlers.http) {
          return handlers.http(payload);
        }
      }

      if (handlers.all) {
        return handlers.all(e);
      }

      throw e;
    }
  }]);

  return Client;
}();
var HTTPS_STATUS_CODES = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Internal Server Error',
  502: 'Bad Gateway'
};

function parseHTTPError(err) {
  var status = undefined;
  var message = '';

  if (err.response) {
    status = err.response.status;
    message = JSON.stringify(err.response.data.message);
  }

  if (!message) {
    message = status ? HTTPS_STATUS_CODES[status] : 'Unknown Error';
  }

  return {
    status: status,
    message: message
  };
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

var BaseRequest$1 = /*#__PURE__*/function () {
  function BaseRequest() {
    _classCallCheck(this, BaseRequest);
  }

  _createClass(BaseRequest, [{
    key: "generateConfig",
    value: // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function generateConfig(client) {
      return this.makeRequest();
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      return resp.data;
    }
  }]);

  return BaseRequest;
}();
var Request$1 = /*#__PURE__*/function (_BaseRequest) {
  _inherits(Request, _BaseRequest);

  var _super = _createSuper(Request);

  function Request() {
    _classCallCheck(this, Request);

    return _super.apply(this, arguments);
  }

  _createClass(Request, [{
    key: "generateConfig",
    value: function generateConfig(client) {
      var baseURL = client.baseURL,
          request = this.makeRequest();
      return _objectSpread2$1({
        baseURL: baseURL,
        headers: client.apiToken ? {
          Authorization: client.apiToken
        } : {}
      }, request);
    }
  }]);

  return Request;
}(BaseRequest$1);

var SPECIES$3 = wellKnownSymbol('species');

var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return engineV8Version >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$3] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject$1(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray$1(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
_export({ target: 'Array', proto: true, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

var $map = arrayIteration.map;


var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

/* eslint-disable es/no-object-getownpropertynames -- safe */

var $getOwnPropertyNames = objectGetOwnPropertyNames.f;

var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var f = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};

var objectGetOwnPropertyNamesExternal = {
	f: f
};

var freezing = !fails(function () {
  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
  return Object.isExtensible(Object.preventExtensions({}));
});

var internalMetadata = createCommonjsModule(function (module) {
var defineProperty = objectDefineProperty.f;





var REQUIRED = false;
var METADATA = uid('meta');
var id = 0;

// eslint-disable-next-line es/no-object-isextensible -- safe
var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + id++, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject$1(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has$1(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has$1(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (freezing && REQUIRED && isExtensible(it) && !has$1(it, METADATA)) setMetadata(it);
  return it;
};

var enable = function () {
  meta.enable = function () { /* empty */ };
  REQUIRED = true;
  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
  var splice = [].splice;
  var test = {};
  test[METADATA] = 1;

  // prevent exposing of metadata key
  if (getOwnPropertyNames(test).length) {
    objectGetOwnPropertyNames.f = function (it) {
      var result = getOwnPropertyNames(it);
      for (var i = 0, length = result.length; i < length; i++) {
        if (result[i] === METADATA) {
          splice.call(result, i, 1);
          break;
        }
      } return result;
    };

    _export({ target: 'Object', stat: true, forced: true }, {
      getOwnPropertyNames: objectGetOwnPropertyNamesExternal.f
    });
  }
};

var meta = module.exports = {
  enable: enable,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys$1[METADATA] = true;
});
internalMetadata.enable;
internalMetadata.fastKey;
internalMetadata.getWeakData;
internalMetadata.onFreeze;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = functionBindContext(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw TypeError(String(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

// makes subclassing work correct for wrapped built-ins
var inheritIfRequired = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    objectSetPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject$1(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) objectSetPrototypeOf($this, NewTargetPrototype);
  return $this;
};

var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = global_1[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var exported = {};

  var fixMethod = function (KEY) {
    var nativeMethod = NativePrototype[KEY];
    redefine(NativePrototype, KEY,
      KEY == 'add' ? function add(value) {
        nativeMethod.call(this, value === 0 ? 0 : value);
        return this;
      } : KEY == 'delete' ? function (key) {
        return IS_WEAK && !isObject$1(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'get' ? function get(key) {
        return IS_WEAK && !isObject$1(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'has' ? function has(key) {
        return IS_WEAK && !isObject$1(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : function set(key, value) {
        nativeMethod.call(this, key === 0 ? 0 : key, value);
        return this;
      }
    );
  };

  var REPLACE = isForced_1(
    CONSTRUCTOR_NAME,
    !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
      new NativeConstructor().entries().next();
    }))
  );

  if (REPLACE) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    internalMetadata.enable();
  } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    // eslint-disable-next-line no-new -- required for testing
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });

    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (dummy, iterable) {
        anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
        if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }

    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }

    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

    // weak collections should not contains .clear method
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }

  exported[CONSTRUCTOR_NAME] = Constructor;
  _export({ global: true, forced: Constructor != NativeConstructor }, exported);

  setToStringTag(Constructor, CONSTRUCTOR_NAME);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};

var SPECIES$2 = wellKnownSymbol('species');

var setSpecies = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = objectDefineProperty.f;

  if (descriptors && Constructor && !Constructor[SPECIES$2]) {
    defineProperty(Constructor, SPECIES$2, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

var defineProperty = objectDefineProperty.f;








var fastKey = internalMetadata.fastKey;


var setInternalState = internalState.set;
var internalStateGetterFor = internalState.getterFor;

var collectionStrong = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        index: objectCreate(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!descriptors) that.size = 0;
      if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (descriptors) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };

    redefineAll(C.prototype, {
      // `{ Map, Set }.prototype.clear()` methods
      // https://tc39.es/ecma262/#sec-map.prototype.clear
      // https://tc39.es/ecma262/#sec-set.prototype.clear
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (descriptors) state.size = 0;
        else that.size = 0;
      },
      // `{ Map, Set }.prototype.delete(key)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.delete
      // https://tc39.es/ecma262/#sec-set.prototype.delete
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (descriptors) state.size--;
          else that.size--;
        } return !!entry;
      },
      // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.foreach
      // https://tc39.es/ecma262/#sec-set.prototype.foreach
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // `{ Map, Set}.prototype.has(key)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.has
      // https://tc39.es/ecma262/#sec-set.prototype.has
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // `Map.prototype.get(key)` method
      // https://tc39.es/ecma262/#sec-map.prototype.get
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // `Map.prototype.set(key, value)` method
      // https://tc39.es/ecma262/#sec-map.prototype.set
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // `Set.prototype.add(value)` method
      // https://tc39.es/ecma262/#sec-set.prototype.add
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (descriptors) defineProperty(C.prototype, 'size', {
      get: function () {
        return getInternalState(this).size;
      }
    });
    return C;
  },
  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
    // https://tc39.es/ecma262/#sec-map.prototype.entries
    // https://tc39.es/ecma262/#sec-map.prototype.keys
    // https://tc39.es/ecma262/#sec-map.prototype.values
    // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
    // https://tc39.es/ecma262/#sec-set.prototype.entries
    // https://tc39.es/ecma262/#sec-set.prototype.keys
    // https://tc39.es/ecma262/#sec-set.prototype.values
    // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return { value: undefined, done: true };
      }
      // return step by kind
      if (kind == 'keys') return { value: entry.key, done: false };
      if (kind == 'values') return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // `{ Map, Set }.prototype[@@species]` accessors
    // https://tc39.es/ecma262/#sec-get-map-@@species
    // https://tc39.es/ecma262/#sec-get-set-@@species
    setSpecies(CONSTRUCTOR_NAME);
  }
};
collectionStrong.getConstructor;
collectionStrong.setStrong;

// `Set` constructor
// https://tc39.es/ecma262/#sec-set-objects
collection('Set', function (init) {
  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

var nativeJoin = [].join;

var ES3_STRINGS = indexedObject != Object;
var STRICT_METHOD = arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.es/ecma262/#sec-array.prototype.join
_export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD }, {
  join: function join(separator) {
    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  // eslint-disable-next-line es/no-array-from -- required for testing
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: arrayFrom
});

var Dataset = function Dataset(config) {
  _classCallCheck(this, Dataset);

  var _a, _b, _c, _d, _e, _f;

  this.name = (_a = config === null || config === void 0 ? void 0 : config.name) !== null && _a !== void 0 ? _a : 'unknown_dataset';
  this.display_name = (config === null || config === void 0 ? void 0 : config.display_name) || this.name;
  this.uuid = (_b = config === null || config === void 0 ? void 0 : config.uuid) !== null && _b !== void 0 ? _b : '<unknown_uuid>';
  this.type = (_c = config === null || config === void 0 ? void 0 : config.type) !== null && _c !== void 0 ? _c : 'unknown';
  this.has_data = (_d = config === null || config === void 0 ? void 0 : config.has_data) !== null && _d !== void 0 ? _d : false;
  this.status = this.has_data ? 'Done' : 'Empty';
  this.created_on = (_e = config === null || config === void 0 ? void 0 : config.created_on) !== null && _e !== void 0 ? _e : undefined;
  this.last_modified = (_f = config === null || config === void 0 ? void 0 : config.last_modified) !== null && _f !== void 0 ? _f : undefined;
}; // eslint-disable-next-line @typescript-eslint/no-explicit-any

var DatasetWithData = /*#__PURE__*/function (_Dataset) {
  _inherits(DatasetWithData, _Dataset);

  var _super = _createSuper(DatasetWithData);

  function DatasetWithData(config) {
    var _this;

    _classCallCheck(this, DatasetWithData);

    var _a;

    _this = _super.call(this, config);
    _this.data = (_a = config.data) !== null && _a !== void 0 ? _a : {};
    return _this;
  }

  return DatasetWithData;
}(Dataset);

var FlowSectionItem;

(function (FlowSectionItem) {
  FlowSectionItem["PROJECT"] = "project";
  FlowSectionItem["DATASETS"] = "datasets";
  FlowSectionItem["SCENARIO"] = "scenario";
  FlowSectionItem["VISUALIZATION"] = "visualization";
  FlowSectionItem["EXPORT"] = "export";
})(FlowSectionItem || (FlowSectionItem = {}));

var FlowVisualizerType;

(function (FlowVisualizerType) {
  FlowVisualizerType["POINTS"] = "points";
  FlowVisualizerType["LINES"] = "lines";
  FlowVisualizerType["POLYGONS"] = "polygons";
  FlowVisualizerType["ARCS"] = "arcs"; // ICONS = 'icons',
  // HEAT_MAP = 'heat_map'
})(FlowVisualizerType || (FlowVisualizerType = {}));

var ColorLegendItem = function ColorLegendItem(_ref) {
  var title = _ref.title,
      label = _ref.label,
      visualizerType = _ref.visualizerType,
      colorType = _ref.colorType,
      colorLegends = _ref.colorLegends;

  _classCallCheck(this, ColorLegendItem);

  this.title = title;
  this.label = label;
  this.visualizerType = visualizerType;
  this.colorType = colorType;
  this.colorLegends = colorLegends !== null && colorLegends !== void 0 ? colorLegends : [];
};
var ColorByValueLegendItem = /*#__PURE__*/function (_ColorLegendItem) {
  _inherits(ColorByValueLegendItem, _ColorLegendItem);

  var _super = _createSuper(ColorByValueLegendItem);

  function ColorByValueLegendItem(config, byValue, legend) {
    var _this;

    _classCallCheck(this, ColorByValueLegendItem);

    _this = _super.call(this, config);

    if (byValue && (legend === null || legend === void 0 ? void 0 : legend.labels)) {
      _this.colorLegends = legend.labels.map(function (label, idx) {
        return [label, byValue.colors[idx][1]];
      });
    }

    return _this;
  }

  return ColorByValueLegendItem;
}(ColorLegendItem);
var ColorStaticLegendItem = /*#__PURE__*/function (_ColorLegendItem2) {
  _inherits(ColorStaticLegendItem, _ColorLegendItem2);

  var _super2 = _createSuper(ColorStaticLegendItem);

  function ColorStaticLegendItem(config, static_, legend) {
    var _this2;

    _classCallCheck(this, ColorStaticLegendItem);

    _this2 = _super2.call(this, config);

    if (static_ && legend) {
      _this2.colorLegends = [[legend.title || 'Topology', static_.color]];
    }

    return _this2;
  }

  return ColorStaticLegendItem;
}(ColorLegendItem);

var EntityGeometry;

(function (EntityGeometry) {
  EntityGeometry["POINT"] = "points";
  EntityGeometry["LINE"] = "lines";
  EntityGeometry["POLYGON"] = "polygons";
})(EntityGeometry || (EntityGeometry = {}));

var SimulationMode;

(function (SimulationMode) {
  SimulationMode["TIME_ORIENTED"] = "time_oriented";
  SimulationMode["EVENT_ORIENTED"] = "event_oriented";
})(SimulationMode || (SimulationMode = {}));

var DatasetFormat;

(function (DatasetFormat) {
  DatasetFormat["ENTITY_BASED"] = "entity_based";
  DatasetFormat["UNSTRUCTURED"] = "unstructured";
  DatasetFormat["BINARY"] = "binary";
})(DatasetFormat || (DatasetFormat = {}));

var Scope = function Scope(config) {
  _classCallCheck(this, Scope);

  this.scope_name = config.scope_name;
  this.scope_uuid = config.scope_uuid;
};
var ScopeCollection = function ScopeCollection(config) {
  _classCallCheck(this, ScopeCollection);

  this.scopes = config.scopes;
};
var RoleType;

(function (RoleType) {
  RoleType["owner"] = "owner";
  RoleType["viewer"] = "viewer";
  RoleType["user"] = "user";
  RoleType["admin"] = "admin";
})(RoleType || (RoleType = {}));

var VisualizationMode;

(function (VisualizationMode) {
  VisualizationMode["GEOMETRY"] = "geometry";
  VisualizationMode["SCENARIO"] = "scenario";
})(VisualizationMode || (VisualizationMode = {}));

var LayerKind;

(function (LayerKind) {
  LayerKind["STATIC_COLOR"] = "static_color";
  LayerKind["HEAT_MAP"] = "heat_map";
  LayerKind["COLOR_MAP"] = "color_map";
  LayerKind["ACTIVE_ENTITY"] = "active_entity";
  LayerKind["UNKNOWN"] = "unknown";
})(LayerKind || (LayerKind = {}));

var StaticColorLayerSettings = function StaticColorLayerSettings(config) {
  _classCallCheck(this, StaticColorLayerSettings);

  this.kind = LayerKind.STATIC_COLOR;
  this.color = (config === null || config === void 0 ? void 0 : config.color) || [0, 0, 0];
};
var HeatmapLayerSettings = function HeatmapLayerSettings() {
  _classCallCheck(this, HeatmapLayerSettings);

  this.kind = LayerKind.HEAT_MAP;
};
var ColorMapLayerSettings = function ColorMapLayerSettings(config) {
  _classCallCheck(this, ColorMapLayerSettings);

  this.kind = LayerKind.COLOR_MAP;
  this.property = config === null || config === void 0 ? void 0 : config.property;
  this.colors = (config === null || config === void 0 ? void 0 : config.colors) || [];
  this.undefinedColor = (config === null || config === void 0 ? void 0 : config.undefinedColor) || [0, 0, 0];
  this.specialColor = (config === null || config === void 0 ? void 0 : config.specialColor) || [0, 0, 0];
  this.baseColorOverride = (config === null || config === void 0 ? void 0 : config.baseColorOverride) || null;
};
var ActiveEntityLayerSettings = function ActiveEntityLayerSettings(config) {
  _classCallCheck(this, ActiveEntityLayerSettings);

  this.kind = LayerKind.ACTIVE_ENTITY;
  this.color = (config === null || config === void 0 ? void 0 : config.color) || [0, 0, 0];
  this.inverted = (config === null || config === void 0 ? void 0 : config.inverted) || false;
  this.property = config === null || config === void 0 ? void 0 : config.property;
  this.onHover = config === null || config === void 0 ? void 0 : config.onHover;
};
var UnknownLayerSettings = function UnknownLayerSettings() {
  _classCallCheck(this, UnknownLayerSettings);

  this.kind = LayerKind.UNKNOWN;
};

var dataEngineBase = '/data-engine/v4';
var geocodeBase = '/geocoder/v1';
var uri = {
  activate: '/user/activate',
  activityLogs: '/activity_logs',
  autocomplete: '/autocomplete',
  analysisPlot: '/analysis/plot',
  control: '/control',
  data: '/data',
  datasets: '/datasets',
  dataset_types: '/dataset_types',
  entity_types: '/entity_types',
  feedback_form: '/feedback/submit',
  forgotpassword: '/user/forgot-password',
  generate: '/generate',
  generators: '/generators',
  initdata: '/init_data',
  invite: '/invite',
  login: '/user/login',
  logout: '/user/logout',
  logs: '/logs',
  map: '/map',
  modelTypes: '/model_types',
  organisations: '/organisations',
  projects: '/projects',
  profile: '/user/profile',
  property_types: '/property_types',
  resetpassword: '/user/reset-password',
  results: '/results',
  reverseSearch: '/reverse_search',
  roles: '/roles',
  runSimulation: '/run-simulation',
  scenarios: '/scenarios',
  schema: '/schema',
  scopes: '/scopes',
  search: '/search',
  simulations: '/simulations',
  state: '/state',
  summary: '/summary',
  timeline: '/timeline',
  updates: '/updates',
  users: '/users',
  validateAuth: '/auth',
  views: '/views',
  workloads: '/workloads'
};

var BaseRequest = /*#__PURE__*/function () {
  function BaseRequest() {
    _classCallCheck(this, BaseRequest);
  }

  _createClass(BaseRequest, [{
    key: "generateConfig",
    value: // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function generateConfig(client) {
      return this.makeRequest();
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      return resp.data;
    }
  }]);

  return BaseRequest;
}();
var Request = /*#__PURE__*/function (_BaseRequest) {
  _inherits(Request, _BaseRequest);

  var _super = _createSuper(Request);

  function Request() {
    _classCallCheck(this, Request);

    return _super.apply(this, arguments);
  }

  _createClass(Request, [{
    key: "generateConfig",
    value: function generateConfig(client) {
      var baseURL = client.baseURL,
          request = this.makeRequest();
      return _objectSpread2$1({
        baseURL: baseURL,
        headers: client.apiToken ? {
          Authorization: client.apiToken
        } : {}
      }, request);
    }
  }]);

  return Request;
}(BaseRequest);

var GetDatasets = /*#__PURE__*/function (_Request) {
  _inherits(GetDatasets, _Request);

  var _super = _createSuper(GetDatasets);

  function GetDatasets(projectUUID) {
    var _this;

    _classCallCheck(this, GetDatasets);

    _this = _super.call(this);
    _this.projectUUID = projectUUID;
    return _this;
  }

  _createClass(GetDatasets, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.projects, "/").concat(this.projectUUID).concat(uri.datasets)
      };
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      return resp.data.datasets.map(function (d) {
        return new Dataset(d);
      });
    }
  }]);

  return GetDatasets;
}(Request);
var GetDataset = /*#__PURE__*/function (_Request2) {
  _inherits(GetDataset, _Request2);

  var _super2 = _createSuper(GetDataset);

  function GetDataset(datasetUUID) {
    var _this2;

    _classCallCheck(this, GetDataset);

    _this2 = _super2.call(this);
    _this2.datasetUUID = datasetUUID;
    return _this2;
  }

  _createClass(GetDataset, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.datasets, "/").concat(this.datasetUUID)
      };
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      return new DatasetWithData(resp.data);
    }
  }]);

  return GetDataset;
}(Request);
var AddDataset = /*#__PURE__*/function (_Request3) {
  _inherits(AddDataset, _Request3);

  var _super3 = _createSuper(AddDataset);

  function AddDataset(projectUUID, dataset) {
    var _this3;

    _classCallCheck(this, AddDataset);

    _this3 = _super3.call(this);
    _this3.projectUUID = projectUUID;
    _this3.dataset = dataset;
    return _this3;
  }

  _createClass(AddDataset, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'post',
        url: "".concat(dataEngineBase).concat(uri.projects, "/").concat(this.projectUUID).concat(uri.datasets),
        data: this.dataset
      };
    }
  }]);

  return AddDataset;
}(Request);
var UpdateDataset = /*#__PURE__*/function (_Request4) {
  _inherits(UpdateDataset, _Request4);

  var _super4 = _createSuper(UpdateDataset);

  function UpdateDataset(datasetUUID, dataset) {
    var _this4;

    _classCallCheck(this, UpdateDataset);

    _this4 = _super4.call(this);
    _this4.datasetUUID = datasetUUID;
    _this4.dataset = dataset;
    return _this4;
  }

  _createClass(UpdateDataset, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'put',
        url: "".concat(dataEngineBase).concat(uri.datasets, "/").concat(this.datasetUUID),
        data: {
          name: this.dataset.name,
          type: this.dataset.type
        }
      };
    }
  }]);

  return UpdateDataset;
}(Request);
var DeleteDataset = /*#__PURE__*/function (_Request5) {
  _inherits(DeleteDataset, _Request5);

  var _super5 = _createSuper(DeleteDataset);

  function DeleteDataset(datasetUUID) {
    var _this5;

    _classCallCheck(this, DeleteDataset);

    _this5 = _super5.call(this);
    _this5.datasetUUID = datasetUUID;
    return _this5;
  }

  _createClass(DeleteDataset, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'delete',
        url: "".concat(dataEngineBase).concat(uri.datasets, "/").concat(this.datasetUUID)
      };
    }
  }]);

  return DeleteDataset;
}(Request); // eslint-disable-next-line @typescript-eslint/no-explicit-any

var GetDatasetData = /*#__PURE__*/function (_Request6) {
  _inherits(GetDatasetData, _Request6);

  var _super6 = _createSuper(GetDatasetData);

  function GetDatasetData(datasetUUID, entityGroup, properties) {
    var _this6;

    _classCallCheck(this, GetDatasetData);

    _this6 = _super6.call(this);
    _this6.datasetUUID = datasetUUID;
    _this6.entityGroup = entityGroup;
    _this6.properties = properties;
    return _this6;
  }

  _createClass(GetDatasetData, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.datasets, "/").concat(this.datasetUUID).concat(uri.data),
        params: getDatasetFilterParams$1(this.entityGroup, this.properties)
      };
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      return new DatasetWithData(resp.data);
    }
  }]);

  return GetDatasetData;
}(Request);
var GetDatasetDataAsBlob = /*#__PURE__*/function (_Request7) {
  _inherits(GetDatasetDataAsBlob, _Request7);

  var _super7 = _createSuper(GetDatasetDataAsBlob);

  function GetDatasetDataAsBlob(datasetUUID, entityGroup, properties) {
    var _this7;

    _classCallCheck(this, GetDatasetDataAsBlob);

    _this7 = _super7.call(this);
    _this7.datasetUUID = datasetUUID;
    _this7.entityGroup = entityGroup;
    _this7.properties = properties;
    return _this7;
  }

  _createClass(GetDatasetDataAsBlob, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.datasets, "/").concat(this.datasetUUID).concat(uri.data),
        params: getDatasetFilterParams$1(this.entityGroup, this.properties),
        responseType: 'blob'
      };
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      return {
        data: resp.data,
        contentType: resp.headers['content-type']
      };
    }
  }]);

  return GetDatasetDataAsBlob;
}(Request);
var AddDatasetData = /*#__PURE__*/function (_Request8) {
  _inherits(AddDatasetData, _Request8);

  var _super8 = _createSuper(AddDatasetData);

  function AddDatasetData(datasetUUID, file, onProgress) {
    var _this8;

    _classCallCheck(this, AddDatasetData);

    _this8 = _super8.call(this);
    _this8.datasetUUID = datasetUUID;
    _this8.file = file;
    _this8.onProgress = onProgress;
    return _this8;
  }

  _createClass(AddDatasetData, [{
    key: "makeRequest",
    value: function makeRequest() {
      var form = new FormData();
      form.append('data', this.file);
      return {
        method: 'post',
        url: "".concat(dataEngineBase).concat(uri.datasets, "/").concat(this.datasetUUID, "/data"),
        data: form,
        onUploadProgress: this.onProgress
      };
    }
  }]);

  return AddDatasetData;
}(Request);
var DeleteDatasetData = /*#__PURE__*/function (_Request9) {
  _inherits(DeleteDatasetData, _Request9);

  var _super9 = _createSuper(DeleteDatasetData);

  function DeleteDatasetData(datasetUUID) {
    var _this9;

    _classCallCheck(this, DeleteDatasetData);

    _this9 = _super9.call(this);
    _this9.datasetUUID = datasetUUID;
    return _this9;
  }

  _createClass(DeleteDatasetData, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'delete',
        url: "".concat(dataEngineBase).concat(uri.datasets, "/").concat(this.datasetUUID, "/data")
      };
    }
  }]);

  return DeleteDatasetData;
}(Request); // eslint-disable-next-line @typescript-eslint/no-explicit-any

var GetScenarioState = /*#__PURE__*/function (_Request10) {
  _inherits(GetScenarioState, _Request10);

  var _super10 = _createSuper(GetScenarioState);

  function GetScenarioState(datasetUUID, scenarioUUID, entityGroup, properties, timestamp) {
    var _this10;

    _classCallCheck(this, GetScenarioState);

    _this10 = _super10.call(this);
    _this10.datasetUUID = datasetUUID;
    _this10.scenarioUUID = scenarioUUID;
    _this10.entityGroup = entityGroup;
    _this10.properties = properties;
    _this10.timestamp = timestamp;
    return _this10;
  }

  _createClass(GetScenarioState, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.scenarios, "/").concat(this.scenarioUUID).concat(uri.state),
        params: this.getStateFilterParams()
      };
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      return new DatasetWithData(resp.data);
    }
  }, {
    key: "getStateFilterParams",
    value: function getStateFilterParams() {
      var params = getDatasetFilterParams$1(this.entityGroup, this.properties);
      params.dataset_uuid = this.datasetUUID;

      if (this.timestamp !== undefined) {
        params.timestamp = this.timestamp;
      }

      return params;
    }
  }]);

  return GetScenarioState;
}(Request);
function getDatasetFilterParams$1(entityGroup, properties) {
  if (!entityGroup) {
    return {};
  }

  if (!(properties === null || properties === void 0 ? void 0 : properties.length)) {
    return {
      entity_group: entityGroup
    };
  }

  var components = new Set();
  var props = new Set();
  properties.forEach(function (p) {
    if (p.component) {
      components.add(p.component);
    }

    props.add(p.name);
  });
  return {
    entity_group: entityGroup,
    properties: Array.from(props).join(','),
    components: components.size ? Array.from(components).join(',') : undefined
  };
}
var GetDatasetMapThumbnail = /*#__PURE__*/function (_Request11) {
  _inherits(GetDatasetMapThumbnail, _Request11);

  var _super11 = _createSuper(GetDatasetMapThumbnail);

  function GetDatasetMapThumbnail(datasetUUID) {
    var _this11;

    _classCallCheck(this, GetDatasetMapThumbnail);

    _this11 = _super11.call(this);
    _this11.datasetUUID = datasetUUID;
    return _this11;
  }

  _createClass(GetDatasetMapThumbnail, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.datasets, "/").concat(this.datasetUUID).concat(uri.map),
        params: {
          thumbnail: 'true'
        },
        responseType: 'arraybuffer'
      };
    }
  }]);

  return GetDatasetMapThumbnail;
}(Request);
var GetDatasetMap = /*#__PURE__*/function (_Request12) {
  _inherits(GetDatasetMap, _Request12);

  var _super12 = _createSuper(GetDatasetMap);

  function GetDatasetMap(datasetUUID) {
    var _this12;

    _classCallCheck(this, GetDatasetMap);

    _this12 = _super12.call(this);
    _this12.datasetUUID = datasetUUID;
    return _this12;
  }

  _createClass(GetDatasetMap, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.datasets, "/").concat(this.datasetUUID).concat(uri.map),
        params: {
          thumbnail: 'false'
        },
        responseType: 'arraybuffer'
      };
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      return {
        data: resp.data,
        contentType: resp.headers['content-type']
      };
    }
  }]);

  return GetDatasetMap;
}(Request);

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
var regexpFlags = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp$2 = global_1.RegExp;

var UNSUPPORTED_Y$2 = fails(function () {
  var re = $RegExp$2('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

var BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp$2('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

var regexpStickyHelpers = {
	UNSUPPORTED_Y: UNSUPPORTED_Y$2,
	BROKEN_CARET: BROKEN_CARET
};

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp$1 = global_1.RegExp;

var regexpUnsupportedDotAll = fails(function () {
  var re = $RegExp$1('.', 's');
  return !(re.dotAll && re.exec('\n') && re.flags === 's');
});

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp = global_1.RegExp;

var regexpUnsupportedNcg = fails(function () {
  var re = $RegExp('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});

/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */





var getInternalState = internalState.get;



var nativeExec = RegExp.prototype.exec;
var nativeReplace = shared('native-string-replace', String.prototype.replace);

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1 || regexpUnsupportedDotAll || regexpUnsupportedNcg;

if (PATCH) {
  // eslint-disable-next-line max-statements -- TODO
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState(re);
    var str = toString_1$1(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = patchedExec.call(raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y$1 && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = str.slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str.charAt(re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = objectCreate(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

var regexpExec = patchedExec;

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
  exec: regexpExec
});

// TODO: Remove from `core-js@4` since it's moved to entry points







var SPECIES$1 = wellKnownSymbol('species');
var RegExpPrototype = RegExp.prototype;

var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES$1] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var $exec = regexp.exec;
      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    });

    redefine(String.prototype, KEY, methods[0]);
    redefine(RegExpPrototype, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
};

// `SameValue` abstract operation
// https://tc39.es/ecma262/#sec-samevalue
// eslint-disable-next-line es/no-object-is -- safe
var sameValue = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare -- NaN check
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
var regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (isCallable(exec)) {
    var result = exec.call(R, S);
    if (result !== null) anObject(result);
    return result;
  }
  if (classofRaw(R) === 'RegExp') return regexpExec.call(R, S);
  throw TypeError('RegExp#exec called on incompatible receiver');
};

// @@search logic
fixRegexpWellKnownSymbolLogic('search', function (SEARCH, nativeSearch, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.es/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = requireObjectCoercible(this);
      var searcher = regexp == undefined ? undefined : getMethod(regexp, SEARCH);
      return searcher ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](toString_1$1(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
    function (string) {
      var rx = anObject(this);
      var S = toString_1$1(string);
      var res = maybeCallNative(nativeSearch, rx, S);

      if (res.done) return res.value;

      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regexpExecAbstract(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});

var GetGeocodeSuggestions = /*#__PURE__*/function (_Request) {
  _inherits(GetGeocodeSuggestions, _Request);

  var _super = _createSuper(GetGeocodeSuggestions);

  function GetGeocodeSuggestions(query) {
    var _this;

    _classCallCheck(this, GetGeocodeSuggestions);

    _this = _super.call(this);
    _this.query = query;
    return _this;
  }

  _createClass(GetGeocodeSuggestions, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'post',
        url: "".concat(geocodeBase).concat(uri.autocomplete),
        data: this.query
      };
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      return resp.data.results;
    }
  }]);

  return GetGeocodeSuggestions;
}(Request);
var GetGeocodeResults = /*#__PURE__*/function (_Request2) {
  _inherits(GetGeocodeResults, _Request2);

  var _super2 = _createSuper(GetGeocodeResults);

  function GetGeocodeResults(query) {
    var _this2;

    _classCallCheck(this, GetGeocodeResults);

    _this2 = _super2.call(this);
    _this2.query = query;
    return _this2;
  }

  _createClass(GetGeocodeResults, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'post',
        url: "".concat(geocodeBase).concat(uri.search),
        data: this.query
      };
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      return resp.data.results;
    }
  }]);

  return GetGeocodeResults;
}(Request);
var GetGeocodeResult = /*#__PURE__*/function (_Request3) {
  _inherits(GetGeocodeResult, _Request3);

  var _super3 = _createSuper(GetGeocodeResult);

  function GetGeocodeResult(resultUUID) {
    var _this3;

    _classCallCheck(this, GetGeocodeResult);

    _this3 = _super3.call(this);
    _this3.resultUUID = resultUUID;
    return _this3;
  }

  _createClass(GetGeocodeResult, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(geocodeBase).concat(uri.results, "/").concat(this.resultUUID)
      };
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      return resp.data;
    }
  }]);

  return GetGeocodeResult;
}(Request);
var GetGeocodeAddress = /*#__PURE__*/function (_Request4) {
  _inherits(GetGeocodeAddress, _Request4);

  var _super4 = _createSuper(GetGeocodeAddress);

  function GetGeocodeAddress(query) {
    var _this4;

    _classCallCheck(this, GetGeocodeAddress);

    _this4 = _super4.call(this);
    _this4.query = query;
    return _this4;
  }

  _createClass(GetGeocodeAddress, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'post',
        url: "".concat(geocodeBase).concat(uri.reverseSearch),
        data: this.query
      };
    }
  }]);

  return GetGeocodeAddress;
}(Request);

var GetProjects = /*#__PURE__*/function (_Request) {
  _inherits(GetProjects, _Request);

  var _super = _createSuper(GetProjects);

  function GetProjects() {
    _classCallCheck(this, GetProjects);

    return _super.call(this);
  }

  _createClass(GetProjects, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.projects)
      };
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      return resp.data.projects;
    }
  }]);

  return GetProjects;
}(Request);
var GetProject = /*#__PURE__*/function (_Request2) {
  _inherits(GetProject, _Request2);

  var _super2 = _createSuper(GetProject);

  function GetProject(projectUUID) {
    var _this;

    _classCallCheck(this, GetProject);

    _this = _super2.call(this);
    _this.projectUUID = projectUUID;
    return _this;
  }

  _createClass(GetProject, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.projects, "/").concat(this.projectUUID)
      };
    }
  }]);

  return GetProject;
}(Request);
var AddProject = /*#__PURE__*/function (_Request3) {
  _inherits(AddProject, _Request3);

  var _super3 = _createSuper(AddProject);

  function AddProject(payload) {
    var _this2;

    _classCallCheck(this, AddProject);

    _this2 = _super3.call(this);
    _this2.payload = payload;
    return _this2;
  }

  _createClass(AddProject, [{
    key: "makeRequest",
    value: function makeRequest() {
      delete this.payload.uuid;
      return {
        method: 'post',
        url: "".concat(dataEngineBase).concat(uri.projects),
        data: this.payload
      };
    }
  }]);

  return AddProject;
}(Request);
var UpdateProject = /*#__PURE__*/function (_Request4) {
  _inherits(UpdateProject, _Request4);

  var _super4 = _createSuper(UpdateProject);

  function UpdateProject(projectUUID, payload) {
    var _this3;

    _classCallCheck(this, UpdateProject);

    _this3 = _super4.call(this);
    _this3.payload = payload;
    _this3.projectUUID = projectUUID;
    return _this3;
  }

  _createClass(UpdateProject, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'put',
        url: "".concat(dataEngineBase).concat(uri.projects, "/").concat(this.projectUUID),
        data: {
          display_name: this.payload.display_name
        }
      };
    }
  }]);

  return UpdateProject;
}(Request);
var DeleteProject = /*#__PURE__*/function (_Request5) {
  _inherits(DeleteProject, _Request5);

  var _super5 = _createSuper(DeleteProject);

  function DeleteProject(projectUUID) {
    var _this4;

    _classCallCheck(this, DeleteProject);

    _this4 = _super5.call(this);
    _this4.projectUUID = projectUUID;
    return _this4;
  }

  _createClass(DeleteProject, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'delete',
        url: "".concat(dataEngineBase).concat(uri.projects, "/").concat(this.projectUUID)
      };
    }
  }]);

  return DeleteProject;
}(Request);

var GetScenarios = /*#__PURE__*/function (_Request) {
  _inherits(GetScenarios, _Request);

  var _super = _createSuper(GetScenarios);

  function GetScenarios(projectUUID) {
    var _this;

    _classCallCheck(this, GetScenarios);

    _this = _super.call(this);
    _this.projectUUID = projectUUID;
    return _this;
  }

  _createClass(GetScenarios, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.projects, "/").concat(this.projectUUID).concat(uri.scenarios)
      };
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      return resp.data.scenarios;
    }
  }]);

  return GetScenarios;
}(Request);
var GetScenario = /*#__PURE__*/function (_Request2) {
  _inherits(GetScenario, _Request2);

  var _super2 = _createSuper(GetScenario);

  function GetScenario(scenarioUUID) {
    var _this2;

    _classCallCheck(this, GetScenario);

    _this2 = _super2.call(this);
    _this2.scenarioUUID = scenarioUUID;
    return _this2;
  }

  _createClass(GetScenario, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.scenarios, "/").concat(this.scenarioUUID)
      };
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      var data = resp.data;
      data.has_simulation = data.has_simulation ? data.has_simulation : false;
      return data;
    }
  }]);

  return GetScenario;
}(Request);
var AddScenario = /*#__PURE__*/function (_Request3) {
  _inherits(AddScenario, _Request3);

  var _super3 = _createSuper(AddScenario);

  function AddScenario(projectUUID, payload) {
    var _this3;

    _classCallCheck(this, AddScenario);

    _this3 = _super3.call(this);
    _this3.payload = payload;
    _this3.projectUUID = projectUUID;
    return _this3;
  }

  _createClass(AddScenario, [{
    key: "makeRequest",
    value: function makeRequest() {
      delete this.payload.has_simulation;
      return {
        method: 'post',
        url: "".concat(dataEngineBase).concat(uri.projects, "/").concat(this.projectUUID).concat(uri.scenarios),
        data: this.payload
      };
    }
  }]);

  return AddScenario;
}(Request);
var UpdateScenario = /*#__PURE__*/function (_Request4) {
  _inherits(UpdateScenario, _Request4);

  var _super4 = _createSuper(UpdateScenario);

  function UpdateScenario(scenarioUUID, payload) {
    var _this4;

    _classCallCheck(this, UpdateScenario);

    _this4 = _super4.call(this);
    _this4.payload = payload;
    _this4.scenarioUUID = scenarioUUID;
    return _this4;
  }

  _createClass(UpdateScenario, [{
    key: "makeRequest",
    value: function makeRequest() {
      delete this.payload.has_simulation;
      return {
        method: 'put',
        url: "".concat(dataEngineBase).concat(uri.scenarios, "/").concat(this.scenarioUUID),
        data: this.payload
      };
    }
  }]);

  return UpdateScenario;
}(Request);
var DeleteScenario = /*#__PURE__*/function (_Request5) {
  _inherits(DeleteScenario, _Request5);

  var _super5 = _createSuper(DeleteScenario);

  function DeleteScenario(scenarioUUID) {
    var _this5;

    _classCallCheck(this, DeleteScenario);

    _this5 = _super5.call(this);
    _this5.scenarioUUID = scenarioUUID;
    return _this5;
  }

  _createClass(DeleteScenario, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'delete',
        url: "".concat(dataEngineBase).concat(uri.scenarios, "/").concat(this.scenarioUUID)
      };
    }
  }]);

  return DeleteScenario;
}(Request);
var GetTimelineInfo = /*#__PURE__*/function (_Request6) {
  _inherits(GetTimelineInfo, _Request6);

  var _super6 = _createSuper(GetTimelineInfo);

  function GetTimelineInfo(scenarioUUID) {
    var _this6;

    _classCallCheck(this, GetTimelineInfo);

    _this6 = _super6.call(this);
    _this6.scenarioUUID = scenarioUUID;
    return _this6;
  }

  _createClass(GetTimelineInfo, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.scenarios, "/").concat(this.scenarioUUID).concat(uri.timeline)
      };
    }
  }]);

  return GetTimelineInfo;
}(Request);
var DeleteTimeline = /*#__PURE__*/function (_Request7) {
  _inherits(DeleteTimeline, _Request7);

  var _super7 = _createSuper(DeleteTimeline);

  function DeleteTimeline(scenarioUUID) {
    var _this7;

    _classCallCheck(this, DeleteTimeline);

    _this7 = _super7.call(this);
    _this7.scenarioUUID = scenarioUUID;
    return _this7;
  }

  _createClass(DeleteTimeline, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'delete',
        url: "".concat(dataEngineBase).concat(uri.scenarios, "/").concat(this.scenarioUUID).concat(uri.timeline)
      };
    }
  }]);

  return DeleteTimeline;
}(Request);

var GetDatasetSummary = /*#__PURE__*/function (_Request) {
  _inherits(GetDatasetSummary, _Request);

  var _super = _createSuper(GetDatasetSummary);

  function GetDatasetSummary(datasetUUID) {
    var _this;

    _classCallCheck(this, GetDatasetSummary);

    _this = _super.call(this);
    _this.datasetUUID = datasetUUID;
    return _this;
  }

  _createClass(GetDatasetSummary, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.datasets, "/").concat(this.datasetUUID).concat(uri.summary)
      };
    }
  }]);

  return GetDatasetSummary;
}(Request);
var GetScenarioSummary = /*#__PURE__*/function (_Request2) {
  _inherits(GetScenarioSummary, _Request2);

  var _super2 = _createSuper(GetScenarioSummary);

  function GetScenarioSummary(scenarioUUID, datasetUUID) {
    var _this2;

    _classCallCheck(this, GetScenarioSummary);

    _this2 = _super2.call(this);
    _this2.scenarioUUID = scenarioUUID;
    _this2.datasetUUID = datasetUUID;
    return _this2;
  }

  _createClass(GetScenarioSummary, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.scenarios, "/").concat(this.scenarioUUID).concat(uri.summary),
        params: {
          dataset_uuid: this.datasetUUID
        }
      };
    }
  }]);

  return GetScenarioSummary;
}(Request);
var GetUpdateSummary = /*#__PURE__*/function (_Request3) {
  _inherits(GetUpdateSummary, _Request3);

  var _super3 = _createSuper(GetUpdateSummary);

  function GetUpdateSummary(updateUUID) {
    var _this3;

    _classCallCheck(this, GetUpdateSummary);

    _this3 = _super3.call(this);
    _this3.updateUUID = updateUUID;
    return _this3;
  }

  _createClass(GetUpdateSummary, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.updates, "/").concat(this.updateUUID).concat(uri.summary)
      };
    }
  }]);

  return GetUpdateSummary;
}(Request);

function getDatasetFilterParams(entityGroup, properties) {
  if (!entityGroup) {
    return {};
  }

  if (!(properties === null || properties === void 0 ? void 0 : properties.length)) {
    return {
      entity_group: entityGroup
    };
  }

  var components = new Set();
  var props = new Set();
  properties.forEach(function (p) {
    if (p.component) {
      components.add(p.component);
    }

    props.add(p.name);
  });
  return {
    entity_group: entityGroup,
    properties: Array.from(props).join(','),
    components: components.size ? Array.from(components).join(',') : undefined
  };
}

var GetUpdates = /*#__PURE__*/function (_Request) {
  _inherits(GetUpdates, _Request);

  var _super = _createSuper(GetUpdates);

  function GetUpdates(scenarioUUID, filter) {
    var _this;

    _classCallCheck(this, GetUpdates);

    _this = _super.call(this);
    _this.scenarioUUID = scenarioUUID;
    _this.timelineFilter = filter !== null && filter !== void 0 ? filter : {};
    return _this;
  }

  _createClass(GetUpdates, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.scenarios, "/").concat(this.scenarioUUID).concat(uri.updates),
        params: this.timelineFilter
      };
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      return resp.data.updates;
    }
  }]);

  return GetUpdates;
}(Request$1);
var GetUpdateWithData = /*#__PURE__*/function (_Request2) {
  _inherits(GetUpdateWithData, _Request2);

  var _super2 = _createSuper(GetUpdateWithData);

  function GetUpdateWithData(updateUUID, entityGroup, properties) {
    var _this2;

    _classCallCheck(this, GetUpdateWithData);

    _this2 = _super2.call(this);
    _this2.updateUUID = updateUUID;
    _this2.entityGroup = entityGroup;
    _this2.properties = properties;
    return _this2;
  }

  _createClass(GetUpdateWithData, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.updates, "/").concat(this.updateUUID),
        params: getDatasetFilterParams(this.entityGroup, this.properties)
      };
    }
  }]);

  return GetUpdateWithData;
}(Request$1);
var GetUpdateAsBlob = /*#__PURE__*/function (_Request3) {
  _inherits(GetUpdateAsBlob, _Request3);

  var _super3 = _createSuper(GetUpdateAsBlob);

  function GetUpdateAsBlob(updateUUID, entityGroup, properties) {
    var _this3;

    _classCallCheck(this, GetUpdateAsBlob);

    _this3 = _super3.call(this);
    _this3.updateUUID = updateUUID;
    _this3.entityGroup = entityGroup;
    _this3.properties = properties;
    return _this3;
  }

  _createClass(GetUpdateAsBlob, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.updates, "/").concat(this.updateUUID),
        params: getDatasetFilterParams(this.entityGroup, this.properties),
        responseType: 'blob'
      };
    }
  }]);

  return GetUpdateAsBlob;
}(Request$1);

var GetViews = /*#__PURE__*/function (_Request) {
  _inherits(GetViews, _Request);

  var _super = _createSuper(GetViews);

  function GetViews(scenarioUUID) {
    var _this;

    _classCallCheck(this, GetViews);

    _this = _super.call(this);
    _this.scenarioUUID = scenarioUUID;
    return _this;
  }

  _createClass(GetViews, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.scenarios, "/").concat(this.scenarioUUID).concat(uri.views)
      };
    }
  }, {
    key: "makeResponse",
    value: function makeResponse(resp) {
      return resp.data.views;
    }
  }]);

  return GetViews;
}(Request);
var GetView = /*#__PURE__*/function (_Request2) {
  _inherits(GetView, _Request2);

  var _super2 = _createSuper(GetView);

  function GetView(viewUUID) {
    var _this2;

    _classCallCheck(this, GetView);

    _this2 = _super2.call(this);
    _this2.viewUUID = viewUUID;
    return _this2;
  }

  _createClass(GetView, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'get',
        url: "".concat(dataEngineBase).concat(uri.views, "/").concat(this.viewUUID)
      };
    }
  }]);

  return GetView;
}(Request);
var AddView = /*#__PURE__*/function (_Request3) {
  _inherits(AddView, _Request3);

  var _super3 = _createSuper(AddView);

  function AddView(scenarioUUID, payload) {
    var _this3;

    _classCallCheck(this, AddView);

    _this3 = _super3.call(this);
    _this3.payload = payload;
    _this3.scenarioUUID = scenarioUUID;
    return _this3;
  }

  _createClass(AddView, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'post',
        url: "".concat(dataEngineBase).concat(uri.scenarios, "/").concat(this.scenarioUUID).concat(uri.views),
        data: this.payload
      };
    }
  }]);

  return AddView;
}(Request);
var UpdateView = /*#__PURE__*/function (_Request4) {
  _inherits(UpdateView, _Request4);

  var _super4 = _createSuper(UpdateView);

  function UpdateView(viewUUID, payload) {
    var _this4;

    _classCallCheck(this, UpdateView);

    _this4 = _super4.call(this);
    _this4.payload = payload;
    _this4.viewUUID = viewUUID;
    return _this4;
  }

  _createClass(UpdateView, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'put',
        url: "".concat(dataEngineBase).concat(uri.views, "/").concat(this.viewUUID),
        data: this.payload
      };
    }
  }]);

  return UpdateView;
}(Request);
var DeleteView = /*#__PURE__*/function (_Request5) {
  _inherits(DeleteView, _Request5);

  var _super5 = _createSuper(DeleteView);

  function DeleteView(viewUUID) {
    var _this5;

    _classCallCheck(this, DeleteView);

    _this5 = _super5.call(this);
    _this5.viewUUID = viewUUID;
    return _this5;
  }

  _createClass(DeleteView, [{
    key: "makeRequest",
    value: function makeRequest() {
      return {
        method: 'delete',
        url: "".concat(dataEngineBase).concat(uri.views, "/").concat(this.viewUUID)
      };
    }
  }]);

  return DeleteView;
}(Request);

var FlowMain = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{staticClass:"flow columns is-gapless is-margin-less"},[_c('b-menu',{staticClass:"column flow-menu",attrs:{"activable":false}},[_c('b-menu-list',{attrs:{"aria-role":"menu"}},[_c('b-menu-item',{staticClass:"home",scopedSlots:_vm._u([{key:"label",fn:function(){return [_c('b-image',{attrs:{"src":"/static/movici-logo.svg","title":_vm.$t('flow.leftMenu.returnToDashboard')}})]},proxy:true}])}),_vm._v(" "),_vm._l((_vm.sectionMenu),function(section){return _c('b-menu-item',{key:section.name,attrs:{"aria-role":"menuitem","label":_vm.$t(section.label),"icon-pack":section.iconPack,"icon":section.icon,"disabled":!section.enabled,"active":_vm.isActive(section.to),"size":"is-medium","tag":"a"},on:{"click":function($event){return _vm.click(section)}}})}),_vm._v(" "),(_vm.hasUserCapabilities)?_c('b-menu-item',{staticClass:"bottom",scopedSlots:_vm._u([{key:"label",fn:function(){return [_c('span',{staticClass:"is-small icon user-initials"},[_vm._v("\n            "+_vm._s(_vm.userInitials)+"\n          ")])]},proxy:true}],null,false,465899525)}):_vm._e()],2)],1),_vm._v(" "),_c('b-tooltip',{staticClass:"collapse-button",attrs:{"type":"is-black","position":"is-right","label":(_vm.collapse ? _vm.$t('flow.leftMenu.expand') : _vm.$t('flow.leftMenu.collapse')) + ' menu'}},[(!_vm.disableCollapser)?_c('b-button',{attrs:{"size":"is-small","icon-left":_vm.collapse ? 'angle-right' : 'angle-left'},on:{"click":function($event){return _vm.toggleCollapse()}}}):_vm._e()],1),_vm._v(" "),_c('main',{staticClass:"column"},[_c('router-view')],1)],1)},
staticRenderFns: [],
stub: 1
};

var FlowProjects = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('FlowContainer',{staticClass:"flow-projects",scopedSlots:_vm._u([{key:"leftPanel",fn:function(){return [_c('ProjectInfoBox',{staticClass:"mb-2",attrs:{"edit":""},on:{"setProject":_vm.setProject}}),_vm._v(" "),(_vm.currentProject)?_c('div',{staticClass:"project-info"},[(_vm.details)?_c('div',{staticClass:"details is-size-7 mb-3"},_vm._l((_vm.details),function(prop,key){return _c('div',{key:key,staticClass:"mb-1"},[_c('label',[_vm._v(_vm._s(_vm.$t('flow.projects.details.' + key))+": ")]),_vm._v(" "),_c('span',{staticClass:"value"},[_vm._v(_vm._s(prop))])])}),0):_vm._e(),_vm._v(" "),(_vm.countDetails)?_c('div',{staticClass:"count-details is-size-7 mb-3"},[_c('div',{staticClass:"mb-1"},[_c('label',[_vm._v(_vm._s(_vm.$t('flow.projects.details.dataset_count'))+": ")]),_vm._v(" "),_c('router-link',{staticClass:"value",attrs:{"custom":"","to":_vm.toDatasets},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var navigate = ref.navigate;
return [_c('a',{attrs:{"role":"link"},on:{"click":navigate,"keypress":function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return navigate($event)}}},[_vm._v("\n              "+_vm._s(_vm.countDetails.dataset_count)+"\n            ")])]}}],null,false,912513050)})],1),_vm._v(" "),_c('div',{staticClass:"mb-1"},[_c('label',[_vm._v(_vm._s(_vm.$t('flow.projects.details.scenario_count'))+": ")]),_vm._v(" "),_c('router-link',{staticClass:"value",attrs:{"custom":"","to":_vm.toScenario},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var navigate = ref.navigate;
return [_c('a',{attrs:{"role":"link"},on:{"click":navigate,"keypress":function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return navigate($event)}}},[_vm._v("\n              "+_vm._s(_vm.countDetails.scenario_count)+"\n            ")])]}}],null,false,1536954086)})],1)]):_vm._e(),_vm._v(" "),(_vm.currentProject.description)?_c('div',{staticClass:"description is-size-6 mt-5"},[_vm._v("\n        "+_vm._s(_vm.currentProject.description)+"\n      ")]):_vm._e()]):_vm._e()]},proxy:true},{key:"mainView",fn:function(){return [(!_vm.currentProject)?[_c('div',{staticClass:"no-resource"},[_c('b-image',{attrs:{"src":"/static/no-project.png"}}),_vm._v(" "),_c('div',{staticClass:"has-text-centered mt-3"},[_c('h1',{staticClass:"is-size-4 has-text-weight-bold"},[_vm._v(_vm._s(_vm.$t('flow.mainView.noProjectTitle')))]),_vm._v(" "),_c('h2',{staticClass:"is-size-6"},[_vm._v(_vm._s(_vm.$t('flow.mainView.noProjectText')))])])],1)]:[_c('MapVis',{attrs:{"layer-infos":_vm.validLayers,"view-state":_vm.viewState},on:{"update:viewState":function($event){_vm.viewState=$event;},"update:view-state":function($event){_vm.viewState=$event;}},scopedSlots:_vm._u([{key:"control-left",fn:function(ref){
var map = ref.map;
var onViewstateChange = ref.onViewstateChange;
var basemap = ref.basemap;
var setBasemap = ref.setBasemap;
return [(_vm.hasGeocodeCapabilities)?_c('SearchBar',{attrs:{"map":map,"view-state":_vm.viewState},on:{"update:view-state":function($event){return onViewstateChange($event)}}}):_vm._e(),_vm._v(" "),_c('NavigationControl',{attrs:{"value":_vm.viewState},on:{"input":function($event){return onViewstateChange($event)}}}),_vm._v(" "),_c('BaseMapControl',{attrs:{"value":basemap},on:{"input":setBasemap}})]}}])})]]},proxy:true}])})},
staticRenderFns: [],
stub: 1
};

var FlowDatasets = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('FlowContainer',{staticClass:"flow-datasets",scopedSlots:_vm._u([{key:"leftPanel",fn:function(){return [_c('ProjectInfoBox',{staticClass:"mb-2"}),_vm._v(" "),_c('span',{staticClass:"is-size-7"},[_vm._v("\n      "+_vm._s(_vm.$t('flow.datasets.label'))+"\n      "),_c('span',{staticClass:"count"},[_vm._v("("+_vm._s(_vm.filteredDatasets.length)+" "+_vm._s(_vm.$t('misc.of'))+" "+_vm._s(_vm.datasets.length)+")")])]),_vm._v(" "),_c('b-field',[_c('b-input',{attrs:{"placeholder":_vm.$t('flow.datasets.searchPlaceholder'),"type":"search","icon-pack":"far","icon":"search","size":"is-small"},model:{value:(_vm.search),callback:function ($$v) {_vm.search=$$v;},expression:"search"}})],1),_vm._v(" "),(_vm.filteredDatasets.length)?_c('b-field',{staticClass:"dataset-selector overflow-hover is-flex-grow-1 is-flex-shrink-2"},[_c('ul',{staticClass:"flow-list is-size-7"},_vm._l((_vm.filteredDatasets),function(dataset){return _c('li',{key:dataset.uuid,class:{ active: dataset.uuid === _vm.currentDatasetUUID },attrs:{"title":dataset.display_name},on:{"click":function($event){return _vm.setDataset(dataset)}}},[_vm._v("\n          "+_vm._s(_vm._f("upperFirst")(_vm._f("snakeToSpaces")(dataset.display_name)))+"\n        ")])}),0)]):_vm._e(),_vm._v(" "),_c('b-button',{staticClass:"is-primary is-align-self-baseline flex-grow-0 flex-shrink-1",attrs:{"size":"is-small","icon-left":"plus-circle","disabled":""}},[_vm._v("\n      "+_vm._s(_vm.$t('flow.datasets.addDataset'))+"\n    ")])]},proxy:true},{key:"mainView",fn:function(){return [(!_vm.currentDataset)?[_c('header',[_c('div',{staticClass:"title-section"},[_c('h1',{staticClass:"is-size-4 has-text-weight-bold"},[_vm._v(_vm._s(_vm.$t('flow.datasets.label')))]),_vm._v(" "),_c('h2',{staticClass:"is-size-6"},[_vm._v(_vm._s(_vm.$t('flow.mainView.noDatasetText')))])])]),_vm._v(" "),_c('div',{staticClass:"no-resource"},[_c('b-image',{attrs:{"src":"/static/no-resources.png"}})],1)]:[_c('header',[_c('div',{staticClass:"title-section is-flex is-align-items-baseline"},[_c('h1',{staticClass:"is-size-4 mr-4 has-text-weight-bold",attrs:{"title":_vm.currentDataset.display_name}},[_vm._v("\n            "+_vm._s(_vm._f("upperFirst")(_vm._f("snakeToSpaces")(_vm.currentDataset.display_name)))+"\n          ")]),_vm._v(" "),_c('h2',{staticClass:"is-flex-grow-1 is-size-6 has-text-weight-bold",attrs:{"title":_vm.currentDataset.type}},[_vm._v("\n            "+_vm._s(_vm.$t('resources.dataset_type'))+":\n            "+_vm._s(_vm._f("upperFirst")(_vm._f("snakeToSpaces")(_vm.currentDataset.type)))+"\n          ")])])]),_vm._v(" "),_c('b-tabs',{staticClass:"flow-tabs uppercase mt-2"},[_c('b-tab-item',{attrs:{"value":"dataPreview","icon":"map","icon-pack":"far","label":_vm.$t('flow.datasets.dataPreview')}},[_c('MapVis',{attrs:{"layer-infos":_vm.layers,"view-state":_vm.viewState},on:{"update:viewState":function($event){_vm.viewState=$event;},"update:view-state":function($event){_vm.viewState=$event;}},scopedSlots:_vm._u([{key:"control-left",fn:function(ref){
var map = ref.map;
var onViewstateChange = ref.onViewstateChange;
return [(_vm.hasGeocodeCapabilities)?_c('SearchBar',{attrs:{"map":map,"view-state":_vm.viewState},on:{"update:view-state":function($event){return onViewstateChange($event)}}}):_vm._e(),_vm._v(" "),_c('NavigationControl',{attrs:{"value":_vm.viewState},on:{"input":function($event){return onViewstateChange($event)}}}),_vm._v(" "),_c('BaseMapControl',{attrs:{"value":_vm.basemap},on:{"input":_vm.setBasemap}})]}},{key:"control-right",fn:function(ref){
var popupContent = ref.popupContent;
var closePopup = ref.closePopup;
var viewState = ref.viewState;
return [_c('EntitySelector',{attrs:{"datasetsArray":_vm.datasets,"currentDataset":_vm.currentDataset},on:{"setLayerInfos":_vm.setLayerInfos}}),_vm._v(" "),(popupContent)?_c('StaticDataView',{attrs:{"value":popupContent,"map":_vm.map,"view-state":viewState}},[_c('DataViewContent',{attrs:{"value":popupContent,"timestamp":0},on:{"close":closePopup}})],1):_vm._e()]}}])})],1),_vm._v(" "),_c('b-tab-item',{attrs:{"disabled":"","value":"usage","icon":"fa-scenario","icon-pack":"fak","label":_vm.$t('flow.datasets.usage')}}),_vm._v(" "),_c('b-tab-item',{attrs:{"disabled":"","value":"resume","icon-pack":"far","icon":"code","label":_vm.$t('flow.datasets.resume')}}),_vm._v(" "),_c('b-tab-item',{attrs:{"value":"info","icon":"info-circle","icon-pack":"fas","label":"Info"}},[_c('div',{staticClass:"info details is-size-7 mt-2"},_vm._l((_vm.details),function(prop,key){return _c('span',{key:key,staticClass:"is-block"},[_c('label',[_vm._v(_vm._s(_vm.$t('flow.datasets.details.' + key))+": ")]),_vm._v(" "),_c('span',{staticClass:"value"},[_vm._v(_vm._s(prop))])])}),0),_vm._v(" "),(_vm.currentDataset.description)?_c('div',{staticClass:"description is-size-6-half mt-4"},[_vm._v("\n            "+_vm._s(_vm.currentDataset.description)+"\n          ")]):_vm._e()])],1)]]},proxy:true}])})},
staticRenderFns: [],
stub: 1
};

var FlowScenario = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('FlowContainer',{staticClass:"flow-scenarios",scopedSlots:_vm._u([{key:"leftPanel",fn:function(){return [_c('ProjectInfoBox',{staticClass:"mb-2"}),_vm._v(" "),_c('ScenarioInfoBox',{staticClass:"mb-2",attrs:{"edit":""},on:{"setScenarioUUID":_vm.setScenarioUUID}}),_vm._v(" "),(_vm.currentScenario)?[_c('span',{staticClass:"is-size-7 mb-4 mt-1"},[_vm._v(" "+_vm._s(_vm.$t('flow.scenarios.usedInScenario'))+": ")]),_vm._v(" "),_c('span',{staticClass:"is-size-7"},[_c('strong',{staticClass:"has-text-black"},[_vm._v(_vm._s(_vm.$t('flow.scenarios.models')))]),_vm._v(" "),_c('span',{staticClass:"count"},[_vm._v("("+_vm._s(_vm.currentScenario.models.length)+")")])]),_vm._v(" "),_c('b-field',{staticClass:"scenario-model-type-list overflow-hover is-flex-grow-0 is-flex-shrink-2"},[_c('ul',{staticClass:"flow-list is-size-7"},_vm._l((_vm.currentScenario.models),function(model,key){return _c('li',{key:key,attrs:{"title":model.name}},[_vm._v("\n            "+_vm._s(_vm._f("upperFirst")(_vm._f("snakeToSpaces")(model.name)))+"\n          ")])}),0)]),_vm._v(" "),_c('span',{staticClass:"is-size-7"},[_c('strong',{staticClass:"has-text-black"},[_vm._v(_vm._s(_vm.$t('flow.datasets.label')))]),_vm._v(" "),_c('span',{staticClass:"count"},[_vm._v("("+_vm._s(_vm.currentScenario.datasets.length)+")")])]),_vm._v(" "),_c('b-field',{staticClass:"scenario-dataset-list overflow-hover is-flex-grow-0 is-flex-shrink-2"},[_c('ul',{staticClass:"flow-list is-size-7"},_vm._l((_vm.currentScenario.datasets),function(dataset,key){return _c('li',{key:key,attrs:{"title":dataset.name}},[_vm._v("\n            "+_vm._s(_vm._f("upperFirst")(_vm._f("snakeToSpaces")(dataset.name)))+"\n          ")])}),0)]),_vm._v(" "),_c('div',{staticClass:"clear flex-grow-0 flex-shrink-1"})]:_vm._e()]},proxy:true},{key:"mainView",fn:function(){return [(!_vm.currentScenario)?[_c('header',[_c('h1',{staticClass:"is-size-4 has-text-weight-bold"},[_vm._v(_vm._s(_vm.$t('flow.scenarios.label')))]),_vm._v(" "),_c('h2',{staticClass:"is-size-6"},[_vm._v(_vm._s(_vm.$t('flow.mainView.noScenarioText')))])]),_vm._v(" "),_c('div',{staticClass:"no-resource"},[_c('b-image',{attrs:{"src":"/static/no-resources.png"}})],1)]:[_c('header',[_c('div',{staticClass:"title-section is-flex"},[_c('h1',{staticClass:"is-size-4 is-flex-grow-1 has-text-weight-bold",attrs:{"title":_vm.currentScenario.display_name}},[_vm._v("\n            "+_vm._s(_vm.currentScenario.display_name)+"\n          ")]),_vm._v(" "),_c('b-button',{staticClass:"is-warning mr-2",attrs:{"icon-pack":"far","size":"is-small","icon-left":"undo"}},[_vm._v("Reset")]),_vm._v(" "),_c('b-button',{staticClass:"is-primary",attrs:{"icon-pack":"far","size":"is-small","icon-left":"redo","disabled":_vm.isDisabled}},[_vm._v("\n            Run scenario\n          ")])],1),_vm._v(" "),_c('div',{staticClass:"status"},[_c('span',{staticClass:"is-size-7 mr-2"},[_vm._v("Status:")]),_vm._v(" "),_c('span',{staticClass:"tag",class:_vm.statusClass(_vm.currentScenario.status)},[_vm._v("\n            "+_vm._s(_vm.currentScenario.status)+"\n          ")])])]),_vm._v(" "),_c('b-tabs',{staticClass:"flow-tabs uppercase mt-2",attrs:{"value":"rawConfig"}},[_c('b-tab-item',{attrs:{"disabled":"","value":"widgetDashboard","icon":"sliders-h","icon-pack":"far","label":_vm.$t('flow.scenarios.widgetDashboard')}}),_vm._v(" "),_c('b-tab-item',{attrs:{"disabled":"","value":"configAssistant","icon":"th-list","icon-pack":"far","label":_vm.$t('flow.scenarios.configAssistant')}}),_vm._v(" "),_c('b-tab-item',{attrs:{"value":"rawConfig","icon-pack":"far","icon":"code","label":_vm.$t('flow.scenarios.rawConfig')}},[_c('b-input',{attrs:{"type":"textarea","readonly":""},model:{value:(_vm.formattedRawData),callback:function ($$v) {_vm.formattedRawData=$$v;},expression:"formattedRawData"}})],1)],1)]]},proxy:true}])})},
staticRenderFns: [],
stub: 1
};

var FlowVisualization = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('FlowContainer',{staticClass:"flow-visualization",scopedSlots:_vm._u([{key:"leftPanel",fn:function(){return [_c('ProjectInfoBox',{staticClass:"mb-2"}),_vm._v(" "),_c('ScenarioInfoBox',{staticClass:"mb-2"}),_vm._v(" "),_c('ViewInfoBox',{staticClass:"mb-3",attrs:{"name":_vm.viewName},on:{"update:name":function($event){_vm.viewName=$event;},"load-view":_vm.loadView,"delete-view":_vm.confirmDeleteView,"save-view":_vm.confirmSaveView,"save-view-as-new":_vm.saveViewAsNew,"reset-view":_vm.confirmResetViewWithName}}),_vm._v(" "),_c('b-tabs',{ref:"tabs",staticClass:"flow-tabs uppercase field is-flex-grow-0 is-flex-shrink-2",style:(_vm.tabHeight)},[_c('b-tab-item',{attrs:{"label":_vm.$t('flow.visualization.tabs.visualizers')}},[_c('FlowLayerPicker',{attrs:{"scenario":_vm.currentScenario,"timestamp":_vm.timestamp},model:{value:(_vm.visualizers),callback:function ($$v) {_vm.visualizers=$$v;},expression:"visualizers"}})],1),_vm._v(" "),_c('b-tab-item',{attrs:{"disabled":"","label":_vm.$t('flow.visualization.tabs.kpi')}})],1)]},proxy:true},{key:"mainView",fn:function(){return [_c('MapVis',{attrs:{"layer-infos":_vm.visualizers,"view-state":_vm.viewState,"timestamp":_vm.timestamp,"buildings":""},on:{"update:viewState":function($event){_vm.viewState=$event;},"update:view-state":function($event){_vm.viewState=$event;},"update:timestamp":function($event){_vm.timestamp=$event;}},scopedSlots:_vm._u([{key:"control-zero",fn:function(ref){
var map = ref.map;
var dynamicPopup = ref.dynamicPopup;
var popupContent = ref.popupContent;
var closePopup = ref.closePopup;
return [(popupContent && dynamicPopup)?_c('DynamicDataView',{attrs:{"value":popupContent,"map":map,"view-state":_vm.viewState,"borderPadding":_vm.popupBorderPadding}},[_c('DataViewContent',{attrs:{"value":popupContent,"timestamp":_vm.timestamp},on:{"close":closePopup}})],1):_vm._e()]}},{key:"control-left",fn:function(ref){
var map = ref.map;
var onViewstateChange = ref.onViewstateChange;
var basemap = ref.basemap;
var setBasemap = ref.setBasemap;
return [(_vm.hasGeocodeCapabilities)?_c('SearchBar',{attrs:{"map":map,"view-state":_vm.viewState},on:{"update:view-state":function($event){return onViewstateChange($event)}}}):_vm._e(),_vm._v(" "),_c('NavigationControl',{attrs:{"value":_vm.viewState},on:{"input":function($event){return onViewstateChange($event)}}}),_vm._v(" "),_c('BaseMapControl',{attrs:{"value":basemap},on:{"input":setBasemap}})]}},{key:"control-right",fn:function(ref){
var popupContent = ref.popupContent;
var dynamicPopup = ref.dynamicPopup;
var closePopup = ref.closePopup;
return [(_vm.visualizers.length)?_c('FlowLegend',{attrs:{"value":_vm.visualizers}}):_vm._e(),_vm._v(" "),(popupContent && !dynamicPopup)?_c('StaticDataView',[_c('DataViewContent',{attrs:{"value":popupContent,"timestamp":_vm.timestamp},on:{"close":closePopup}})],1):_vm._e()]}},{key:"control-bottom",fn:function(ref){
var updateTimestamp = ref.updateTimestamp;
return [_c('TimeSlider',{attrs:{"value":_vm.timestamp,"timeline-info":_vm.timelineInfo},on:{"input":function($event){return updateTimestamp($event)}}})]}}])})]},proxy:true}])})},
staticRenderFns: [],
stub: 1
};

var FlowExport = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"has-background-white p-4"},[_c('div',{staticClass:"is-flex is-flex is-align-items-center mb-3"},[_c('h1',{staticClass:"is-size-6 has-text-black text-ellipsis"},[_vm._v("\n      "+_vm._s(_vm.$t('flow.export.modalTitle'))+" "+_vm._s(_vm.currentScenario.display_name)+"\n    ")])]),_vm._v(" "),_c('div',{staticClass:"columns mt-2"},[_c('div',{staticClass:"column is-one-third"},[_c('label',{staticClass:"label is-size-7"},[_vm._v(_vm._s(_vm.$t('flow.export.filterData')))]),_vm._v(" "),_c('ExportLayerPicker',{attrs:{"layers":_vm.visualizers},on:{"selectLayer":function($event){_vm.selectedCVI = $event;}}})],1),_vm._v(" "),_c('div',{staticClass:"column"},[(_vm.currentScenario)?_c('div',[_c('ExportForm',{attrs:{"value":_vm.selectedCVI,"validator":_vm.validator,"scenario-uuid":_vm.currentScenario.uuid,"timestamp":_vm.timestamp,"timeline-info":_vm.timelineInfo},on:{"exportConfig":function($event){_vm.exportConfig = $event;}}})],1):_vm._e()])]),_vm._v(" "),_c('div',{staticClass:"bottom is-pulled-right"},[_c('b-button',{staticClass:"mr-2 has-text-weight-bold",attrs:{"size":"is-small","icon-pack":"far"},on:{"click":function($event){return _vm.$emit('close')}}},[_vm._v("\n      "+_vm._s(_vm.$t('actions.cancel'))+"\n    ")]),_vm._v(" "),_c('b-button',{staticClass:"is-primary has-text-weight-bold",attrs:{"size":"is-small","icon-pack":"far"},on:{"click":_vm.exportData}},[_vm._v("\n      "+_vm._s(_vm.$t('flow.export.label'))+"\n    ")])],1),_vm._v(" "),_c('div',{staticClass:"is-clearfix"})])},
staticRenderFns: [],
stub: 1
};

function getFlowRoutes(baseURL) {
  return [{
    path: baseURL,
    name: 'FlowMain',
    redirect: {
      name: 'FlowProjects'
    },
    component: FlowMain,
    children: [{
      path: 'workspace',
      name: 'FlowProjects',
      component: FlowProjects,
      props: function props(route) {
        var project = route.query.project;
        return {
          currentProjectName: project
        };
      }
    }, {
      path: 'datasets',
      name: 'FlowDatasets',
      component: FlowDatasets,
      props: function props(route) {
        var project = route.query.project;
        return {
          currentProjectName: project
        };
      }
    }, {
      path: 'scenario',
      name: 'FlowScenario',
      component: FlowScenario,
      props: function props(route) {
        var _route$query = route.query,
            project = _route$query.project,
            scenario = _route$query.scenario;
        return {
          currentProjectName: project,
          currentScenarioName: scenario
        };
      }
    }, {
      path: 'visualization',
      name: 'FlowVisualization',
      component: FlowVisualization,
      props: function props(route) {
        var _route$query2 = route.query,
            project = _route$query2.project,
            scenario = _route$query2.scenario,
            view = _route$query2.view;
        return {
          currentProjectName: project,
          currentScenarioName: scenario,
          currentViewUUID: view
        };
      }
    }, {
      path: 'export',
      name: 'FlowExport',
      component: FlowExport,
      props: function props(route) {
        var _route$query3 = route.query,
            project = _route$query3.project,
            scenario = _route$query3.scenario,
            view = _route$query3.view;
        return {
          currentProjectName: project,
          currentScenarioName: scenario,
          currentViewUUID: view
        };
      }
    }]
  }];
}

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
var isRegexp = function (it) {
  var isRegExp;
  return isObject$1(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
};

// `Assert: IsConstructor(argument) is true`
var aConstructor = function (argument) {
  if (isConstructor(argument)) return argument;
  throw TypeError(tryToString(argument) + ' is not a constructor');
};

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
var speciesConstructor = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aConstructor(S);
};

var charAt = stringMultibyte.charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
var advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};

var UNSUPPORTED_Y = regexpStickyHelpers.UNSUPPORTED_Y;
var arrayPush = [].push;
var min = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  // eslint-disable-next-line regexp/no-empty-group -- required for testing
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

// @@split logic
fixRegexpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = toString_1$1(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegexp(separator)) {
        return nativeSplit.call(string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output.length > lim ? output.slice(0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.es/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : getMethod(separator, SPLIT);
      return splitter
        ? splitter.call(separator, O, limit)
        : internalSplit.call(toString_1$1(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (string, limit) {
      var rx = anObject(this);
      var S = toString_1$1(string);
      var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);

      if (res.done) return res.value;

      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (UNSUPPORTED_Y ? 'g' : 'y');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
        var z = regexpExecAbstract(splitter, UNSUPPORTED_Y ? S.slice(q) : S);
        var e;
        if (
          z === null ||
          (e = min(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

var _baseSlice = baseSlice;

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : _baseSlice(array, start, end);
}

var _castSlice = castSlice;

/** Used to compose unicode character classes. */
var rsAstralRange$1 = '\\ud800-\\udfff',
    rsComboMarksRange$1 = '\\u0300-\\u036f',
    reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$1 = '\\u20d0-\\u20ff',
    rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1,
    rsVarRange$1 = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ$1 = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ$1 + rsAstralRange$1  + rsComboRange$1 + rsVarRange$1 + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

var _hasUnicode = hasUnicode;

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

var _asciiToArray = asciiToArray;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

var _unicodeToArray = unicodeToArray;

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return _hasUnicode(string)
    ? _unicodeToArray(string)
    : _asciiToArray(string);
}

var _stringToArray = stringToArray;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst(methodName) {
  return function(string) {
    string = toString_1(string);

    var strSymbols = _hasUnicode(string)
      ? _stringToArray(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? _castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

var _createCaseFirst = createCaseFirst;

/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst = _createCaseFirst('toUpperCase');

var upperFirst_1 = upperFirst;

/**
 * Shorthand for checking the existence of a property on an object. Use the
 * Object prototype to prevent overridden usage, and potential security issues
 * when performing this on a (user-provided) JSON loaded object
 * @param obj
 * @param property
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any

function hasOwnProperty(obj, property) {
  return Object.prototype.hasOwnProperty.call(obj, property);
}
function propertyString(property) {
  var base = property.component ? property.component + '/' : '';
  return base + property.name;
}
function parsePropertyString(val) {
  var parts = val.split('/');

  if (parts.length === 1) {
    return {
      name: parts[0],
      component: null
    };
  }

  if (parts.length === 2) {
    return {
      component: parts[0],
      name: parts[1]
    };
  }

  throw new Error("Couldn't parse '".concat(val, "' as a valid property identifier"));
}
function getEntitySummary(entityType, summary) {
  var index = summary.entity_groups.map(function (e) {
    return e.name;
  }).indexOf(entityType);

  if (index === -1) {
    return null;
  }

  return summary.entity_groups[index];
}
function copyToClipboard(text) {
  var el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
function getBaseURL() {
  return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ":".concat(window.location.port) : '') + window.location.pathname;
}
/**
 * Receives a scenario status and returns a Bulma class for the color
 * @param status
 */

function getClassFromStatus(status) {
  var statusClass = 'is-';

  switch (status) {
    case 'Failed':
    case 'Unknown':
    case 'Invalid':
    case 'Cancelled':
      statusClass += 'danger';
      break;

    case 'Ready':
    case 'Running':
    case 'Pending':
      statusClass += 'info';
      break;

    case 'Succeeded':
      statusClass += 'primary';
      break;
  }

  return statusClass;
}
function getStatusFromScenarioAndSimulation(scenario, simulation) {
  var allStatuses = ['failed', 'invalid', 'pending', 'running', 'succeeded', 'ready', 'unknown'];
  var scenarioStatus = getStatusOrUnknown(scenario).toLowerCase();
  var simulationStatus = getStatusOrUnknown(simulation).toLowerCase();

  for (var i = 0; i < allStatuses.length; i++) {
    var status = allStatuses[i];

    if (scenarioStatus === status || simulationStatus === status) {
      return upperFirst_1(status);
    }
  }

  return 'unknown'; // should not get here
}

function getStatusOrUnknown(obj) {
  return obj.status ? obj.status : 'Unknown';
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

var MoviciError$1 = /*#__PURE__*/function (_Error) {
  _inherits(MoviciError, _Error);

  var _super = _createSuper(MoviciError);

  function MoviciError(message) {
    _classCallCheck(this, MoviciError);

    return _super.call(this, message);
  }

  _createClass(MoviciError, [{
    key: "name",
    get: function get() {
      return 'MoviciError';
    }
  }]);

  return MoviciError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
var ValidationError$1 = /*#__PURE__*/function (_MoviciError) {
  _inherits(ValidationError, _MoviciError);

  var _super2 = _createSuper(ValidationError);

  function ValidationError(message) {
    _classCallCheck(this, ValidationError);

    return _super2.call(this, message);
  }

  _createClass(ValidationError, [{
    key: "name",
    get: function get() {
      return 'ValidationError';
    }
  }]);

  return ValidationError;
}(MoviciError$1);

var MoviciError = /*#__PURE__*/function (_Error) {
  _inherits(MoviciError, _Error);

  var _super = _createSuper(MoviciError);

  function MoviciError(message) {
    _classCallCheck(this, MoviciError);

    return _super.call(this, message);
  }

  _createClass(MoviciError, [{
    key: "name",
    get: function get() {
      return 'MoviciError';
    }
  }]);

  return MoviciError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
var ValidationError = /*#__PURE__*/function (_MoviciError) {
  _inherits(ValidationError, _MoviciError);

  var _super2 = _createSuper(ValidationError);

  function ValidationError(message) {
    _classCallCheck(this, ValidationError);

    return _super2.call(this, message);
  }

  _createClass(ValidationError, [{
    key: "name",
    get: function get() {
      return 'ValidationError';
    }
  }]);

  return ValidationError;
}(MoviciError);

proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs');
function transform(coord) {
  return proj4('EPSG:28992', 'WGS84', [coord[0], coord[1]]);
}
function reverseTransform(coord) {
  return proj4('WGS84', 'EPSG:28992', [coord[0], coord[1]]);
}
function transformArray(arr) {
  var len = arr.length;
  var rv = new Array(arr.length);

  for (var i = 0; i < len; i++) {
    rv[i] = transform(arr[i]);
  }

  return rv;
}

function extractCRSName(geojson) {
  var _a, _b;

  var crsInfo = geojson.crs;
  var crsName;
  if (crsInfo === undefined) return 'WGS84'; // taken from reproject.detectCRS

  if (crsInfo.type === 'name') {
    crsName = (_a = crsInfo === null || crsInfo === void 0 ? void 0 : crsInfo.properties) === null || _a === void 0 ? void 0 : _a.name;
  } else if (crsInfo.type === 'EPSG') {
    crsName = 'EPSG:' + ((_b = crsInfo === null || crsInfo === void 0 ? void 0 : crsInfo.properties) === null || _b === void 0 ? void 0 : _b.code);
  } // @ts-expect-error


  if (!proj4.defs[crsName]) {
    throw new ValidationError('Unsupported CRS: ' + JSON.stringify(crsInfo));
  }

  return crsName;
}

function transformGeoJsonToCRS(geojson) {
  var targetCRS = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EPSG:28992';
  var crs = extractCRSName(geojson);
  if (crs === targetCRS) return geojson;
  var result = reproject(geojson, crs, targetCRS, proj4.defs);
  result.crs = {
    properties: {
      name: targetCRS
    },
    type: 'name'
  };
  return result;
}

// @@match logic
fixRegexpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.es/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : getMethod(regexp, MATCH);
      return matcher ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](toString_1$1(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
    function (string) {
      var rx = anObject(this);
      var S = toString_1$1(string);
      var res = maybeCallNative(nativeMatch, rx, S);

      if (res.done) return res.value;

      if (!rx.global) return regexpExecAbstract(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regexpExecAbstract(rx, S)) !== null) {
        var matchStr = toString_1$1(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

var locales = commonjsRequire.context('.', true, /[A-Za-z0-9-_,\s]+\.json$/i);

Vue.use(VueI18n);

function loadLocaleMessages() {
  var messages = {};
  locales.keys().forEach(function (key) {
    var matched = key.match(/([A-Za-z0-9-_]+)\./i);

    if (matched && matched.length > 1) {
      var locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
});

var main = (function () {
  var Flow_ = {
    install: function install(Vue) {
      // Options
      // setOptions(merge(config, options, true))
      // Components
      Object.values(components).forEach(function (component) {
        registerComponent(Vue, component);
      });
      registerComponentProgrammatic(Vue, 'snackbar', MovSnackBarProgramatic);
    }
  };
  return Flow_;
})(); // export api client and interfaces and request classes for the api

export { ActiveEntityLayerSettings, AddDataset, AddDatasetData, AddProject, AddScenario, AddView, BaseRequest$1 as BaseRequest, Client, ColorByValueLegendItem, ColorLegendItem, ColorMapLayerSettings, ColorStaticLegendItem, Dataset, DatasetFormat, DatasetWithData, DeleteDataset, DeleteDatasetData, DeleteProject, DeleteScenario, DeleteTimeline, DeleteView, EntityGeometry, FlowSectionItem, FlowVisualizerType, GetDataset, GetDatasetData, GetDatasetDataAsBlob, GetDatasetMap, GetDatasetMapThumbnail, GetDatasetSummary, GetDatasets, GetGeocodeAddress, GetGeocodeResult, GetGeocodeResults, GetGeocodeSuggestions, GetProject, GetProjects, GetScenario, GetScenarioState, GetScenarioSummary, GetScenarios, GetTimelineInfo, GetUpdateAsBlob, GetUpdateSummary, GetUpdateWithData, GetUpdates, GetView, GetViews, HeatmapLayerSettings, LayerKind, Action as MovAction, ActionBar as MovActionBar, ActionMenu as MovActionMenu, Deck as MovDeck, LanguagePicker as MovLanguagePicker, MapVis as MovMapVis, TooltipInfo as MovTooltipInfo, MoviciError$1 as MoviciError, Request$1 as Request, RoleType, Scope, ScopeCollection, SimulationMode, StaticColorLayerSettings, UnknownLayerSettings, UpdateDataset, UpdateProject, UpdateScenario, UpdateView, ValidationError$1 as ValidationError, VisualizationMode, copyToClipboard, main as default, getBaseURL, getClassFromStatus, getDatasetFilterParams$1 as getDatasetFilterParams, getEntitySummary, getFlowRoutes, getStatusFromScenarioAndSimulation, hasOwnProperty, parsePropertyString, propertyString, reverseTransform, transform, transformArray, transformGeoJsonToCRS };
