
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
          var Class = knownComponentClasses[name];
          var c = new Class(name, el, _this.app, _this);

          _this.children.push(c);

          c.load(function () {
            if (++nbComplete === len) cb();
          }, param);
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

        if (def.template) {
          _this4.template = def.template;
        }

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

  var App = /*#__PURE__*/function () {
    function App(name) {
      _classCallCheck(this, App);

      this.name = name;
      this.topics = {};
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
        if (!(topic in this.topics)) {
          this.topics[topic] = {
            subscribers: {}
          };
        }

        var entry = this.topics[topic];
        Object.values(entry.subscribers).forEach(function (cb) {
          cb(data, publisher);
        });
        entry.data = data;
        entry.publisher = publisher;
      }
    }, {
      key: "subscribe",
      value: function subscribe(topic, cb, subscriber) {
        if (!(topic in this.topics)) {
          this.topics[topic] = {
            subscribers: {}
          };
        }

        var entry = this.topics[topic];
        entry.subscribers[subscriber] = cb;

        if (entry.publisher) {
          cb(entry.data, entry.publisher);
        }
      }
    }, {
      key: "unsubscribe",
      value: function unsubscribe(topic, subscriber) {
        if (!(topic in this.topics)) return;
        var subscribers = this.topics[topic].subscribers;
        delete subscribers[subscriber];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2hpcmxwb29sLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50LmpzIiwiLi4vc3JjL2FwcC5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBDT01QT05FTlRfQVRUUiA9ICdkYXRhLWNvbXBvbmVudCc7XG5jb25zdCBrbm93bkNvbXBvbmVudENsYXNzZXMgPSB7fTtcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGVsLCBhcHAsIHBhcmVudCkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMuYXBwID0gYXBwO1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuY29tcGxldGUgPSBmYWxzZTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy50b3BpY3MgPSBbXTtcbiAgfVxuXG4gIHJlbmRlcihkYXRhLCB0ZW1wbGF0ZSkge1xuICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdGVtcGxhdGUoZGF0YSk7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xuICAgICAgYy5kZXN0cm95ZWQoKTtcbiAgICB9KTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gIH1cblxuICBsb2FkQ2hpbGRyZW4oY2IsIHBhcmFtKSB7XG4gICAgY29uc3QgZWxzID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKCdbJyArIENPTVBPTkVOVF9BVFRSICsgJ10nKTtcbiAgICBpZiAoIWVscyB8fCAhZWxzLmxlbmd0aClcbiAgICAgIHJldHVybiBjYigpO1xuXG4gICAgY29uc3QgbGVuID0gZWxzLmxlbmd0aDtcbiAgICBsZXQgbmJDb21wbGV0ZSA9IDA7XG4gICAgZWxzLmZvckVhY2goZWwgPT4ge1xuICAgICAgY29uc3QgbmFtZSA9IGVsLmdldEF0dHJpYnV0ZShDT01QT05FTlRfQVRUUik7XG4gICAgICBjb25zdCBDbGFzcyA9IGtub3duQ29tcG9uZW50Q2xhc3Nlc1tuYW1lXTtcbiAgICAgIGNvbnN0IGMgPSBuZXcgQ2xhc3MobmFtZSwgZWwsIHRoaXMuYXBwLCB0aGlzKTtcbiAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjKTtcbiAgICAgIGMubG9hZCgoKSA9PiB7XG4gICAgICAgIGlmICgrK25iQ29tcGxldGUgPT09IGxlbilcbiAgICAgICAgICBjYigpO1xuICAgICAgfSwgcGFyYW0pO1xuICAgIH0pO1xuICB9XG5cbiAgbG9hZChjYiwgcGFyYW0pIHtcbiAgICBwYXJhbSA9IHBhcmFtIHx8IHt9O1xuICAgIHRoaXMuY29tcGxldGUgPSBmYWxzZTtcbiAgICB0aGlzLmdldERhdGEoZGF0YSA9PiB7XG4gICAgICAvLyBUT0RPIHJlbHkgb24gYXBwIHNpZGUgdG8gc2V0dXAgdGhlIHRlbXBsYXRlIGZ1bmN0aW9uIChtdXN0YWNoZSwgaGFuZGxlYmFyLCBldGMpXG4gICAgICB0aGlzLnJlbmRlcihkYXRhLCB0aGlzLnRlbXBsYXRlKTtcbiAgICAgIHRoaXMucmVuZGVyZWQoKCkgPT4ge1xuICAgICAgICB0aGlzLmxvYWRDaGlsZHJlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgaWYgKGNiKSBjYigpO1xuICAgICAgICB9LCBwYXJhbSlcbiAgICAgIH0sIHBhcmFtKTtcbiAgICB9LCBwYXJhbSlcbiAgfVxuXG4gIGRlc3Ryb3llZCgpIHtcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goYyA9PiB7XG4gICAgICBjLmRlc3Ryb3llZCgpO1xuICAgIH0pO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICB0aGlzLnRvcGljcy5mb3JFYWNoKHRvcGljID0+IHtcbiAgICAgIHRoaXMuYXBwLnVuc3Vic2NyaWJlKHRvcGljLCB0aGlzKTtcbiAgICB9KVxuICAgIHRoaXMudG9waWNzID0gW107XG4gIH1cblxuICBzdWJzY3JpYmUodG9waWMsIGNiKSB7XG4gICAgdGhpcy5hcHAuc3Vic2NyaWJlKHRvcGljLCBjYiwgdGhpcyk7XG4gICAgdGhpcy50b3BpY3MucHVzaCh0b3BpYyk7XG4gIH1cblxuICBwdWJsaXNoKHRvcGljLCBkYXRhKSB7XG4gICAgdGhpcy5hcHAucHVibGlzaCh0b3BpYywgZGF0YSwgdGhpcyk7XG4gIH1cblxuICAvLyBUaGVzZSAyIG1ldGhvZHMgYXJlIHRvIGJlIG92ZXJyaWRlZCBieSBlYWNoIGNvbXBvbmVudFxuICBnZXREYXRhKGNiKSB7XG4gICAgaWYgKGNiKSBjYih0aGlzLmRhdGEgfHwge30pO1xuICB9XG5cbiAgcmVuZGVyZWQoY2IpIHtcbiAgICBpZiAoY2IpIGNiKCk7XG4gIH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckNvbXBvbmVudChuYW1lLCBkZWYpIHtcbiAgY29uc3QgY2xzID0gY2xhc3MgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGVsLCBhcHAsIHBhcmVudCkge1xuICAgICAgc3VwZXIobmFtZSwgZWwsIGFwcCwgcGFyZW50KTtcbiAgICAgIGlmIChkZWYudGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IGRlZi50ZW1wbGF0ZTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWYuaW5pdCkge1xuICAgICAgICBkZWYuaW5pdC5iaW5kKHRoaXMpKCk7XG4gICAgICB9XG4gICAgICBpZiAoZGVmLmdldERhdGEpIHtcbiAgICAgICAgdGhpcy5nZXREYXRhID0gZGVmLmdldERhdGEuYmluZCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWYucmVuZGVyZWQpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlZCA9IGRlZi5yZW5kZXJlZC5iaW5kKHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBrbm93bkNvbXBvbmVudENsYXNzZXNbbmFtZV0gPSBjbHM7XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHAge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnRvcGljcyA9IHt9O1xuICB9XG5cbiAgc3RhcnQoZWwsIHBhcmFtKSB7XG4gICAgLy8gVE9ETzogcmVtb3ZlRXZlbnRMaXN0ZW5lciBzb21lIHdoZXJlXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgKGV2KSA9PiB7XG4gICAgICB0aGlzLnB1Ymxpc2goJ3BvcHN0YXRlJywgZXYpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgQ29tcG9uZW50KCcnLCBlbCwgdGhpcyk7XG4gICAgcm9vdC5sb2FkQ2hpbGRyZW4oKCkgPT4ge30sIHBhcmFtKTtcbiAgfVxuXG4gIHB1Ymxpc2godG9waWMsIGRhdGEsIHB1Ymxpc2hlcikge1xuICAgIGlmICghKHRvcGljIGluIHRoaXMudG9waWNzKSkge1xuICAgICAgdGhpcy50b3BpY3NbdG9waWNdID0ge1xuICAgICAgICBzdWJzY3JpYmVyczoge30sXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZW50cnkgPSB0aGlzLnRvcGljc1t0b3BpY107XG4gICAgT2JqZWN0LnZhbHVlcyhlbnRyeS5zdWJzY3JpYmVycykuZm9yRWFjaCgoY2IpID0+IHtcbiAgICAgIGNiKGRhdGEsIHB1Ymxpc2hlcik7XG4gICAgfSk7XG4gICAgZW50cnkuZGF0YSA9IGRhdGE7XG4gICAgZW50cnkucHVibGlzaGVyID0gcHVibGlzaGVyO1xuICB9XG5cbiAgc3Vic2NyaWJlKHRvcGljLCBjYiwgc3Vic2NyaWJlcikge1xuICAgIGlmICghKHRvcGljIGluIHRoaXMudG9waWNzKSkge1xuICAgICAgdGhpcy50b3BpY3NbdG9waWNdID0ge1xuICAgICAgICBzdWJzY3JpYmVyczoge30sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy50b3BpY3NbdG9waWNdO1xuICAgIGVudHJ5LnN1YnNjcmliZXJzW3N1YnNjcmliZXJdID0gY2I7XG4gICAgaWYgKGVudHJ5LnB1Ymxpc2hlcikge1xuICAgICAgY2IoZW50cnkuZGF0YSwgZW50cnkucHVibGlzaGVyKTtcbiAgICB9XG4gIH1cblxuICB1bnN1YnNjcmliZSh0b3BpYywgc3Vic2NyaWJlcikge1xuICAgIGlmICghKHRvcGljIGluIHRoaXMudG9waWNzKSlcbiAgICAgIHJldHVybjtcbiAgICBjb25zdCBzdWJzY3JpYmVycyA9IHRoaXMudG9waWNzW3RvcGljXS5zdWJzY3JpYmVycztcbiAgICBkZWxldGUgc3Vic2NyaWJlcnNbc3Vic2NyaWJlcl07XG4gIH1cbn07XG5cbiIsImltcG9ydCB7IHJlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQuanMnO1xuaW1wb3J0IEFwcCBmcm9tICcuL2FwcC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYXBwOiAobmFtZSkgPT4ge1xuICAgIHJldHVybiBuZXcgQXBwKG5hbWUpO1xuICB9LFxuICBjb21wb25lbnQ6IHJlZ2lzdGVyQ29tcG9uZW50LFxufTtcbiJdLCJuYW1lcyI6WyJDT01QT05FTlRfQVRUUiIsImtub3duQ29tcG9uZW50Q2xhc3NlcyIsIkNvbXBvbmVudCIsIm5hbWUiLCJlbCIsImFwcCIsInBhcmVudCIsImNvbXBsZXRlIiwiY2hpbGRyZW4iLCJ0b3BpY3MiLCJkYXRhIiwidGVtcGxhdGUiLCJpbm5lckhUTUwiLCJmb3JFYWNoIiwiYyIsImRlc3Ryb3llZCIsImNiIiwicGFyYW0iLCJlbHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwibGVuZ3RoIiwibGVuIiwibmJDb21wbGV0ZSIsImdldEF0dHJpYnV0ZSIsIkNsYXNzIiwicHVzaCIsImxvYWQiLCJnZXREYXRhIiwicmVuZGVyIiwicmVuZGVyZWQiLCJsb2FkQ2hpbGRyZW4iLCJ0b3BpYyIsInVuc3Vic2NyaWJlIiwic3Vic2NyaWJlIiwicHVibGlzaCIsInJlZ2lzdGVyQ29tcG9uZW50IiwiZGVmIiwiY2xzIiwiaW5pdCIsImJpbmQiLCJBcHAiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZXYiLCJyb290IiwicHVibGlzaGVyIiwic3Vic2NyaWJlcnMiLCJlbnRyeSIsIk9iamVjdCIsInZhbHVlcyIsInN1YnNjcmliZXIiLCJjb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQUEsSUFBTUEsY0FBYyxHQUFHLGdCQUF2QjtFQUNBLElBQU1DLHFCQUFxQixHQUFHLEVBQTlCO01BRWFDLFNBQWI7RUFDRSxxQkFBWUMsSUFBWixFQUFrQkMsRUFBbEIsRUFBc0JDLEdBQXRCLEVBQTJCQyxNQUEzQixFQUFtQztFQUFBOztFQUNqQyxTQUFLSCxJQUFMLEdBQVlBLElBQVo7RUFDQSxTQUFLQyxFQUFMLEdBQVVBLEVBQVY7RUFDQSxTQUFLQyxHQUFMLEdBQVdBLEdBQVg7RUFDQSxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7RUFDQSxTQUFLQyxRQUFMLEdBQWdCLEtBQWhCO0VBQ0EsU0FBS0MsUUFBTCxHQUFnQixFQUFoQjtFQUNBLFNBQUtDLE1BQUwsR0FBYyxFQUFkO0VBQ0Q7O0VBVEg7RUFBQTtFQUFBLFdBV0UsZ0JBQU9DLElBQVAsRUFBYUMsUUFBYixFQUF1QjtFQUNyQixXQUFLUCxFQUFMLENBQVFRLFNBQVIsR0FBb0JELFFBQVEsQ0FBQ0QsSUFBRCxDQUE1QjtFQUNBLFdBQUtGLFFBQUwsQ0FBY0ssT0FBZCxDQUFzQixVQUFBQyxDQUFDLEVBQUk7RUFDekJBLFFBQUFBLENBQUMsQ0FBQ0MsU0FBRjtFQUNELE9BRkQ7RUFHQSxXQUFLUCxRQUFMLEdBQWdCLEVBQWhCO0VBQ0Q7RUFqQkg7RUFBQTtFQUFBLFdBbUJFLHNCQUFhUSxFQUFiLEVBQWlCQyxLQUFqQixFQUF3QjtFQUFBOztFQUN0QixVQUFNQyxH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
