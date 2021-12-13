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
    this.events = new Map();
  }

  start(el, param) {
    // TODO: removeEventListener some where
    window.addEventListener('popstate', (ev) => {
      this.trigger('popstate', ev);
    });
    const root = new Component('', el, this);
    root.loadChildren(() => {}, param);
  }

  // Event execution
  trigger(evName, params) {
    if (!this.events.has(evName)) return;
    const cb = this.events.get(evName);
    if (cb) {
      cb(params);
    }
  }

  on(evName, cb) {
    this.events.set(evName, cb);
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

  get(topic, cb) {
    const entry = getOrCreate(this.topics, topic);
    cb(entry.available, entry.data, entry.publisher);
  }

  unsubscribe(topic, subscriber) {
    if (!this.topics.has(topic)) return;
    const subscribers = this.topics.get(topic).subscribers;
    subscribers.delete(subscriber);
  }
};
