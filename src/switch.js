import factory from './factory.js';

const DEFAULT_ATTR = 'data-default';
const CURRENT_ATTR = 'data-current';
const _RE = /^#([^\/]+)/;

export class Switch {
  constructor(name, el, app, parent) {
    this.name = name;
    this.el = el;
    this.app = app;
    this.parent = parent;
    this.currentComponent = null;
    this.defaultComponentName = el.getAttribute(DEFAULT_ATTR);
    this.app.nav.on(() => {
      this.load();
    });
  }

  getComponentName(path) {
    const match = _RE.exec(path);
    const componentKey = (match && match[1]) || '';
    if (!(componentKey in this.knownComponents)) {
      return this.defaultComponentName;
    }
    return this.knownComponents[componentKey];
  }

  load(cb, param) {
    const componentName = this.getComponentName(location.hash);
    if (this.currentComponent && this.currentComponent.name === componentName) return;

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
    this.app.unsubscribe(POPSTATE_EVENT, this);
  }
}

export function registerSwitch(name, def) {
  const cls = class extends Switch {
    constructor(name, el, app, parent) {
      super(name, el, app, parent);
      if (!def) {
        return;
      }
      if (def.knownComponents) {
        this.knownComponents = def.knownComponents;
      }
      if (def.getComponentName) {
        this.getComponentName = def.getComponentName.bind(this);
      }
    }
  };
  factory.add(name, cls);
};
