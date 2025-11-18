W.component('about_page', {
  getData: function(cb) {
    cb({
      title: 'Behind the Scenes',
      content: 'This screen breaks down how the example keeps pages in sync with the URL hash.',
      details: [
        'Switch instances listen for `popstate` events from Whirlpool navigation.',
        'The first hash segment selects a page component: home, about, user list, or user.',
        'User profiles host a nested switch so sub-tabs update independently.',
        'Components are destroyed before new ones mount, keeping DOM listeners tidy.',
      ],
    });
  }
});
