const COMPONENT_ATTR = 'data-component';
const knownComponentClasses = {};

export class Component {
  constructor(name, el, app, parent) {
    this.name = name;
    this.el = el;
    this.app = app;
    this.parent = parent;
    this.complete = false;
    this.children = [];
    this.topics = [];
  }

  render(data, template) {
    this.el.innerHTML = template(data);
    this.children.forEach(c => {
      c.destroyed();
    });
    this.children = [];
  }

  loadChildren(cb, param) {
    const els = this.el.querySelectorAll('[' + COMPONENT_ATTR + ']');
    if (!els || !els.length)
      return cb();

    const len = els.length;
    let nbComplete = 0;
    els.forEach(el => {
      const name = el.getAttribute(COMPONENT_ATTR);
      if (name in knownComponentClasses) {
        const Class = knownComponentClasses[name];
        const c = new Class(name, el, this.app, this);
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
      // TODO rely on app side to setup the template function (mustache, handlebar, etc)
      this.render(data, this.template);
      this.rendered(() => {
        this.loadChildren(() => {
          this.complete = true;
          if (cb) cb();
        }, param)
      }, param);
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

  rendered(cb) {
    if (cb) cb();
  }
};

export function registerComponent(name, def) {
  const cls = class extends Component {
    constructor(name, el, app, parent) {
      super(name, el, app, parent);
      this.template = def.template || (() => '');
      if (def.init) {
        def.init.bind(this)();
      }
      if (def.getData) {
        this.getData = def.getData.bind(this);
      }
      if (def.rendered) {
        this.rendered = def.rendered.bind(this);
      }
    }
  }
  knownComponentClasses[name] = cls;
};
