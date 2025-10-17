import './component/orderbook.js';

import dataInterface from './data.js';

function getTemplate(name, cb) {
  import(`./template/${name}.html`).then((tmpl) => {
    cb(tmpl.default);
  });
}

const app = W.app('trading-orderbook', getTemplate);

app.data.register('orderbook', (cb) => {
  dataInterface.getOrderbook(cb);
});

app.data.register('orders', (cb) => {
  dataInterface.getOrders(cb);
});

app.data.fetch(['orderbook', 'orders'], () => {
  app.start(document.body);
});

export { app, dataInterface };
