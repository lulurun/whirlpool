W.switch('main_switch', {
  knownComponents: {
    'home': 'home_page',
    'about': 'about_page',
    'user_list': 'user_list',
    'user': 'user_page',
  },
  // getComponentName: function() {
  //   const queryParams = parseQueryString(location.hash);
  //   const deflattened = deflatten(queryParams);
  //   return deflattened('page');
  // },
});

