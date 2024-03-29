import factory from './factory.js';

const DEFAULT_ATTR = 'data-default';
const CURRENT_ATTR = 'data-current';
const TOPIC_SUFFIX = '.current';

export class Switch {
  constructor(name, el, app, parent) {
    this.name = name;
    this.el = el;
    this.app = app;
    this.parent = parent;
    this.currentComponent = null;
    this.defaultComponentName = el.getAttribute(DEFAULT_ATTR);

    this.app.subscribe(this.name + TOPIC_SUFFIX, (name) => {
      if (this.currentComponent && this.currentComponent.name === name) return;
      this.load(() => {}, { name: name });
    }, this);

  }

  load(cb, param) {
    param = param || {};
    const componentName = param.name || this.defaultComponentName;

    const c = factory.createInstance(componentName, this.el, this.app, this);
    if (!c) return cb();
    c.load(() => {
      if (this.currentComponent) this.currentComponent.destroyed();
      this.currentComponent = c;
      this.el.setAttribute(CURRENT_ATTR, componentName);
      cb();
    }, param);
  }

  destroyed() {
    if (this.currentComponent) this.currentComponent.destroyed();
    this.currentComponent = null;
    this.app.unsubscribe(this.name + TOPIC_SUFFIX, this);
  }
}

export function registerSwitch(name, defaultComponentName) {
  const cls = class extends Switch {
    constructor(name, el, app, parent) {
      super(name, el, app, parent);
      if (defaultComponentName) {
        this.defaultComponentName = defaultComponentName;
      }
    }
  }
  factory.add(name, cls);
};
