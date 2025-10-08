W.component('home_page', {
  getData: function(cb) {
    cb({
      title: 'Home Page',
      description: 'Welcome to the Whirlpool Router Example',
      features: [
        'Hash-based routing with Switch component',
        'Automatic component swapping',
        'No page reloads',
        'Clean URL hash navigation'
      ]
    });
  }
});
