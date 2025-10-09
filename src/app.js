import { Component } from './component.js';

const DATA_UPDATED_EVENT = 'data.updated.';
const POPSTATE_EVENT = 'app.popstate';

class EventBus {
  constructor() {
    this.events = new Map();
  }

  getOrCreate(event) {
    if (!this.events.has(event)) {
      this.events.set(event, new Map());
    }
    return this.events.get(event);
  }

  emit(event, data, emitter) {
    const listeners = this.getOrCreate(event);
    for (let handler of listeners.values()) {
      handler(data, emitter);
    }
  }

  on(event, handler, listener) {
    const listeners = this.getOrCreate(event);
    listeners.set(listener, handler);
  }

  off(event, listener) {
    if (!this.events.has(event)) return;
    const listeners = this.events.get(event);
    listeners.delete(listener);
  }

  remove(listener) {
    for (const listeners of this.events.values()) {
      listeners.delete(listener)
    }
  }
}

class Data {
  constructor(ev) {
    this.ev = ev;
    this.store = new Map();
  }

  get(dataKey) {
    return this.store.get(dataKey).value;
  }

  register(dataKey, fetchFn) {
    this.store.set(dataKey, {
      value: null,
      fetch: fetchFn,
    });
  }

  _fetch(dataKey, cb) {
    const def = this.store.get(dataKey);
    def.fetch((data) => {
      def.value = data;
      cb(data);
    });
  }

  refresh(dataKey) {
    this._fetch(dataKey, (data) => {
      this.ev.emit(DATA_UPDATED_EVENT + dataKey, data, this);
    })
  }

  fetch(dataKeys, cb) {
    const total = dataKeys.length;
    const results = {};
    dataKeys.forEach((dataKey) => {
      this._fetch(dataKey, (data) => {
        results[dataKey] = data;
        if (Object.keys(results).length === total) cb(results);
      });
    });
  }

  on(dataKey, cb, listener) {
    this.ev.on(DATA_UPDATED_EVENT + dataKey, cb, listener);
  }

  emit(dataKey, data, emitter) {
    this.ev.emit(DATA_UPDATED_EVENT + dataKey, data, emitter);
  }
}

class Nav {
  constructor(ev) {
    this.ev = ev;
    window.addEventListener('popstate', (ev) => {
      this.ev.emit(POPSTATE_EVENT, ev, this);
    });
  }

  on(cb, listener) {
    this.ev.on(POPSTATE_EVENT, cb, listener);
  }
}

export default class App {
  constructor(name, getTemplate) {
    this.name = name;
    this.getTemplate = getTemplate;
    this.ev = new EventBus();
    this.nav = new Nav(this.ev);
    this.data = new Data(this.ev);
  }

  start(el, param) {
    const root = new Component('', el, this);
    root.loadChildren(() => {}, param);
  }
}
