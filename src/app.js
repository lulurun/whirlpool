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
  constructor(name) {
    this.name = name;
    this.topics = new Map();
  }

  start(el, param) {
    // TODO: removeEventListener some where
    window.addEventListener('popstate', (ev) => {
      this.publish('popstate', ev);
    });
    const root = new Component('', el, this);
    root.loadChildren(() => {}, param);
  }

  publish(topic, data, publisher) {
    const entry = getOrCreate(this.topics, topic);
    for (let cb of entry.subscribers.values()) {
      cb(data, publisher);
    }
    entry.data = data;
    entry.publisher = publisher;
  }

  subscribe(topic, cb, subscriber) {
    const entry = getOrCreate(this.topics, topic);
    entry.subscribers.set(subscriber, cb);
    if (entry.publisher) {
      cb(entry.data, entry.publisher);
    }
  }

  unsubscribe(topic, subscriber) {
    if (!this.topics.has(topic)) {
      return;
    }
    const subscribers = this.topics.get(topic).subscribers;
    subscribers.delete(subscriber);
  }
};

