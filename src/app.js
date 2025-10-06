import { Component } from './component.js';

function getOrCreate(topics, topic) {
  if (!topics.has(topic)) {
    topics.set(topic, {
      subscribers: new Map(),
    });
  }
  return topics.get(topic);
}

export class Data {
  constructor(app) {
    this.app = app;
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
      this.app.publish('data.' + dataKey + '.updated', data);
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
}

export default class App {
  constructor(name, getTemplate) {
    this.name = name;
    this.getTemplate = getTemplate;
    this.topics = new Map();
    this.switches = new Set();
    this.data = new Data(this);
  }

  start(el, param) {
    // TODO: removeEventListener some where
    window.addEventListener('popstate', (ev) => {
      this.switches.forEach((s) => {
        s.load(() => {});
      })
    });
    const root = new Component('', el, this);
    root.loadChildren(() => {}, param);
  }

  // Data sharing
  publish(topic, data, publisher) {
    const entry = getOrCreate(this.topics, topic);
    for (let cb of entry.subscribers.values()) {
      cb(data, publisher);
    }
  }

  subscribe(topic, cb, subscriber) {
    const entry = getOrCreate(this.topics, topic);
    entry.subscribers.set(subscriber, cb);
  }

  unsubscribe(topic, subscriber) {
    if (!this.topics.has(topic)) return;
    const subscribers = this.topics.get(topic).subscribers;
    subscribers.delete(subscriber);
  }
};
