W.switch('user_switch', {
  knownComponents: {
    'info': 'user_info',
    'settings': 'user_settings'
  },

  getComponentName: function() {
    const hash = location.hash;

    // Parse hash: #user/123/info -> extract "info"
    const match = /^#user\/\d+\/([^\/]+)/.exec(hash);

    if (match) {
      const subPage = match[1];
      return this.knownComponents[subPage] || this.defaultComponentName;
    }

    return this.defaultComponentName;
  }
});
