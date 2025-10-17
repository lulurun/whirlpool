const ORDERBOOK_SNAPSHOT = {
  asks: [
    { price: 101.82, size: 1.5 },
    { price: 101.75, size: 1.2 },
    { price: 101.62, size: 2.1 },
    { price: 101.55, size: 1.0 },
    { price: 101.48, size: 3.4 }
  ],
  bids: [
    { price: 101.42, size: 2.8 },
    { price: 101.35, size: 1.7 },
    { price: 101.28, size: 2.3 },
    { price: 101.19, size: 1.1 },
    { price: 101.05, size: 3.0 }
  ]
};

let orders = [];
let orderId = 1;

const delay = (fn, ms = 80) => setTimeout(fn, ms);

const clone = (value) => JSON.parse(JSON.stringify(value));

export default {
  getOrderbook(cb) {
    delay(() => cb(clone(ORDERBOOK_SNAPSHOT)));
  },

  getOrders(cb) {
    delay(() => cb(clone(orders)));
  },

  appendOrder(order, cb) {
    delay(() => {
      const record = {
        id: orderId++,
        createdAt: new Date().toISOString(),
        ...order,
      };
      orders = [record, ...orders].slice(0, 20);
      cb({ orders: clone(orders) });
    }, 120);
  }
};
