import { Component } from './component.js';

export default class App {
  constructor(name) {
    this.name = name;
    this.topics = {};
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
    if (!(topic in this.topics)) {
      this.topics[topic] = {
        subscribers: {},
      }
    }

    const entry = this.topics[topic];
    Object.values(entry.subscribers).forEach((cb) => {
      cb(data, publisher);
    });
    entry.data = data;
    entry.publisher = publisher;
  }

  subscribe(topic, cb, subscriber) {
    if (!(topic in this.topics)) {
      this.topics[topic] = {
        subscribers: {},
      };
    }

    const entry = this.topics[topic];
    entry.subscribers[subscriber] = cb;
    if (entry.publisher) {
      cb(entry.data, entry.publisher);
    }
  }

  unsubscribe(topic, subscriber) {
    if (!(topic in this.topics))
      return;
    const subscribers = this.topics[topic].subscribers;
    delete subscribers[subscriber];
  }
};

