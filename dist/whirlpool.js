
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
    function App(name, getTemplate) {
      _classCallCheck(this, App);

      this.name = name;
      this.getTemplate = getTemplate;
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
    app: function app(name, getTemplate) {
      return new App(name, getTemplate);
    },
    component: registerComponent
  };

  return index;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2hpcmxwb29sLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50LmpzIiwiLi4vc3JjL2FwcC5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBDT01QT05FTlRfQVRUUiA9ICdkYXRhLWNvbXBvbmVudCc7XG5jb25zdCBrbm93bkNvbXBvbmVudENsYXNzZXMgPSB7fTtcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGVsLCBhcHAsIHBhcmVudCkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMuYXBwID0gYXBwO1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuY29tcGxldGUgPSBmYWxzZTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy50b3BpY3MgPSBbXTtcbiAgfVxuXG4gIGxvYWRDaGlsZHJlbihjYiwgcGFyYW0pIHtcbiAgICBjb25zdCBlbHMgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1snICsgQ09NUE9ORU5UX0FUVFIgKyAnXScpO1xuICAgIGlmICghZWxzIHx8ICFlbHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIGNiKCk7XG5cbiAgICBjb25zdCBsZW4gPSBlbHMubGVuZ3RoO1xuICAgIGxldCBuYkNvbXBsZXRlID0gMDtcbiAgICBlbHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICBjb25zdCBuYW1lID0gZWwuZ2V0QXR0cmlidXRlKENPTVBPTkVOVF9BVFRSKTtcbiAgICAgIGlmIChuYW1lIGluIGtub3duQ29tcG9uZW50Q2xhc3Nlcykge1xuICAgICAgICBjb25zdCBDbGFzcyA9IGtub3duQ29tcG9uZW50Q2xhc3Nlc1tuYW1lXTtcbiAgICAgICAgY29uc3QgYyA9IG5ldyBDbGFzcyhuYW1lLCBlbCwgdGhpcy5hcHAsIHRoaXMpO1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goYyk7XG4gICAgICAgIGMubG9hZCgoKSA9PiB7XG4gICAgICAgICAgaWYgKCsrbmJDb21wbGV0ZSA9PT0gbGVuKVxuICAgICAgICAgICAgY2IoKTtcbiAgICAgICAgfSwgcGFyYW0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCsrbmJDb21wbGV0ZSA9PT0gbGVuKVxuICAgICAgICBjYigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbG9hZChjYiwgcGFyYW0pIHtcbiAgICBwYXJhbSA9IHBhcmFtIHx8IHt9O1xuICAgIHRoaXMuY29tcGxldGUgPSBmYWxzZTtcbiAgICB0aGlzLmdldERhdGEoZGF0YSA9PiB7XG4gICAgICB0aGlzLmdldFRlbXBsYXRlKCh0ZW1wbGF0ZSkgPT4ge1xuICAgICAgICAvLyByZW5kZXJcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB0ZW1wbGF0ZShkYXRhKTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgIGMuZGVzdHJveWVkKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgICAgIC8vIGFmdGVyIHJlbmRlclxuICAgICAgICB0aGlzLnJlbmRlcmVkKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmxvYWRDaGlsZHJlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChjYikgY2IoKTtcbiAgICAgICAgICB9LCBwYXJhbSlcbiAgICAgICAgfSwgcGFyYW0pO1xuICAgICAgfSk7XG4gICAgfSwgcGFyYW0pXG4gIH1cblxuICBkZXN0cm95ZWQoKSB7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xuICAgICAgYy5kZXN0cm95ZWQoKTtcbiAgICB9KTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy50b3BpY3MuZm9yRWFjaCh0b3BpYyA9PiB7XG4gICAgICB0aGlzLmFwcC51bnN1YnNjcmliZSh0b3BpYywgdGhpcyk7XG4gICAgfSlcbiAgICB0aGlzLnRvcGljcyA9IFtdO1xuICB9XG5cbiAgc3Vic2NyaWJlKHRvcGljLCBjYikge1xuICAgIHRoaXMuYXBwLnN1YnNjcmliZSh0b3BpYywgY2IsIHRoaXMpO1xuICAgIHRoaXMudG9waWNzLnB1c2godG9waWMpO1xuICB9XG5cbiAgcHVibGlzaCh0b3BpYywgZGF0YSkge1xuICAgIHRoaXMuYXBwLnB1Ymxpc2godG9waWMsIGRhdGEsIHRoaXMpO1xuICB9XG5cbiAgLy8gVGhlc2UgMiBtZXRob2RzIGFyZSB0byBiZSBvdmVycmlkZWQgYnkgZWFjaCBjb21wb25lbnRcbiAgZ2V0RGF0YShjYikge1xuICAgIGlmIChjYikgY2IodGhpcy5kYXRhIHx8IHt9KTtcbiAgfVxuXG4gIGdldFRlbXBsYXRlKGNiKSB7XG4gICAgaWYgKGNiKSBjYih0aGlzLnRlbXBsYXRlIHx8ICgoKSA9PiAnJykpO1xuICB9XG5cbiAgcmVuZGVyZWQoY2IpIHtcbiAgICBpZiAoY2IpIGNiKCk7XG4gIH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckNvbXBvbmVudChuYW1lLCBkZWYpIHtcbiAgY29uc3QgY2xzID0gY2xhc3MgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGVsLCBhcHAsIHBhcmVudCkge1xuICAgICAgc3VwZXIobmFtZSwgZWwsIGFwcCwgcGFyZW50KTtcbiAgICAgIGlmIChkZWYuaW5pdCkge1xuICAgICAgICBkZWYuaW5pdC5iaW5kKHRoaXMpKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkZWYudGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IGRlZi50ZW1wbGF0ZTtcbiAgICAgIH0gZWxzZSBpZiAoYXBwLmdldFRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMuZ2V0VGVtcGxhdGUgPSAoY2IpID0+IHtcbiAgICAgICAgICBhcHAuZ2V0VGVtcGxhdGUodGhpcy5uYW1lLCBjYik7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZGVmLmdldERhdGEpIHtcbiAgICAgICAgdGhpcy5nZXREYXRhID0gZGVmLmdldERhdGEuYmluZCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWYucmVuZGVyZWQpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlZCA9IGRlZi5yZW5kZXJlZC5iaW5kKHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBrbm93bkNvbXBvbmVudENsYXNzZXNbbmFtZV0gPSBjbHM7XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQuanMnO1xuXG5mdW5jdGlvbiBnZXRPckNyZWF0ZSh0b3BpY3MsIHRvcGljKSB7XG4gIGlmICghdG9waWNzLmhhcyh0b3BpYykpIHtcbiAgICB0b3BpY3Muc2V0KHRvcGljLCB7XG4gICAgICBzdWJzY3JpYmVyczogbmV3IE1hcCgpLFxuICAgIH0pO1xuICB9XG4gIHJldHVybiB0b3BpY3MuZ2V0KHRvcGljKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwIHtcbiAgY29uc3RydWN0b3IobmFtZSwgZ2V0VGVtcGxhdGUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuZ2V0VGVtcGxhdGUgPSBnZXRUZW1wbGF0ZTtcbiAgICB0aGlzLnRvcGljcyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIHN0YXJ0KGVsLCBwYXJhbSkge1xuICAgIC8vIFRPRE86IHJlbW92ZUV2ZW50TGlzdGVuZXIgc29tZSB3aGVyZVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIChldikgPT4ge1xuICAgICAgdGhpcy5wdWJsaXNoKCdwb3BzdGF0ZScsIGV2KTtcbiAgICB9KTtcbiAgICBjb25zdCByb290ID0gbmV3IENvbXBvbmVudCgnJywgZWwsIHRoaXMpO1xuICAgIHJvb3QubG9hZENoaWxkcmVuKCgpID0+IHt9LCBwYXJhbSk7XG4gIH1cblxuICBwdWJsaXNoKHRvcGljLCBkYXRhLCBwdWJsaXNoZXIpIHtcbiAgICBjb25zdCBlbnRyeSA9IGdldE9yQ3JlYXRlKHRoaXMudG9waWNzLCB0b3BpYyk7XG4gICAgZm9yIChsZXQgY2Igb2YgZW50cnkuc3Vic2NyaWJlcnMudmFsdWVzKCkpIHtcbiAgICAgIGNiKGRhdGEsIHB1Ymxpc2hlcik7XG4gICAgfVxuICAgIGVudHJ5LmRhdGEgPSBkYXRhO1xuICAgIGVudHJ5LnB1Ymxpc2hlciA9IHB1Ymxpc2hlcjtcbiAgfVxuXG4gIHN1YnNjcmliZSh0b3BpYywgY2IsIHN1YnNjcmliZXIpIHtcbiAgICBjb25zdCBlbnRyeSA9IGdldE9yQ3JlYXRlKHRoaXMudG9waWNzLCB0b3BpYyk7XG4gICAgZW50cnkuc3Vic2NyaWJlcnMuc2V0KHN1YnNjcmliZXIsIGNiKTtcbiAgICBpZiAoZW50cnkucHVibGlzaGVyKSB7XG4gICAgICBjYihlbnRyeS5kYXRhLCBlbnRyeS5wdWJsaXNoZXIpO1xuICAgIH1cbiAgfVxuXG4gIHVuc3Vic2NyaWJlKHRvcGljLCBzdWJzY3JpYmVyKSB7XG4gICAgaWYgKCF0aGlzLnRvcGljcy5oYXModG9waWMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN1YnNjcmliZXJzID0gdGhpcy50b3BpY3MuZ2V0KHRvcGljKS5zdWJzY3JpYmVycztcbiAgICBzdWJzY3JpYmVycy5kZWxldGUoc3Vic2NyaWJlcik7XG4gIH1cbn07XG5cbiIsImltcG9ydCB7IHJlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQuanMnO1xuaW1wb3J0IEFwcCBmcm9tICcuL2FwcC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYXBwOiAobmFtZSwgZ2V0VGVtcGxhdGUpID0+IHtcbiAgICByZXR1cm4gbmV3IEFwcChuYW1lLCBnZXRUZW1wbGF0ZSk7XG4gIH0sXG4gIGNvbXBvbmVudDogcmVnaXN0ZXJDb21wb25lbnQsXG59O1xuIl0sIm5hbWVzIjpbIkNPTVBPTkVOVF9BVFRSIiwia25vd25Db21wb25lbnRDbGFzc2VzIiwiQ29tcG9uZW50IiwibmFtZSIsImVsIiwiYXBwIiwicGFyZW50IiwiY29tcGxldGUiLCJjaGlsZHJlbiIsInRvcGljcyIsImNiIiwicGFyYW0iLCJlbHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwibGVuZ3RoIiwibGVuIiwibmJDb21wbGV0ZSIsImZvckVhY2giLCJnZXRBdHRyaWJ1dGUiLCJDbGFzcyIsImMiLCJwdXNoIiwibG9hZCIsImdldERhdGEiLCJkYXRhIiwiZ2V0VGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsImlubmVySFRNTCIsImRlc3Ryb3llZCIsInJlbmRlcmVkIiwibG9hZENoaWxkcmVuIiwidG9waWMiLCJ1bnN1YnNjcmliZSIsInN1YnNjcmliZSIsInB1Ymxpc2giLCJyZWdpc3RlckNvbXBvbmVudCIsImRlZiIsImNscyIsImluaXQiLCJiaW5kIiwiZ2V0T3JDcmVhdGUiLCJoYXMiLCJzZXQiLCJzdWJzY3JpYmVycyIsIk1hcCIsImdldCIsIkFwcCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJldiIsInJvb3QiLCJwdWJsaXNoZXIiLCJlbnRyeSIsInZhbHVlcyIsInN1YnNjcmliZXIiLCJjb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFBQSxJQUFNQSxjQUFjLEdBQUcsZ0JBQXZCO0VBQ0EsSUFBTUMscUJBQXFCLEdBQUcsRUFBOUI7TUFFYUMsU0FBYjtFQUNFLHFCQUFZQyxJQUFaLEVBQWtCQyxFQUFsQixFQUFzQkMsR0FBdEIsRUFBMkJDLE1BQTNCLEVBQW1DO0VBQUE7O0VBQ2pDLFNBQUtILElBQUwsR0FBWUEsSUFBWjtFQUNBLFNBQUtDLEVBQUwsR0FBVUEsRUFBVjtFQUNBLFNBQUtDLEdBQUwsR0FBV0EsR0FBWDtFQUNBLFNBQUtDLE1BQUwsR0FBY0EsTUFBZDtFQUNBLFNBQUtDLFFBQUwsR0FBZ0IsS0FBaEI7RUFDQSxTQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0VBQ0EsU0FBS0MsTUFBTCxHQUFjLEVBQWQ7RUFDRDs7RUFUSDtFQUFBO0VBQUEsV0FXRSxzQkFBYUMsRUFBYixFQUFpQkMsS0FBakIsRUFBd0I7RUFBQTs7RUFDdEIsVUFBTUMsR0FBRyxHQUFHLEtBQUtSLEVBQUwsQ0FBUVMsZ0JBQVIsQ0FBeUIsTUFBTWIsY0FBTixHQUF1QixHQUFoRCxDQUFaO0VBQ0EsVUFBSSxDQUFDWSxHQUFELElBQVEsQ0FBQ0EsR0FBRyxDQUFDRSxNQUFqQixFQUNFLE9BQU9KLEVBQUUsRUFBVDtFQUVGLFVBQU1LLEdBQUcsR0FBR0gsR0FBRyxDQUFDRSxNQUFoQjtFQUNBLFVBQUlFLFVBQVUsR0FBRyxDQUFqQjtFQUNBSixNQUFBQSxHQUFHLENBQUNLLE9BQUosQ0FBWSxVQUFBYixFQUFFLEVBQUk7RUFDaEIsWUFBTUQsSUFBSSxHQUFHQyxFQUFFLENBQUNjLFlBQUgsQ0FBZ0JsQixjQUFoQixDQUFiOztFQUNBLFlBQUlHLElBQUksSUFBSUYscUJBQVosRUFBbUM7RUFDakMsY0FBTWtCLEtBQUssR0FBR2xCLHFCQUFxQixDQUFDRSxJQUFELENBQW5DO0VBQ0EsY0FBTWlCLENBQUMsR0FBRyxJQUFJRCxLQUFKLENBQVVoQixJQUFWLEVBQWdCQyxFQUFoQixFQUFvQixLQUFJLENBQUNDLEdBQXpCLEVBQThCLEtBQTlCLENBQVY7O0VBQ0EsVUFBQSxLQUFJLENBQUNHLFFBQUwsQ0FBY2EsSUFBZCxDQUFtQkQsQ0FBbkI7O0VBQ0FBLFVBQUFBLENBQUMsQ0FBQ0UsSUFBRixDQUFPLFlBQU07RUFDWCxnQkFBSSxFQUFFTixVQUFGLEtBQWlCRCxHQUFyQixFQUNFTCxFQUFFO0VBQ0wsV0FIRCxFQUdHQyxLQUhIO0VBSUQsU0FSRCxNQVFPO0VBQ0wsY0FBSSxFQUFFSyxVQUFGLEtBQWlCRCxHQUFyQixFQUNBTCxFQUFFO0VBQ0g7RUFDRixPQWREO0VBZUQ7RUFqQ0g7RUFBQTtFQUFBLFdBbUNFLGNBQUtBLEVBQUwsRUFBU0MsS0FBVCxFQUFnQjtFQUFBOztFQUNkQSxNQUFBQSxLQUFLLEdBQUdBLEtBQUssSUFBSSxFQUFqQjtFQUNBLFdBQUtKLFFBQUwsR0FBZ0IsS0FBaEI7RUFDQSxXQUFLZ0IsT0FBTCxDQUFhLFVBQUFDLElBQUksRUFBSTtFQUNuQixRQUFBLE1BQUksQ0FBQ0MsV0FBTCxDQUFpQixVQUFDQyxRQUFELEVBQWM7RUFDN0I7RUFDQSxVQUFBLE1BQUksQ0FBQ3RCLEVBQUwsQ0FBUXVCLFNBQVIsR0FBb0JELFFBQVEsQ0FBQ0YsSUFBRCxDQUE1Qjs7RUFDQSxVQUFBLE1BQUksQ0FBQ2hCLFFBQUwsQ0FBY1MsT0FBZCxDQUFzQixVQUFBRyxDQUFDLEVBQUk7RUFDekJBLFlBQUFBLENBQUMsQ0FBQ1EsU0FBRjtFQUNELFdBRkQ7O0VBR0EsVUFBQSxNQUFJLENBQUNwQixRQUFMLEdBQWdCLEVBQWhCLENBTjZCOztFQVE3QixVQUFBLE1BQUksQ0FBQ3FCLFFBQUwsQ0FBYyxZQUFNO0VBQ2xCLFlBQUEsTUFBSSxDQUFDQyxZQUFMLENBQWtCLFlBQU07RUFDdEIsY0FBQSxNQUFJLENBQUN2QixRQUFMLEdBQWdCLElBQWhCO0VBQ0Esa0JBQUlHLEVBQUosRUFBUUEsRUFBRTtFQUNYLGFBSEQsRUFHR0MsS0FISDtFQUlELFdBTEQsRUFLR0EsS0FMSDtFQU1ELFNBZEQ7RUFlRCxPQWhCRCxFQWdCR0EsS0FoQkg7RUFpQkQ7RUF2REg7RUFBQTtFQUFBLFdBeURFLHFCQUFZO0VBQUE7O0VBQ1YsV0FBS0gsUUFBTCxDQUFjUyxPQUFkLENBQXNCLFVBQUFHLENBQUMsRUFBSTtFQUN6QkEsUUFBQUEsQ0FBQyxDQUFDUSxTQUFGO0VBQ0QsT0FGRDtFQUdBLFdBQUtwQixRQUFMLEdBQWdCLEVBQWhCO0VBQ0EsV0FBS0MsTUFBTCxDQUFZUSxPQUFaLENBQW9CLFVBQUFjLEtBQUssRUFBSTtFQUMzQixRQUFBLE1BQUksQ0FBQzFCLEdBQUwsQ0FBUzJCLFdBQVQsQ0FBcUJELEtBQXJCLEVBQTRCLE1BQTVCO0VBQ0QsT0FGRDtFQUdBLFdBQUt0QixNQUFMLEdBQWMsRUFBZDtFQUNEO0VBbEVIO0VBQUE7RUFBQSxXQW9FRSxtQkFBVXNCLEtBQVYsRUFBaUJyQixFQUFqQixFQUFxQjtFQUNuQixXQUFLTCxHQUFMLENBQVM0QixTQUFULENBQW1CRixLQUFuQixFQUEwQnJCLEVBQTFCLEVBQThCLElBQTlCO0VBQ0EsV0FBS0QsTUFBTCxDQUFZWSxJQUFaLENBQWlCVSxLQUFqQjtFQUNEO0VBdkVIO0VBQUE7RUFBQSxXQXlFRSxpQkFBUUEsS0FBUixFQUFlUCxJQUFmLEVBQXFCO0VBQ25CLFdBQUtuQixHQUFMLENBQVM2QixPQUFULENBQWlCSCxLQUFqQixFQUF3QlAsSUFBeEIsRUFBOEIsSUFBOUI7RUFDRCxLQTNFSDs7RUFBQTtFQUFBO0VBQUEsV0E4RUUsaUJBQVFkLEVBQVIsRUFBWTtFQUNWLFVBQUlBLEVBQUosRUFBUUEsRUFBRSxDQUFDLEtBQUtjLElBQUwsSUFBYSxFQUFkLENBQUY7RUFDVDtFQWhGSDtFQUFBO0VBQUEsV0FrRkUscUJBQVlkLEVBQVosRUFBZ0I7RUFDZCxVQUFJQSxFQUFKLEVBQVFBLEVBQUUsQ0FBQyxLQUFLZ0IsUUFBTCxJQUFrQjtFQUFBLGVBQU0sRUFBTjtFQUFBLE9BQW5CLENBQUY7RUFDVDtFQXBGSDtFQUFBO0VBQUEsV0FzRkUsa0JBQVNoQixFQUFULEVBQWE7RUFDWCxVQUFJQSxFQUFKLEVBQVFBLEVBQUU7RUFDWDtFQXhGSDs7RUFBQTtFQUFBO0VBMkZPLFNBQVN5QixpQkFBVCxDQUEyQmhDLElBQTNCLEVBQWlDaUMsR0FBakMsRUFBc0M7RUFDM0MsTUFBTUMsR0FBRztFQUFBOztFQUFBOztFQUNQLGlCQUFZbEMsSUFBWixFQUFrQkMsRUFBbEIsRUFBc0JDLEdBQXRCLEVBQTJCQyxNQUEzQixFQUFtQztFQUFBOztFQUFBOztFQUNqQyxpQ0FBTUgsSUFBTixFQUFZQyxFQUFaLEVBQWdCQyxHQUFoQixFQUFxQkMsTUFBckI7O0VBQ0EsVUFBSThCLEdBQUcsQ0FBQ0UsSUFBUixFQUFjO0VBQ1pGLFFBQUFBLEdBQUcsQ0FBQ0UsSUFBSixDQUFTQyxJQUFUO0VBQ0Q7O0VBRUQsVUFBSUgsR0FBRyxDQUFDVixRQUFSLEVBQWtCO0VBQ2hCLGVBQUtBLFFBQUwsR0FBZ0JVLEdBQUcsQ0FBQ1YsUUFBcEI7RUFDRCxPQUZELE1BRU8sSUFBSXJCLEdBQUcsQ0FBQ29CLFdBQVIsRUFBcUI7RUFDMUIsZUFBS0EsV0FBTCxHQUFtQixVQUFDZixFQUFELEVBQVE7RUFDekJMLFVBQUFBLEdBQUcsQ0FBQ29CLFdBQUosQ0FBZ0IsT0FBS3RCLElBQXJCLEVBQTJCTyxFQUEzQjtFQUNELFNBRkQ7RUFHRDs7RUFDRCxVQUFJMEIsR0FBRyxDQUFDYixPQUFSLEVBQWlCO0VBQ2YsZUFBS0EsT0FBTCxHQUFlYSxHQUFHLENBQUNiLE9BQUosQ0FBWWdCLElBQVosZ0NBQWY7RUFDRDs7RUFDRCxVQUFJSCxHQUFHLENBQUNQLFFBQVIsRUFBa0I7RUFDaEIsZUFBS0EsUUFBTCxHQUFnQk8sR0FBRyxDQUFDUCxRQUFKLENBQWFVLElBQWIsZ0NBQWhCO0VBQ0Q7O0VBbEJnQztFQW1CbEM7O0VBcEJNO0VBQUEsSUFBaUJyQyxTQUFqQixDQUFUOztFQXNCQUQsRUFBQUEscUJBQXFCLENBQUNFLElBQUQsQ0FBckIsR0FBOEJrQyxHQUE5QjtFQUNEOztFQ3BIRCxTQUFTRyxXQUFULENBQXFCL0IsTUFBckIsRUFBNkJzQixLQUE3QixFQUFvQztFQUNsQyxNQUFJLENBQUN0QixNQUFNLENBQUNnQyxHQUFQLENBQVdWLEtBQVgsQ0FBTCxFQUF3QjtFQUN0QnRCLElBQUFBLE1BQU0sQ0FBQ2lDLEdBQVAsQ0FBV1gsS0FBWCxFQUFrQjtFQUNoQlksTUFBQUEsV0FBVyxFQUFFLElBQUlDLEdBQUo7RUFERyxLQUFsQjtFQUdEOztFQUNELFNBQU9uQyxNQUFNLENBQUNvQyxHQUFQLENBQVdkLEtBQVgsQ0FBUDtFQUNEOztNQUVvQmU7RUFDbkIsZUFBWTNDLElBQVosRUFBa0JzQixXQUFsQixFQUErQjtFQUFBOztFQUM3QixTQUFLdEIsSUFBTCxHQUFZQSxJQUFaO0VBQ0EsU0FBS3NCLFdBQUwsR0FBbUJBLFdBQW5CO0VBQ0EsU0FBS2hCLE1BQUwsR0FBYyxJQUFJbUMsR0FBSixFQUFkO0VBQ0Q7Ozs7YUFFRCxlQUFNeEMsRUFBTixFQUFVTyxLQUFWLEVBQWlCO0VBQUE7O0VBQ2Y7RUFDQW9DLE1BQUFBLE1BQU0sQ0FBQ0MsZ0JBQVAsQ0FBd0IsVUFBeEIsRUFBb0MsVUFBQ0MsRUFBRCxFQUFRO0VBQzFDLFFBQUEsS0FBSSxDQUFDZixPQUFMLENBQWEsVUFBYixFQUF5QmUsRUFBekI7RUFDRCxPQUZEO0VBR0EsVUFBTUMsSUFBSSxHQUFHLElBQUloRCxTQUFKLENBQWMsRUFBZCxFQUFrQkUsRUFBbEIsRUFBc0IsSUFBdEIsQ0FBYjtFQUNBOEMsTUFBQUEsSUFBSSxDQUFDcEIsWUFBTCxDQUFrQixZQUFNLEVBQXhCLEVBQTRCbkIsS0FBNUI7RUFDRDs7O2FBRUQsaUJBQVFvQixLQUFSLEVBQWVQLElBQWYsRUFBcUIyQixTQUFyQixFQUFnQztFQUM5QixVQUFNQyxLQUFLLEdBQUdaLFdBQVcsQ0FBQyxLQUFLL0IsTUFBTixFQUFjc0IsS0FBZCxDQUF6Qjs7RUFEOEIsaURBRWZxQixLQUFLLENBQUNULFdBQU4sQ0FBa0JVLE1BQWxCLEVBRmU7RUFBQTs7RUFBQTtFQUU5Qiw0REFBMkM7RUFBQSxjQUFsQzNDLEVBQWtDO0VBQ3pDQSxVQUFBQSxFQUFFLENBQUNjLElBQUQsRUFBTzJCLFNBQVAsQ0FBRjtFQUNEO0VBSjZCO0VBQUE7RUFBQTtFQUFBO0VBQUE7O0VBSzlCQyxNQUFBQSxLQUFLLENBQUM1QixJQUFOLEdBQWFBLElBQWI7RUFDQTRCLE1BQUFBLEtBQUssQ0FBQ0QsU0FBTixHQUFrQkEsU0FBbEI7RUFDRDs7O2FBRUQsbUJBQVVwQixLQUFWLEVBQWlCckIsRUFBakIsRUFBcUI0QyxVQUFyQixFQUFpQztFQUMvQixVQUFNRixLQUFLLEdBQUdaLFdBQVcsQ0FBQyxLQUFLL0IsTUFBTixFQUFjc0IsS0FBZCxDQUF6QjtFQUNBcUIsTUFBQUEsS0FBSyxDQUFDVCxXQUFOLENBQWtCRCxHQUFsQixDQUFzQlksVUFBdEIsRUFBa0M1QyxFQUFsQzs7RUFDQSxVQUFJMEMsS0FBSyxDQUFDRCxTQUFWLEVBQXFCO0VBQ25CekMsUUFBQUEsRUFBRSxDQUFDMEMsS0FBSyxDQUFDNUIsSUFBUCxFQUFhNEIsS0FBSyxDQUFDRCxTQUFuQixDQUFGO0VBQ0Q7RUFDRjs7O2FBRUQscUJBQVlwQixLQUFaLEVBQW1CdUIsVUFBbkIsRUFBK0I7RUFDN0IsVUFBSSxDQUFDLEtBQUs3QyxNQUFMLENBQVlnQyxHQUFaLENBQWdCVixLQUFoQixDQUFMLEVBQTZCO0VBQzNCO0VBQ0Q7O0VBQ0QsVUFBTVksV0FBVyxHQUFHLEtBQUtsQyxNQUFMLENBQVlvQyxHQUFaLENBQWdCZCxLQUFoQixFQUF1QlksV0FBM0M7RUFDQUEsTUFBQUEsV0FBVyxVQUFYLENBQW1CVyxVQUFuQjtFQUNEOzs7Ozs7QUMvQ0gsY0FBZTtFQUNiakQsRUFBQUEsR0FBRyxFQUFFLGFBQUNGLElBQUQsRUFBT3NCLFdBQVAsRUFBdUI7RUFDMUIsV0FBTyxJQUFJcUIsR0FBSixDQUFRM0MsSUFBUixFQUFjc0IsV0FBZCxDQUFQO0VBQ0QsR0FIWTtFQUliOEIsRUFBQUEsU0FBUyxFQUFFcEI7RUFKRSxDQUFmOzs7Ozs7OzsifQ==
