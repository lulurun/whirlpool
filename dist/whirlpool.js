
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

  var COMPONENT_ATTR = 'data-component';
  var knownComponentClasses = {};
  var Component = /*#__PURE__*/function () {
    function Component(name, el, app, parent) {
      _classCallCheck(this, Component);

      this.name = name;
      this.el = el;
      this.app = app;
      this.parent = parent;
      this.complete = false;
      this.children = [];
      this.topics = [];
    }

    _createClass(Component, [{
      key: "render",
      value: function render(data, template) {
        this.el.innerHTML = template(data);
        this.children.forEach(function (c) {
          c.destroyed();
        });
        this.children = [];
      }
    }, {
      key: "loadChildren",
      value: function loadChildren(cb, param) {
        var _this = this;

        var els = this.el.querySelectorAll('[' + COMPONENT_ATTR + ']');
        if (!els || !els.length) return cb();
        var len = els.length;
        var nbComplete = 0;
        els.forEach(function (el) {
          var name = el.getAttribute(COMPONENT_ATTR);

          if (name in knownComponentClasses) {
            var Class = knownComponentClasses[name];
            var c = new Class(name, el, _this.app, _this);

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
          // TODO rely on app side to setup the template function (mustache, handlebar, etc)
          _this2.render(data, _this2.template);

          _this2.rendered(function () {
            _this2.loadChildren(function () {
              _this2.complete = true;
              if (cb) cb();
            }, param);
          }, param);
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

        _this4.template = def.template || function () {
          return '';
        };

        if (def.init) {
          def.init.bind(_assertThisInitialized(_this4))();
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

    knownComponentClasses[name] = cls;
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
    function App(name) {
      _classCallCheck(this, App);

      this.name = name;
      this.topics = new Map();
    }

    _createClass(App, [{
      key: "start",
      value: function start(el, param) {
        var _this = this;

        // TODO: removeEventListener some where
        window.addEventListener('popstate', function (ev) {
          _this.publish('popstate', ev);
        });
        var root = new Component('', el, this);
        root.loadChildren(function () {}, param);
      }
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
      }
    }, {
      key: "subscribe",
      value: function subscribe(topic, cb, subscriber) {
        var entry = getOrCreate(this.topics, topic);
        entry.subscribers.set(subscriber, cb);

        if (entry.publisher) {
          cb(entry.data, entry.publisher);
        }
      }
    }, {
      key: "unsubscribe",
      value: function unsubscribe(topic, subscriber) {
        if (!this.topics.has(topic)) {
          return;
        }

        var subscribers = this.topics.get(topic).subscribers;
        subscribers["delete"](subscriber);
      }
    }]);

    return App;
  }();

  var index = {
    app: function app(name) {
      return new App(name);
    },
    component: registerComponent
  };

  return index;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2hpcmxwb29sLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50LmpzIiwiLi4vc3JjL2FwcC5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBDT01QT05FTlRfQVRUUiA9ICdkYXRhLWNvbXBvbmVudCc7XG5jb25zdCBrbm93bkNvbXBvbmVudENsYXNzZXMgPSB7fTtcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGVsLCBhcHAsIHBhcmVudCkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMuYXBwID0gYXBwO1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuY29tcGxldGUgPSBmYWxzZTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy50b3BpY3MgPSBbXTtcbiAgfVxuXG4gIHJlbmRlcihkYXRhLCB0ZW1wbGF0ZSkge1xuICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdGVtcGxhdGUoZGF0YSk7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xuICAgICAgYy5kZXN0cm95ZWQoKTtcbiAgICB9KTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gIH1cblxuICBsb2FkQ2hpbGRyZW4oY2IsIHBhcmFtKSB7XG4gICAgY29uc3QgZWxzID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKCdbJyArIENPTVBPTkVOVF9BVFRSICsgJ10nKTtcbiAgICBpZiAoIWVscyB8fCAhZWxzLmxlbmd0aClcbiAgICAgIHJldHVybiBjYigpO1xuXG4gICAgY29uc3QgbGVuID0gZWxzLmxlbmd0aDtcbiAgICBsZXQgbmJDb21wbGV0ZSA9IDA7XG4gICAgZWxzLmZvckVhY2goZWwgPT4ge1xuICAgICAgY29uc3QgbmFtZSA9IGVsLmdldEF0dHJpYnV0ZShDT01QT05FTlRfQVRUUik7XG4gICAgICBpZiAobmFtZSBpbiBrbm93bkNvbXBvbmVudENsYXNzZXMpIHtcbiAgICAgICAgY29uc3QgQ2xhc3MgPSBrbm93bkNvbXBvbmVudENsYXNzZXNbbmFtZV07XG4gICAgICAgIGNvbnN0IGMgPSBuZXcgQ2xhc3MobmFtZSwgZWwsIHRoaXMuYXBwLCB0aGlzKTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGMpO1xuICAgICAgICBjLmxvYWQoKCkgPT4ge1xuICAgICAgICAgIGlmICgrK25iQ29tcGxldGUgPT09IGxlbilcbiAgICAgICAgICAgIGNiKCk7XG4gICAgICAgIH0sIHBhcmFtKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICgrK25iQ29tcGxldGUgPT09IGxlbilcbiAgICAgICAgY2IoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGxvYWQoY2IsIHBhcmFtKSB7XG4gICAgcGFyYW0gPSBwYXJhbSB8fCB7fTtcbiAgICB0aGlzLmNvbXBsZXRlID0gZmFsc2U7XG4gICAgdGhpcy5nZXREYXRhKGRhdGEgPT4ge1xuICAgICAgLy8gVE9ETyByZWx5IG9uIGFwcCBzaWRlIHRvIHNldHVwIHRoZSB0ZW1wbGF0ZSBmdW5jdGlvbiAobXVzdGFjaGUsIGhhbmRsZWJhciwgZXRjKVxuICAgICAgdGhpcy5yZW5kZXIoZGF0YSwgdGhpcy50ZW1wbGF0ZSk7XG4gICAgICB0aGlzLnJlbmRlcmVkKCgpID0+IHtcbiAgICAgICAgdGhpcy5sb2FkQ2hpbGRyZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgIGlmIChjYikgY2IoKTtcbiAgICAgICAgfSwgcGFyYW0pXG4gICAgICB9LCBwYXJhbSk7XG4gICAgfSwgcGFyYW0pXG4gIH1cblxuICBkZXN0cm95ZWQoKSB7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xuICAgICAgYy5kZXN0cm95ZWQoKTtcbiAgICB9KTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy50b3BpY3MuZm9yRWFjaCh0b3BpYyA9PiB7XG4gICAgICB0aGlzLmFwcC51bnN1YnNjcmliZSh0b3BpYywgdGhpcyk7XG4gICAgfSlcbiAgICB0aGlzLnRvcGljcyA9IFtdO1xuICB9XG5cbiAgc3Vic2NyaWJlKHRvcGljLCBjYikge1xuICAgIHRoaXMuYXBwLnN1YnNjcmliZSh0b3BpYywgY2IsIHRoaXMpO1xuICAgIHRoaXMudG9waWNzLnB1c2godG9waWMpO1xuICB9XG5cbiAgcHVibGlzaCh0b3BpYywgZGF0YSkge1xuICAgIHRoaXMuYXBwLnB1Ymxpc2godG9waWMsIGRhdGEsIHRoaXMpO1xuICB9XG5cbiAgLy8gVGhlc2UgMiBtZXRob2RzIGFyZSB0byBiZSBvdmVycmlkZWQgYnkgZWFjaCBjb21wb25lbnRcbiAgZ2V0RGF0YShjYikge1xuICAgIGlmIChjYikgY2IodGhpcy5kYXRhIHx8IHt9KTtcbiAgfVxuXG4gIHJlbmRlcmVkKGNiKSB7XG4gICAgaWYgKGNiKSBjYigpO1xuICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnQobmFtZSwgZGVmKSB7XG4gIGNvbnN0IGNscyA9IGNsYXNzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBlbCwgYXBwLCBwYXJlbnQpIHtcbiAgICAgIHN1cGVyKG5hbWUsIGVsLCBhcHAsIHBhcmVudCk7XG4gICAgICB0aGlzLnRlbXBsYXRlID0gZGVmLnRlbXBsYXRlIHx8ICgoKSA9PiAnJyk7XG4gICAgICBpZiAoZGVmLmluaXQpIHtcbiAgICAgICAgZGVmLmluaXQuYmluZCh0aGlzKSgpO1xuICAgICAgfVxuICAgICAgaWYgKGRlZi5nZXREYXRhKSB7XG4gICAgICAgIHRoaXMuZ2V0RGF0YSA9IGRlZi5nZXREYXRhLmJpbmQodGhpcyk7XG4gICAgICB9XG4gICAgICBpZiAoZGVmLnJlbmRlcmVkKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZWQgPSBkZWYucmVuZGVyZWQuYmluZCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAga25vd25Db21wb25lbnRDbGFzc2VzW25hbWVdID0gY2xzO1xufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50LmpzJztcblxuZnVuY3Rpb24gZ2V0T3JDcmVhdGUodG9waWNzLCB0b3BpYykge1xuICBpZiAoIXRvcGljcy5oYXModG9waWMpKSB7XG4gICAgdG9waWNzLnNldCh0b3BpYywge1xuICAgICAgc3Vic2NyaWJlcnM6IG5ldyBNYXAoKSxcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gdG9waWNzLmdldCh0b3BpYyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMudG9waWNzID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgc3RhcnQoZWwsIHBhcmFtKSB7XG4gICAgLy8gVE9ETzogcmVtb3ZlRXZlbnRMaXN0ZW5lciBzb21lIHdoZXJlXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgKGV2KSA9PiB7XG4gICAgICB0aGlzLnB1Ymxpc2goJ3BvcHN0YXRlJywgZXYpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgQ29tcG9uZW50KCcnLCBlbCwgdGhpcyk7XG4gICAgcm9vdC5sb2FkQ2hpbGRyZW4oKCkgPT4ge30sIHBhcmFtKTtcbiAgfVxuXG4gIHB1Ymxpc2godG9waWMsIGRhdGEsIHB1Ymxpc2hlcikge1xuICAgIGNvbnN0IGVudHJ5ID0gZ2V0T3JDcmVhdGUodGhpcy50b3BpY3MsIHRvcGljKTtcbiAgICBmb3IgKGxldCBjYiBvZiBlbnRyeS5zdWJzY3JpYmVycy52YWx1ZXMoKSkge1xuICAgICAgY2IoZGF0YSwgcHVibGlzaGVyKTtcbiAgICB9XG4gICAgZW50cnkuZGF0YSA9IGRhdGE7XG4gICAgZW50cnkucHVibGlzaGVyID0gcHVibGlzaGVyO1xuICB9XG5cbiAgc3Vic2NyaWJlKHRvcGljLCBjYiwgc3Vic2NyaWJlcikge1xuICAgIGNvbnN0IGVudHJ5ID0gZ2V0T3JDcmVhdGUodGhpcy50b3BpY3MsIHRvcGljKTtcbiAgICBlbnRyeS5zdWJzY3JpYmVycy5zZXQoc3Vic2NyaWJlciwgY2IpO1xuICAgIGlmIChlbnRyeS5wdWJsaXNoZXIpIHtcbiAgICAgIGNiKGVudHJ5LmRhdGEsIGVudHJ5LnB1Ymxpc2hlcik7XG4gICAgfVxuICB9XG5cbiAgdW5zdWJzY3JpYmUodG9waWMsIHN1YnNjcmliZXIpIHtcbiAgICBpZiAoIXRoaXMudG9waWNzLmhhcyh0b3BpYykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc3Vic2NyaWJlcnMgPSB0aGlzLnRvcGljcy5nZXQodG9waWMpLnN1YnNjcmliZXJzO1xuICAgIHN1YnNjcmliZXJzLmRlbGV0ZShzdWJzY3JpYmVyKTtcbiAgfVxufTtcblxuIiwiaW1wb3J0IHsgcmVnaXN0ZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgQXBwIGZyb20gJy4vYXBwLmpzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhcHA6IChuYW1lKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBBcHAobmFtZSk7XG4gIH0sXG4gIGNvbXBvbmVudDogcmVnaXN0ZXJDb21wb25lbnQsXG59O1xuIl0sIm5hbWVzIjpbIkNPTVBPTkVOVF9BVFRSIiwia25vd25Db21wb25lbnRDbGFzc2VzIiwiQ29tcG9uZW50IiwibmFtZSIsImVsIiwiYXBwIiwicGFyZW50IiwiY29tcGxldGUiLCJjaGlsZHJlbiIsInRvcGljcyIsImRhdGEiLCJ0ZW1wbGF0ZSIsImlubmVySFRNTCIsImZvckVhY2giLCJjIiwiZGVzdHJveWVkIiwiY2IiLCJwYXJhbSIsImVscyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJsZW5ndGgiLCJsZW4iLCJuYkNvbXBsZXRlIiwiZ2V0QXR0cmlidXRlIiwiQ2xhc3MiLCJwdXNoIiwibG9hZCIsImdldERhdGEiLCJyZW5kZXIiLCJyZW5kZXJlZCIsImxvYWRDaGlsZHJlbiIsInRvcGljIiwidW5zdWJzY3JpYmUiLCJzdWJzY3JpYmUiLCJwdWJsaXNoIiwicmVnaXN0ZXJDb21wb25lbnQiLCJkZWYiLCJjbHMiLCJpbml0IiwiYmluZCIsImdldE9yQ3JlYXRlIiwiaGFzIiwic2V0Iiwic3Vic2NyaWJlcnMiLCJNYXAiLCJnZXQiLCJBcHAiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZXYiLCJyb290IiwicHVibGlzaGVyIiwiZW50cnkiLCJ2YWx1ZXMiLCJzdWJzY3JpYmVyIiwiY29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQUEsSUFBTUEsY0FBYyxHQUFHLGdCQUF2QjtFQUNBLElBQU1DLHFCQUFxQixHQUFHLEVBQTlCO01BRWFDLFNBQWI7RUFDRSxxQkFBWUMsSUFBWixFQUFrQkMsRUFBbEIsRUFBc0JDLEdBQXRCLEVBQTJCQyxNQUEzQixFQUFtQztFQUFBOztFQUNqQyxTQUFLSCxJQUFMLEdBQVlBLElBQVo7RUFDQSxTQUFLQyxFQUFMLEdBQVVBLEVBQVY7RUFDQSxTQUFLQyxHQUFMLEdBQVdBLEdBQVg7RUFDQSxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7RUFDQSxTQUFLQyxRQUFMLEdBQWdCLEtBQWhCO0VBQ0EsU0FBS0MsUUFBTCxHQUFnQixFQUFoQjtFQUNBLFNBQUtDLE1BQUwsR0FBYyxFQUFkO0VBQ0Q7O0VBVEg7RUFBQTtFQUFBLFdBV0UsZ0JBQU9DLElBQVAsRUFBYUMsUUFBYixFQUF1QjtFQUNyQixXQUFLUCxFQUFMLENBQVFRLFNBQVIsR0FBb0JELFFBQVEsQ0FBQ0Qs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
