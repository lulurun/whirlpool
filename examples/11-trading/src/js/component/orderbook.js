import dataInterface from '../data.js';

const formatPrice = (value) => value.toFixed(2);
const formatSize = (value) => value.toFixed(2);

const toDisplayRow = (row, side, bestPrice) => ({
  ...row,
  side,
  displayPrice: formatPrice(row.price),
  displaySize: formatSize(row.size),
  isBest: row.price === bestPrice,
});

const computeMidpoint = (asks, bids) => {
  if (!asks.length || !bids.length) return null;
  const bestAsk = Math.min(...asks.map((row) => row.price));
  const bestBid = Math.max(...bids.map((row) => row.price));
  return (bestAsk + bestBid) / 2;
};

const recordOrder = (component, payload) => {
  dataInterface.appendOrder(payload, () => {
    component.app.data.fetch('orders');
  });
};

W.component('orderbook', {
  init: function() {
    this.app.data.on('orderbook', () => this.load(), this);
    this.app.data.on('orders', () => this.load(), this);
  },

  getData: function(cb) {
    const snapshot = this.app.data.get('orderbook') || { asks: [], bids: [] };
    const orders = this.app.data.get('orders') || [];

    const asks = [...(snapshot.asks || [])].sort((a, b) => b.price - a.price);
    const bids = [...(snapshot.bids || [])].sort((a, b) => b.price - a.price);

    const bestAsk = asks.length ? Math.min(...asks.map((row) => row.price)) : null;
    const bestBid = bids.length ? Math.max(...bids.map((row) => row.price)) : null;

    const displayAsks = asks.map((row) => toDisplayRow(row, 'ask', bestAsk));
    const displayBids = bids.map((row) => toDisplayRow(row, 'bid', bestBid));

    const midpoint = computeMidpoint(asks, bids);

    cb({
      asks: displayAsks,
      bids: displayBids,
      midpoint: midpoint !== null ? formatPrice(midpoint) : '—',
      recentOrders: orders.slice(0, 8).map((order) => ({
        ...order,
        displayPrice: order.price !== null && typeof order.price !== 'undefined' ? formatPrice(order.price) : '—',
        displaySize: order.size ? formatSize(order.size) : '—',
        displayTime: new Date(order.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      })),
    });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    $container.find('[data-action="order"]').off('click').on('click', (ev) => {
      const $target = $(ev.currentTarget);
      const payload = {
        side: $target.data('side'),
        type: $target.data('type'),
        price: $target.data('price'),
        size: $target.data('size'),
        source: 'orderbook',
      };
      recordOrder(this, payload);
    });

    cb();
  }
});
