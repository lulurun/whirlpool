import { Component } from './component.js';

function getOrCreate(topics, topic) {
  if (!topics.has(topic)) {
    topics.set(topic, {
      subscribers: new Map(),
    });
  }
  return topics.get(topic);
}

export default class App {
  constructor(name, getTemplate) {
    this.name = name;
    this.getTemplate = getTemplate;
    this.topics = new Map();
    this.switches = new Set();
    this.stores = new Map();
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
    entry.data = data;
    entry.publisher = publisher;
    entry.available = true;
  }

  subscribe(topic, cb, subscriber) {
    const entry = getOrCreate(this.topics, topic);
    entry.subscribers.set(subscriber, cb);
    if (entry.available) {
      cb(entry.data, entry.publisher);
    }
  }

  unsubscribe(topic, subscriber) {
    if (!this.topics.has(topic)) return;
    const subscribers = this.topics.get(topic).subscribers;
    subscribers.delete(subscriber);
  }

  setData(key, value) {
    this.stores.set(key, value);
    this.publish('data.' + key + '.updated', value);
  }

  getData(key) {
    return this.stores.get(key);
  }

};
