W.switch('main_switch', {
  knownComponents: {
    'home': 'home_page',
    'about': 'about_page',
    'user_list': 'user_list'
  },

  getComponentName: function() {
    const hash = location.hash;

    // Check if it's a user detail page: #user/123
    const userMatch = /^#user\/(\d+)/.exec(hash);
    if (userMatch) {
	    alert('user');
      return 'user_page';
    }

    // Default behavior: extract first segment after #
    const match = /^#([^\/]+)/.exec(hash);
    const key = (match && match[1]) || '';
	  alert(key);
    const componentName = this.knownComponents[key] || this.defaultComponentName;
    return componentName;
  }
});
