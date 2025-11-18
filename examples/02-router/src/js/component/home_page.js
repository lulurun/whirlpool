W.component('home_page', {
  getData: function(cb) {
    cb({
      title: 'Welcome to the Router Playground',
      description: 'Navigate around the hash bar above to see Whirlpool switches replace content without a page reload.',
      features: [
        'Hash-based navigation handled by `main_switch`',
        'Nested switches for user sub-pages',
        'Reusable component lifecycles for data fetching',
        'Graceful fallbacks for unknown routes',
      ],
    });
  }
});
