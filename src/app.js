import { Component } from './component.js';

export default class App {
  constructor(name) {
    this.name = name;
    this.topics = {};
  }

  start(el, param) {
    // TODO: removeEventListener some where
    window.addEventListener('popstate', (ev) => {
      this.trigger('popstate', ev);
    });
    const root = new Component('', el, this);
    root.loadChildren(() => {}, param);
  }

  trigger(topic, data, publisher) {
    if (!(topic in this.topics))
      return;
    for (let s in this.topics[topic]) {
      this.topics[topic][s](topic, data, publisher);
    }
  }

  on(topic, cb, subscriber) {
    if (!(topic in this.topics))
      this.topics[topic] = {};
    this.topics[topic][subscriber] = cb;
  }

  off(topic, subscriber) {
    if (!(topic in this.topics))
      return;
    const subscribers = this.topics[topic];
    delete subscribers[subscriber];
    if (subscribers.length === 0)
      delete this.topics[topic];
  }
};

