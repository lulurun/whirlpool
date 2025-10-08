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
  constructor(eventBus) {
    this.eventBus = eventBus;
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
      this.eventBus.emit(DATA_UPDATED_EVENT + dataKey, data, this);
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
    this.eventBus.on(DATA_UPDATED_EVENT + dataKey, cb, listener);
  }

  emit(dataKey, data, emitter) {
    this.eventBus.emit(DATA_UPDATED_EVENT + dataKey, data, emitter);
  }
}

class Nav {
  constructor(eventBus) {
    this.eventBus = eventBus;
    window.addEventListener('popstate', (ev) => {
      this.eventBus.emit(POPSTATE_EVENT, ev, this);
    });
  }

  on(cb, listener) {
    this.eventBus.on(POPSTATE_EVENT, cb, listener);
  }
}

export default class App {
  constructor(name, getTemplate) {
    this.name = name;
    this.getTemplate = getTemplate;
    this.eventBus = new EventBus();
    this.nav = new Nav(this.eventBus);
    this.data = new Data(this.eventBus);
  }

  start(el, param) {
    const root = new Component('', el, this);
    root.loadChildren(() => {}, param);
  }
}
