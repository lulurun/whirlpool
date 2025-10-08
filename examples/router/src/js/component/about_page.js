W.component('about_page', {
  getData: function(cb) {
    cb({
      title: 'About Page',
      content: 'This example demonstrates how to use Whirlpool Switch components for client-side routing.',
      details: [
        'Switch listens to popstate events',
        'Hash changes trigger component loading',
        'Each route maps to a different component',
        'Previous components are destroyed on route change'
      ]
    });
  }
});
