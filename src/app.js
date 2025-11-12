import { Component } from './component.js';

const DATA_UPDATED_EVENT = 'data.updated.';
const POPSTATE_EVENT = 'app.popstate';

class EventBus {
  constructor() {
    this.events = new Map();
  }

  getOrCreate(evName) {
    if (!this.events.has(evName)) {
      this.events.set(evName, new Map());
    }
    return this.events.get(evName);
  }

  emit(evName, data, emitter) {
    const listeners = this.getOrCreate(evName);
    for (let handler of listeners.values()) {
      handler(data, emitter);
    }
  }

  on(evName, handler, listener) {
    const listeners = this.getOrCreate(evName);
    listeners.set(listener, handler);
  }

  off(evName, listener) {
    if (!this.events.has(evName)) return;
    const listeners = this.events.get(evName);
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
    this.pending = new Map();
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

  _fetch(dataKey, handler) {
    const def = this.store.get(dataKey);

    // If already fetching, queue the handler
    if (this.pending.has(dataKey)) {
      this.pending.get(dataKey).push(handler);
      return;
    }

    // Start new fetch
    this.pending.set(dataKey, [handler]);
    def.fetch((data) => {
      def.value = data;

      // Call all queued handlers
      const handlers = this.pending.get(dataKey);
      this.pending.delete(dataKey);
      handlers.forEach(h => h(data));
    });
  }

  fetch(dataKeys, handler) {
    const keys = Array.isArray(dataKeys) ? dataKeys : [dataKeys];
    const total = keys.length;
    const results = {};
    keys.forEach((dataKey) => {
      this._fetch(dataKey, (data) => {
        results[dataKey] = data;
        if (Object.keys(results).length === total && handler) {
          const result = Array.isArray(dataKeys) ? results : results[dataKeys];
          handler(result);
        }
      });
    });
  }

  on(dataKey, handler, listener) {
    this.ev.on(DATA_UPDATED_EVENT + dataKey, handler, listener);
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

  on(handler, listener) {
    this.ev.on(POPSTATE_EVENT, handler, listener);
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
