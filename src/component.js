const knownComponentClasses = {};

export class Component {
  constructor(name, el, app, parent) {
    this.name = name;
    this.el = el;
    this.app = app;
    this.complete = false;
    this.parent = parent;
    this.children = [];
    this.topics = [];
  }

  render(data, template, param) {
    this.el.innerHTML = template(data);
    this.children.forEach(c => {
      c.destroyed();
    });
    this.children = [];
  }

  loadChildren(cb, param) {
    const els = this.el.querySelectorAll('[data-component]');
    if (!els || !els.length)
      return cb();

    const len = els.length;
    let nbComplete = 0;
    els.forEach(el => {
      const name = el.getAttribute('data-component');
      const Class = knownComponentClasses[name];
      const c = new Class(name, el, this.app, this);
      this.children.push(c);
      c.load(() => {
        if (++nbComplete === len)
          cb();
      }, param);
    });
  }

  load(cb, param) {
    param = param || {};
    this.complete = false;
    this.getData(data => {
      // TODO rely on app side to setup the template function (mustache, handlebar, etc)
      this.render(data, this.template, param);
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
      this.app.off(topic, this);
    })
    this.topics = [];
  }

  on(topic, cb) {
    this.app.on(topic, cb, this);
    this.topics.push(topic);
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
    constructor(name, el, parent) {
      super(name, el, parent);
      if (def.template) {
        this.template = def.template;
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
    }
  }
  knownComponentClasses[name] = cls;
};
