
  /**
   * @license
   * W.js v1.0.0
   * Released under the MIT License.
   */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.W = factory());
})(this, (function () { 'use strict';

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

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
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

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
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

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var knownClasses = {};
  var Factory = {
    add: function add(name, cls) {
      knownClasses[name] = cls;
    },
    createInstance: function createInstance(name, el, app, parent) {
      if (name in knownClasses) {
        return new knownClasses[name](name, el, app, parent);
      } else {
        return null;
      }
    }
  };

  var COMPONENT_ATTR = 'data-component';
  var Component = /*#__PURE__*/function () {
    function Component(name, el, app, parent) {
      _classCallCheck(this, Component);

      this.name = name;
      this.el = el;
      this.app = app;
      this.parent = parent;
      this.children = [];
      this.topics = [];
    }

    _createClass(Component, [{
      key: "loadChildren",
      value: function loadChildren(cb, param) {
        var _this = this;

        var els = this.el.querySelectorAll('[' + COMPONENT_ATTR + ']');
        if (!els || !els.length) return cb();
        var len = els.length;
        var nbComplete = 0;
        els.forEach(function (el) {
          var name = el.getAttribute(COMPONENT_ATTR);
          var c = Factory.createInstance(name, el, _this.app, _this);

          if (c) {
            _this.children.push(c);

            c.load(function () {
              if (++nbComplete === len) cb();
            }, param);
          } else {
            if (++nbComplete === len) cb();
          }
        });
      }
    }, {
      key: "load",
      value: function load(cb, param) {
        var _this2 = this;

        param = param || {};
        this.complete = false;
        this.getData(function (data) {
          _this2.getTemplate(function (template) {
            // render
            _this2.el.innerHTML = template(data);

            _this2.children.forEach(function (c) {
              c.destroyed();
            });

            _this2.children = []; // after render

            _this2.rendered(function () {
              _this2.loadChildren(function () {
                _this2.complete = true;
                if (cb) cb();
              }, param);
            }, param);
          });
        }, param);
      }
    }, {
      key: "destroyed",
      value: function destroyed() {
        var _this3 = this;

        this.children.forEach(function (c) {
          c.destroyed();
        });
        this.children = [];
        this.topics.forEach(function (topic) {
          _this3.app.unsubscribe(topic, _this3);
        });
        this.topics = [];
      }
    }, {
      key: "subscribe",
      value: function subscribe(topic, cb) {
        this.app.subscribe(topic, cb, this);
        this.topics.push(topic);
      }
    }, {
      key: "publish",
      value: function publish(topic, data) {
        this.app.publish(topic, data, this);
      } // These 2 methods are to be overrided by each component

    }, {
      key: "getData",
      value: function getData(cb) {
        if (cb) cb(this.data || {});
      }
    }, {
      key: "getTemplate",
      value: function getTemplate(cb) {
        if (cb) cb(this.template || function () {
          return '';
        });
      }
    }, {
      key: "rendered",
      value: function rendered(cb) {
        if (cb) cb();
      }
    }]);

    return Component;
  }();
  function registerComponent(name, def) {
    var cls = /*#__PURE__*/function (_Component) {
      _inherits(cls, _Component);

      var _super = _createSuper(cls);

      function cls(name, el, app, parent) {
        var _this4;

        _classCallCheck(this, cls);

        _this4 = _super.call(this, name, el, app, parent);

        if (def.init) {
          def.init.bind(_assertThisInitialized(_this4))();
        }

        if (def.template) {
          _this4.template = def.template;
        } else if (app.getTemplate) {
          _this4.getTemplate = function (cb) {
            app.getTemplate(_this4.name, cb);
          };
        }

        if (def.getData) {
          _this4.getData = def.getData.bind(_assertThisInitialized(_this4));
        }

        if (def.rendered) {
          _this4.rendered = def.rendered.bind(_assertThisInitialized(_this4));
        }

        return _this4;
      }

      return cls;
    }(Component);

    Factory.add(name, cls);
  }

  var DEFAULT_ATTR = 'data-default';
  var CURRENT_ATTR = 'data-current';
  var TOPIC_SUFFIX = '.current';
  var Switch = /*#__PURE__*/function () {
    function Switch(name, el, app, parent) {
      var _this = this;

      _classCallCheck(this, Switch);

      this.name = name;
      this.el = el;
      this.app = app;
      this.parent = parent;
      this.currentComponent = null;
      this.defaultComponentName = el.getAttribute(DEFAULT_ATTR);
      this.app.subscribe(this.name + TOPIC_SUFFIX, function (name) {
        if (_this.currentComponent && _this.currentComponent.name === name) return;

        _this.load(function () {}, {
          name: name
        });
      }, this);
    }

    _createClass(Switch, [{
      key: "load",
      value: function load(cb, param) {
        var _this2 = this;

        param = param || {};
        var componentName = param.name || this.defaultComponentName;
        var c = Factory.createInstance(componentName, this.el, this.app, this);
        if (!c) return cb();
        c.load(function () {
          if (_this2.currentComponent) _this2.currentComponent.destroyed();
          _this2.currentComponent = c;

          _this2.el.setAttribute(CURRENT_ATTR, componentName);

          cb();
        }, param);
      }
    }, {
      key: "destroyed",
      value: function destroyed() {
        if (this.currentComponent) this.currentComponent.destroyed();
        this.currentComponent = null;
        this.app.unsubscribe(this.name + TOPIC_SUFFIX, this);
      }
    }]);

    return Switch;
  }();
  function registerSwitch(name, defaultComponentName) {
    var cls = /*#__PURE__*/function (_Switch) {
      _inherits(cls, _Switch);

      var _super = _createSuper(cls);

      function cls(name, el, app, parent) {
        var _this3;

        _classCallCheck(this, cls);

        _this3 = _super.call(this, name, el, app, parent);

        if (defaultComponentName) {
          _this3.defaultComponentName = defaultComponentName;
        }

        return _this3;
      }

      return cls;
    }(Switch);

    Factory.add(name, cls);
  }

  function getOrCreate(topics, topic) {
    if (!topics.has(topic)) {
      topics.set(topic, {
        subscribers: new Map()
      });
    }

    return topics.get(topic);
  }

  var App = /*#__PURE__*/function () {
    function App(name, getTemplate) {
      _classCallCheck(this, App);

      this.name = name;
      this.getTemplate = getTemplate;
      this.topics = new Map();
      this.events = new Map();
    }

    _createClass(App, [{
      key: "start",
      value: function start(el, param) {
        var _this = this;

        // TODO: removeEventListener some where
        window.addEventListener('popstate', function (ev) {
          _this.trigger('popstate', ev);
        });
        var root = new Component('', el, this);
        root.loadChildren(function () {}, param);
      } // Event execution

    }, {
      key: "trigger",
      value: function trigger(evName, params) {
        if (!this.events.has(evName)) return;
        var cb = this.events.get(evName);

        if (cb) {
          cb(params);
        }
      }
    }, {
      key: "on",
      value: function on(evName, cb) {
        this.events.set(evName, cb);
      } // Data sharing

    }, {
      key: "publish",
      value: function publish(topic, data, publisher) {
        var entry = getOrCreate(this.topics, topic);

        var _iterator = _createForOfIteratorHelper(entry.subscribers.values()),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var cb = _step.value;
            cb(data, publisher);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        entry.data = data;
        entry.publisher = publisher;
        entry.available = true;
      }
    }, {
      key: "subscribe",
      value: function subscribe(topic, cb, subscriber) {
        var entry = getOrCreate(this.topics, topic);
        entry.subscribers.set(subscriber, cb);

        if (entry.available) {
          cb(entry.data, entry.publisher);
        }
      }
    }, {
      key: "get",
      value: function get(topic, cb) {
        var entry = getOrCreate(this.topics, topic);
        cb(entry.available, entry.data, entry.publisher);
      }
    }, {
      key: "unsubscribe",
      value: function unsubscribe(topic, subscriber) {
        if (!this.topics.has(topic)) return;
        var subscribers = this.topics.get(topic).subscribers;
        subscribers["delete"](subscriber);
      }
    }]);

    return App;
  }();

  var index = {
    app: function app(name, getTemplate) {
      return new App(name, getTemplate);
    },
    component: registerComponent,
    "switch": registerSwitch
  };

  return index;

}));
