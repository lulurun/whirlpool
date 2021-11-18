
  /**
   * @license
   * W.js v2.0.1
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

  var knownComponentClasses = {};
  var Component = /*#__PURE__*/function () {
    function Component(name, el, app, parent) {
      _classCallCheck(this, Component);

      this.name = name;
      this.el = el;
      this.app = app;
      this.complete = false;
      this.parent = parent;
      this.children = [];
      this.topics = [];
    }

    _createClass(Component, [{
      key: "render",
      value: function render(data, template, param) {
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

        var els = this.el.querySelectorAll('[data-component]');
        if (!els || !els.length) return cb();
        var len = els.length;
        var nbComplete = 0;
        els.forEach(function (el) {
          var name = el.getAttribute('data-component');
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
          _this2.render(data, _this2.template, param);

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
          _this3.app.off(topic, _this3);
        });
        this.topics = [];
      }
    }, {
      key: "on",
      value: function on(topic, cb) {
        this.app.on(topic, cb, this);
        this.topics.push(topic);
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

      function cls(name, el, parent) {
        var _this4;

        _classCallCheck(this, cls);

        _this4 = _super.call(this, name, el, parent);

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
          _this.trigger('popstate', ev);
        });
        var root = new Component('', el, this);
        root.loadChildren(function () {}, param);
      }
    }, {
      key: "trigger",
      value: function trigger(topic, data, publisher) {
        if (!(topic in this.topics)) return;

        for (var s in this.topics[topic]) {
          this.topics[topic][s](topic, data, publisher);
        }
      }
    }, {
      key: "on",
      value: function on(topic, cb, subscriber) {
        if (!(topic in this.topics)) this.topics[topic] = {};
        this.topics[topic][subscriber] = cb;
      }
    }, {
      key: "off",
      value: function off(topic, subscriber) {
        if (!(topic in this.topics)) return;
        var subscribers = this.topics[topic];
        delete subscribers[subscriber];
        if (subscribers.length === 0) delete this.topics[topic];
      }
    }]);

    return App;
  }();

  var index = {
    // entry point to kick-off the application
    app: function app(name) {
      return new App(name);
    },
    component: registerComponent
  };

  return index;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2hpcmxwb29sLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50LmpzIiwiLi4vc3JjL2FwcC5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBrbm93bkNvbXBvbmVudENsYXNzZXMgPSB7fTtcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGVsLCBhcHAsIHBhcmVudCkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMuYXBwID0gYXBwO1xuICAgIHRoaXMuY29tcGxldGUgPSBmYWxzZTtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy50b3BpY3MgPSBbXTtcbiAgfVxuXG4gIHJlbmRlcihkYXRhLCB0ZW1wbGF0ZSwgcGFyYW0pIHtcbiAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRlbXBsYXRlKGRhdGEpO1xuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjID0+IHtcbiAgICAgIGMuZGVzdHJveWVkKCk7XG4gICAgfSk7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICB9XG5cbiAgbG9hZENoaWxkcmVuKGNiLCBwYXJhbSkge1xuICAgIGNvbnN0IGVscyA9IHRoaXMuZWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY29tcG9uZW50XScpO1xuICAgIGlmICghZWxzIHx8ICFlbHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIGNiKCk7XG5cbiAgICBjb25zdCBsZW4gPSBlbHMubGVuZ3RoO1xuICAgIGxldCBuYkNvbXBsZXRlID0gMDtcbiAgICBlbHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICBjb25zdCBuYW1lID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbXBvbmVudCcpO1xuICAgICAgY29uc3QgQ2xhc3MgPSBrbm93bkNvbXBvbmVudENsYXNzZXNbbmFtZV07XG4gICAgICBjb25zdCBjID0gbmV3IENsYXNzKG5hbWUsIGVsLCB0aGlzLmFwcCwgdGhpcyk7XG4gICAgICB0aGlzLmNoaWxkcmVuLnB1c2goYyk7XG4gICAgICBjLmxvYWQoKCkgPT4ge1xuICAgICAgICBpZiAoKytuYkNvbXBsZXRlID09PSBsZW4pXG4gICAgICAgICAgY2IoKTtcbiAgICAgIH0sIHBhcmFtKTtcbiAgICB9KTtcbiAgfVxuXG4gIGxvYWQoY2IsIHBhcmFtKSB7XG4gICAgcGFyYW0gPSBwYXJhbSB8fCB7fTtcbiAgICB0aGlzLmNvbXBsZXRlID0gZmFsc2U7XG4gICAgdGhpcy5nZXREYXRhKGRhdGEgPT4ge1xuICAgICAgdGhpcy5yZW5kZXIoZGF0YSwgdGhpcy50ZW1wbGF0ZSwgcGFyYW0pO1xuICAgICAgdGhpcy5yZW5kZXJlZCgoKSA9PiB7XG4gICAgICAgIHRoaXMubG9hZENoaWxkcmVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoY2IpIGNiKCk7XG4gICAgICAgIH0sIHBhcmFtKVxuICAgICAgfSwgcGFyYW0pO1xuICAgIH0sIHBhcmFtKVxuICB9XG5cbiAgZGVzdHJveWVkKCkge1xuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjID0+IHtcbiAgICAgIGMuZGVzdHJveWVkKCk7XG4gICAgfSk7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMudG9waWNzLmZvckVhY2godG9waWMgPT4ge1xuICAgICAgdGhpcy5hcHAub2ZmKHRvcGljLCB0aGlzKTtcbiAgICB9KVxuICAgIHRoaXMudG9waWNzID0gW107XG4gIH1cblxuICBvbih0b3BpYywgY2IpIHtcbiAgICB0aGlzLmFwcC5vbih0b3BpYywgY2IsIHRoaXMpO1xuICAgIHRoaXMudG9waWNzLnB1c2godG9waWMpO1xuICB9XG5cbiAgLy8gVGhlc2UgMiBtZXRob2RzIGFyZSB0byBiZSBvdmVycmlkZWQgYnkgZWFjaCBjb21wb25lbnRcbiAgZ2V0RGF0YShjYikge1xuICAgIGlmIChjYikgY2IodGhpcy5kYXRhIHx8IHt9KTtcbiAgfVxuXG4gIHJlbmRlcmVkKGNiKSB7XG4gICAgaWYgKGNiKSBjYigpO1xuICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnQobmFtZSwgZGVmKSB7XG4gIGNvbnN0IGNscyA9IGNsYXNzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBlbCwgcGFyZW50KSB7XG4gICAgICBzdXBlcihuYW1lLCBlbCwgcGFyZW50KTtcbiAgICAgIGlmIChkZWYudGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IGRlZi50ZW1wbGF0ZTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWYuaW5pdCkge1xuICAgICAgICBkZWYuaW5pdC5iaW5kKHRoaXMpKCk7XG4gICAgICB9XG4gICAgICBpZiAoZGVmLmdldERhdGEpIHtcbiAgICAgICAgdGhpcy5nZXREYXRhID0gZGVmLmdldERhdGEuYmluZCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWYucmVuZGVyZWQpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlZCA9IGRlZi5yZW5kZXJlZC5iaW5kKHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBrbm93bkNvbXBvbmVudENsYXNzZXNbbmFtZV0gPSBjbHM7XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHAge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnRvcGljcyA9IHt9O1xuICB9XG5cbiAgc3RhcnQoZWwsIHBhcmFtKSB7XG4gICAgLy8gVE9ETzogcmVtb3ZlRXZlbnRMaXN0ZW5lciBzb21lIHdoZXJlXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgKGV2KSA9PiB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ3BvcHN0YXRlJywgZXYpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgQ29tcG9uZW50KCcnLCBlbCwgdGhpcyk7XG4gICAgcm9vdC5sb2FkQ2hpbGRyZW4oKCkgPT4ge30sIHBhcmFtKTtcbiAgfVxuXG4gIHRyaWdnZXIodG9waWMsIGRhdGEsIHB1Ymxpc2hlcikge1xuICAgIGlmICghKHRvcGljIGluIHRoaXMudG9waWNzKSlcbiAgICAgIHJldHVybjtcbiAgICBmb3IgKGxldCBzIGluIHRoaXMudG9waWNzW3RvcGljXSkge1xuICAgICAgdGhpcy50b3BpY3NbdG9waWNdW3NdKHRvcGljLCBkYXRhLCBwdWJsaXNoZXIpO1xuICAgIH1cbiAgfVxuXG4gIG9uKHRvcGljLCBjYiwgc3Vic2NyaWJlcikge1xuICAgIGlmICghKHRvcGljIGluIHRoaXMudG9waWNzKSlcbiAgICAgIHRoaXMudG9waWNzW3RvcGljXSA9IHt9O1xuICAgIHRoaXMudG9waWNzW3RvcGljXVtzdWJzY3JpYmVyXSA9IGNiO1xuICB9XG5cbiAgb2ZmKHRvcGljLCBzdWJzY3JpYmVyKSB7XG4gICAgaWYgKCEodG9waWMgaW4gdGhpcy50b3BpY3MpKVxuICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IHN1YnNjcmliZXJzID0gdGhpcy50b3BpY3NbdG9waWNdO1xuICAgIGRlbGV0ZSBzdWJzY3JpYmVyc1tzdWJzY3JpYmVyXTtcbiAgICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKVxuICAgICAgZGVsZXRlIHRoaXMudG9waWNzW3RvcGljXTtcbiAgfVxufTtcblxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCByZWdpc3RlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50LmpzJztcbmltcG9ydCBBcHAgZnJvbSAnLi9hcHAuanMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8vIGVudHJ5IHBvaW50IHRvIGtpY2stb2ZmIHRoZSBhcHBsaWNhdGlvblxuICBhcHA6IChuYW1lKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBBcHAobmFtZSk7XG4gIH0sXG4gIGNvbXBvbmVudDogcmVnaXN0ZXJDb21wb25lbnQsXG59O1xuIl0sIm5hbWVzIjpbImtub3duQ29tcG9uZW50Q2xhc3NlcyIsIkNvbXBvbmVudCIsIm5hbWUiLCJlbCIsImFwcCIsInBhcmVudCIsImNvbXBsZXRlIiwiY2hpbGRyZW4iLCJ0b3BpY3MiLCJkYXRhIiwidGVtcGxhdGUiLCJwYXJhbSIsImlubmVySFRNTCIsImZvckVhY2giLCJjIiwiZGVzdHJveWVkIiwiY2IiLCJlbHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwibGVuZ3RoIiwibGVuIiwibmJDb21wbGV0ZSIsImdldEF0dHJpYnV0ZSIsIkNsYXNzIiwicHVzaCIsImxvYWQiLCJnZXREYXRhIiwicmVuZGVyIiwicmVuZGVyZWQiLCJsb2FkQ2hpbGRyZW4iLCJ0b3BpYyIsIm9mZiIsIm9uIiwicmVnaXN0ZXJDb21wb25lbnQiLCJkZWYiLCJjbHMiLCJpbml0IiwiYmluZCIsIkFwcCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJldiIsInRyaWdnZXIiLCJyb290IiwicHVibGlzaGVyIiwicyIsInN1YnNjcmliZXIiLCJzdWJzY3JpYmVycyIsImNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFBQSxJQUFNQSxxQkFBcUIsR0FBRyxFQUE5QjtNQUVhQyxTQUFiO0VBQ0UscUJBQVlDLElBQVosRUFBa0JDLEVBQWxCLEVBQXNCQyxHQUF0QixFQUEyQkMsTUFBM0IsRUFBbUM7RUFBQTs7RUFDakMsU0FBS0gsSUFBTCxHQUFZQSxJQUFaO0VBQ0EsU0FBS0MsRUFBTCxHQUFVQSxFQUFWO0VBQ0EsU0FBS0MsR0FBTCxHQUFXQSxHQUFYO0VBQ0EsU0FBS0UsUUFBTCxHQUFnQixLQUFoQjtFQUNBLFNBQUtELE1BQUwsR0FBY0EsTUFBZDtFQUNBLFNBQUtFLFFBQUwsR0FBZ0IsRUFBaEI7RUFDQSxTQUFLQyxNQUFMLEdBQWMsRUFBZDtFQUNEOztFQVRIO0VBQUE7RUFBQSxXQVdFLGdCQUFPQyxJQUFQLEVBQWFDLFFBQWIsRUFBdUJDLEtBQXZCLEVBQThCO0VBQzVCLFdBQUtSLEVBQUwsQ0FBUVMsU0FBUixHQUFvQkYsUUFBUSxDQUFDRCxJQUFELENBQTVCO0VBQ0EsV0FBS0YsUUFBTCxDQUFjTSxPQUFkLENBQXNCLFVBQUFDLENBQUMsRUFBSTtFQUN6QkEsUUFBQUEsQ0FBQyxDQUFDQyxTQUFGO0VBQ0QsT0FGRDtFQUdBLFdBQUtSLFFBQUwsR0FBZ0IsRUFBaEI7RUFDRDtFQWpCSDtFQUFBO0VBQUEsV0FtQkUsc0JBQWFTLEVBQWIsRUFBaUJMLEtBQWpCLEVBQXdCO0VBQUE7O0VBQ3RCLFVBQU1NLEdBQUcsR0FBRyxLQUFLZCxFQUFMLENBQVFlLGdCQUFSLENBQXlCLGtCQUF6QixDQUFaO0VBQ0EsVUFBSSxDQUFDRCxHQUFELElBQVEsQ0FBQ0EsR0FBRyxDQUFDRSxNQUFqQixFQUNFLE9BQU9ILEVBQUUsRUFBVDtFQUVGLFVBQU1JLEdBQUcsR0FBR0gsR0FBRyxDQUFDRSxNQUFoQjtFQUNBLFVBQUlFLFVBQVUsR0FBRyxDQUFqQjtFQUNBSixNQUFBQSxHQUFHLENBQUNKLE9BQUosQ0FBWSxVQUFBVixFQUFFLEVBQUk7RUFDaEIsWUFBTUQsSUFBSSxHQUFHQyxFQUFFLENBQUNtQixZQUFILENBQWdCLGdCQUFoQixDQUFiO0VBQ0EsWUFBTUMsS0FBSyxHQUFHdkIscUJBQXFCLENBQUNFLElBQUQsQ0FBbkM7RUFDQSxZQUFNWSxDQUFDLEdBQUcsSUFBSVMsS0FBSixDQUFVckIsSUFBVixFQUFnQkMsRUFBaEIsRUFBb0IsS0FBSSxDQUFDQyxHQUF6QixFQUE4QixLQUE5QixDQUFWOztFQUNBLFFBQUEsS0FBSSxDQUFDRyxRQUFMLENBQWNpQixJQUFkLENBQW1CVixDQUFuQjs7RUFDQUEsUUFBQUEsQ0FBQyxDQUFDVyxJQUFGLENBQU8sWUFBTTtFQUNYLGNBQUksRUFBRUosVUFBRixLQUFpQkQsR0FBckIsRUFDRUosRUFBRTtFQUNMLFNBSEQsRUFHR0wsS0FISDtFQUlELE9BVEQ7RUFVRDtFQXBDSDtFQUFBO0VBQUEsV0FzQ0UsY0FBS0ssRUFBTCxFQUFTTCxLQUFULEVBQWdCO0VBQUE7O0VBQ2RBLE1BQUFBLEtBQUssR0FBR0EsS0FBSyxJQUFJLEVBQWpCO0VBQ0EsV0FBS0wsUUFBTCxHQUFnQixLQUFoQjtFQUNBLFdBQUtvQixPQUFMLENBQWEsVUFBQWpCLElBQUksRUFBSTtFQUNuQixRQUFBLE1BQUksQ0FBQ2tCLE1BQUwsQ0FBWWxCLElBQVosRUFBa0IsTUFBSSxDQUFDQyxRQUF2QixFQUFpQ0MsS0FBakM7O0VBQ0EsUUFBQSxNQUFJLENBQUNpQixRQUFMLENBQWMsWUFBTTtFQUNsQixVQUFBLE1BQUksQ0FBQ0MsWUFBTCxDQUFrQixZQUFNO0VBQ3RCLFlBQUEsTUFBSSxDQUFDdkIsUUFBTCxHQUFnQixJQUFoQjtFQUNBLGdCQUFJVSxFQUFKLEVBQVFBLEVBQUU7RUFDWCxXQUhELEVBR0dMLEtBSEg7RUFJRCxTQUxELEVBS0dBLEtBTEg7RUFNRCxPQVJELEVBUUdBLEtBUkg7RUFTRDtFQWxESDtFQUFBO0VBQUEsV0FvREUscUJBQVk7RUFBQTs7RUFDVixXQUFLSixRQUFMLENBQWNNLE9BQWQsQ0FBc0IsVUFBQUMsQ0FBQyxFQUFJO0VBQ3pCQSxRQUFBQSxDQUFDLENBQUNDLFNBQUY7RUFDRCxPQUZEO0VBR0EsV0FBS1IsUUFBTCxHQUFnQixFQUFoQjtFQUNBLFdBQUtDLE1BQUwsQ0FBWUssT0FBWixDQUFvQixVQUFBaUIsS0FBSyxFQUFJO0VBQzNCLFFBQUEsTUFBSSxDQUFDMUIsR0FBTCxDQUFTMkIsR0FBVCxDQUFhRCxLQUFiLEVBQW9CLE1BQXBCO0VBQ0QsT0FGRDtFQUdBLFdBQUt0QixNQUFMLEdBQWMsRUFBZDtFQUNEO0VBN0RIO0VBQUE7RUFBQSxXQStERSxZQUFHc0IsS0FBSCxFQUFVZCxFQUFWLEVBQWM7RUFDWixXQUFLWixHQUFMLENBQVM0QixFQUFULENBQVlGLEtBQVosRUFBbUJkLEVBQW5CLEVBQXVCLElBQXZCO0VBQ0EsV0FBS1IsTUFBTCxDQUFZZ0IsSUFBWixDQUFpQk0sS0FBakI7RUFDRCxLQWxFSDs7RUFBQTtFQUFBO0VBQUEsV0FxRUUsaUJBQVFkLEVBQVIsRUFBWTtFQUNWLFVBQUlBLEVBQUosRUFBUUEsRUFBRSxDQUFDLEtBQUtQLElBQUwsSUFBYSxFQUFkLENBQUY7RUFDVDtFQXZFSDtFQUFBO0VBQUEsV0F5RUUsa0JBQVNPLEVBQVQsRUFBYTtFQUNYLFVBQUlBLEVBQUosRUFBUUEsRUFBRTtFQUNYO0VBM0VIOztFQUFBO0VBQUE7RUE4RU8sU0FBU2lCLGlCQUFULENBQTJCL0IsSUFBM0IsRUFBaUNnQyxHQUFqQyxFQUFzQztFQUMzQyxNQUFNQyxHQUFHO0VBQUE7O0VBQUE7O0VBQ1AsaUJBQVlqQyxJQUFaLEVBQWtCQyxFQUFsQixFQUFzQkUsTUFBdEIsRUFBOEI7RUFBQTs7RUFBQTs7RUFDNUIsaUNBQU1ILElBQU4sRUFBWUMsRUFBWixFQUFnQkUsTUFBaEI7O0VBQ0EsVUFBSTZCLEdBQUcsQ0FBQ3hCLFFBQVIsRUFBa0I7RUFDaEIsZUFBS0EsUUFBTCxHQUFnQndCLEdBQUcsQ0FBQ3hCLFFBQXBCO0VBQ0Q7O0VBQ0QsVUFBSXdCLEdBQUcsQ0FBQ0UsSUFBUixFQUFjO0VBQ1pGLFFBQUFBLEdBQUcsQ0FBQ0UsSUFBSixDQUFTQyxJQUFUO0VBQ0Q7O0VBQ0QsVUFBSUgsR0FBRyxDQUFDUixPQUFSLEVBQWlCO0VBQ2YsZUFBS0EsT0FBTCxHQUFlUSxHQUFHLENBQUNSLE9BQUosQ0FBWVcsSUFBWixnQ0FBZjtFQUNEOztFQUNELFVBQUlILEdBQUcsQ0FBQ04sUUFBUixFQUFrQjtFQUNoQixlQUFLQSxRQUFMLEdBQWdCTSxHQUFHLENBQUNOLFFBQUosQ0FBYVMsSUFBYixnQ0FBaEI7RUFDRDs7RUFiMkI7RUFjN0I7O0VBZk07RUFBQSxJQUFpQnBDLFNBQWpCLENBQVQ7O0VBaUJBRCxFQUFBQSxxQkFBcUIsQ0FBQ0UsSUFBRCxDQUFyQixHQUE4QmlDLEdBQTlCO0VBQ0Q7O01DakdvQkc7RUFDbkIsZUFBWXBDLElBQVosRUFBa0I7RUFBQTs7RUFDaEIsU0FBS0EsSUFBTCxHQUFZQSxJQUFaO0VBQ0EsU0FBS00sTUFBTCxHQUFjLEVBQWQ7RUFDRDs7OzthQUVELGVBQU1MLEVBQU4sRUFBVVEsS0FBVixFQUFpQjtFQUFBOztFQUNmO0VBQ0E0QixNQUFBQSxNQUFNLENBQUNDLGdCQUFQLENBQXdCLFVBQXhCLEVBQW9DLFVBQUNDLEVBQUQsRUFBUTtFQUMxQyxRQUFBLEtBQUksQ0FBQ0MsT0FBTCxDQUFhLFVBQWIsRUFBeUJELEVBQXpCO0VBQ0QsT0FGRDtFQUdBLFVBQU1FLElBQUksR0FBRyxJQUFJMUMsU0FBSixDQUFjLEVBQWQsRUFBa0JFLEVBQWxCLEVBQXNCLElBQXRCLENBQWI7RUFDQXdDLE1BQUFBLElBQUksQ0FBQ2QsWUFBTCxDQUFrQixZQUFNLEVBQXhCLEVBQTRCbEIsS0FBNUI7RUFDRDs7O2FBRUQsaUJBQVFtQixLQUFSLEVBQWVyQixJQUFmLEVBQXFCbUMsU0FBckIsRUFBZ0M7RUFDOUIsVUFBSSxFQUFFZCxLQUFLLElBQUksS0FBS3RCLE1BQWhCLENBQUosRUFDRTs7RUFDRixXQUFLLElBQUlxQyxDQUFULElBQWMsS0FBS3JDLE1BQUwsQ0FBWXNCLEtBQVosQ0FBZCxFQUFrQztFQUNoQyxhQUFLdEIsTUFBTCxDQUFZc0IsS0FBWixFQUFtQmUsQ0FBbkIsRUFBc0JmLEtBQXRCLEVBQTZCckIsSUFBN0IsRUFBbUNtQyxTQUFuQztFQUNEO0VBQ0Y7OzthQUVELFlBQUdkLEtBQUgsRUFBVWQsRUFBVixFQUFjOEIsVUFBZCxFQUEwQjtFQUN4QixVQUFJLEVBQUVoQixLQUFLLElBQUksS0FBS3RCLE1BQWhCLENBQUosRUFDRSxLQUFLQSxNQUFMLENBQVlzQixLQUFaLElBQXFCLEVBQXJCO0VBQ0YsV0FBS3RCLE1BQUwsQ0FBWXNCLEtBQVosRUFBbUJnQixVQUFuQixJQUFpQzlCLEVBQWpDO0VBQ0Q7OzthQUVELGFBQUljLEtBQUosRUFBV2dCLFVBQVgsRUFBdUI7RUFDckIsVUFBSSxFQUFFaEIsS0FBSyxJQUFJLEtBQUt0QixNQUFoQixDQUFKLEVBQ0U7RUFDRixVQUFNdUMsV0FBVyxHQUFHLEtBQUt2QyxNQUFMLENBQVlzQixLQUFaLENBQXBCO0VBQ0EsYUFBT2lCLFdBQVcsQ0FBQ0QsVUFBRCxDQUFsQjtFQUNBLFVBQUlDLFdBQVcsQ0FBQzVCLE1BQVosS0FBdUIsQ0FBM0IsRUFDRSxPQUFPLEtBQUtYLE1BQUwsQ0FBWXNCLEtBQVosQ0FBUDtFQUNIOzs7Ozs7QUNuQ0gsY0FBZTtFQUNiO0VBQ0ExQixFQUFBQSxHQUFHLEVBQUUsYUFBQ0YsSUFBRCxFQUFVO0VBQ2IsV0FBTyxJQUFJb0MsR0FBSixDQUFRcEMsSUFBUixDQUFQO0VBQ0QsR0FKWTtFQUtiOEMsRUFBQUEsU0FBUyxFQUFFZjtFQUxFLENBQWY7Ozs7Ozs7OyJ9
