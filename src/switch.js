import factory from './factory.js';

const DEFAULT_COMPONENT_ATTR = 'data-default-component';
const CURRENT_COMPONENT_ATTR = 'data-current-component';

export class Switch {
  constructor(name, el, app, parent) {
    this.name = name;
    this.el = el;
    this.app = app;
    this.parent = parent;
    this.currentComponent = null;
    this.defaultComponentName = el.getAttribute(DEFAULT_COMPONENT_ATTR);

    this.app.subscribe(this.name + '.current', (name) => {
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
      this.el.setAttribute(CURRENT_COMPONENT_ATTR, componentName);
      cb();
    }, param);
  }

  destroyed() {
    if (this.currentComponent) this.currentComponent.destroyed();
    this.currentComponent = null;
    this.app.unsubscribe(this.name + '.current', this);
  }
}

export function registerSwitch(name) {
  const cls = class extends Switch {
    constructor(name, el, app, parent) {
      super(name, el, app, parent);
    }
  }
  factory.add(name, cls);
};
