import factory from './factory.js';

const COMPONENT_ATTR = 'data-component';

export class Component {
  constructor(name, el, app, parent) {
    this.name = name;
    this.el = el;
    this.app = app;
    this.parent = parent;
    this.children = [];
    this.complete = true;
    this.loadCallbacks = [];
  }

  loadChildren(cb) {
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
        });
      } else {
        if (++nbComplete === len)
        cb();
      }
    });
  }

  load(cb) {
    if (cb) this.loadCallbacks.push(cb);
    if (!this.complete) return;

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
            this.loadCallbacks.forEach(cb => cb());
            this.loadCallbacks = [];
          })
        });
      });
    });
  }

  destroyed() {
    this.children.forEach(c => {
      c.destroyed();
    });
    this.children = [];
    this.app.ev.remove(this);
    this.cleanup();
  }

  // Below methods are to be overrided by each component
  getData(cb) {
    if (cb) cb(this.data || {});
  }

  getTemplate(cb) {
    if (cb) cb(this.template || (() => ''));
  }

  rendered(cb) {
    if (cb) cb();
  }

  cleanup() {}
}

export function registerComponent(name, def) {
  const cls = class extends Component {
    constructor(name, el, app, parent) {
      super(name, el, app, parent);
      if (app.getTemplate) {
        this.getTemplate = (cb) => {
          app.getTemplate(this.name, cb);
        };
      }
      if (!def) {
        return;
      }
      if (def.init) {
        def.init.bind(this)();
      }
      if (def.getData) {
        this.getData = def.getData.bind(this);
      }
      if (def.rendered) {
        this.rendered = def.rendered.bind(this);
      }
      if (def.cleanup) {
        this.cleanup = def.cleanup.bind(this);
      }
    }
  }
  factory.add(name, cls);
}
