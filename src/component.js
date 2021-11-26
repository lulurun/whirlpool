import factory from './factory.js';

const COMPONENT_ATTR = 'data-component';

export class Component {
  constructor(name, el, app, parent) {
    this.name = name;
    this.el = el;
    this.app = app;
    this.parent = parent;
    this.children = [];
    this.topics = [];
  }

  loadChildren(cb, param) {
    const els = this.el.querySelectorAll('[' + COMPONENT_ATTR + ']');
    if (!els || !els.length)
      return cb();

    const len = els.length;
    let nbComplete = 0;
    els.forEach(el => {
      const name = el.getAttribute(COMPONENT_ATTR);
      const c = factory.createInstance(name, el, this.app, this);
      if (c) {
        this.children.push(c);
        c.load(() => {
          if (++nbComplete === len)
            cb();
        }, param);
      } else {
        if (++nbComplete === len)
        cb();
      }
    });
  }

  load(cb, param) {
    param = param || {};
    this.complete = false;
    this.getData(data => {
      this.getTemplate((template) => {
        // render
        this.el.innerHTML = template(data);
        this.children.forEach(c => {
          c.destroyed();
        });
        this.children = [];
        // after render
        this.rendered(() => {
          this.loadChildren(() => {
            this.complete = true;
            if (cb) cb();
          }, param)
        }, param);
      });
    }, param)
  }

  destroyed() {
    this.children.forEach(c => {
      c.destroyed();
    });
    this.children = [];
    this.topics.forEach(topic => {
      this.app.unsubscribe(topic, this);
    })
    this.topics = [];
  }

  subscribe(topic, cb) {
    this.app.subscribe(topic, cb, this);
    this.topics.push(topic);
  }

  publish(topic, data) {
    this.app.publish(topic, data, this);
  }

  // These 2 methods are to be overrided by each component
  getData(cb) {
    if (cb) cb(this.data || {});
  }

  getTemplate(cb) {
    if (cb) cb(this.template || (() => ''));
  }

  rendered(cb) {
    if (cb) cb();
  }
};

export function registerComponent(name, def) {
  const cls = class extends Component {
    constructor(name, el, app, parent) {
      super(name, el, app, parent);
      if (def.init) {
        def.init.bind(this)();
      }

      if (def.template) {
        this.template = def.template;
      } else if (app.getTemplate) {
        this.getTemplate = (cb) => {
          app.getTemplate(this.name, cb);
        };
      }
      if (def.getData) {
        this.getData = def.getData.bind(this);
      }
      if (def.rendered) {
        this.rendered = def.rendered.bind(this);
      }
    }
  }
  factory.add(name, cls);
};
