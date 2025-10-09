W.switch('user_switch', {
  knownComponents: {
    'info': 'user_info',
    'settings': 'user_settings'
  },

  getComponentName: function() {
    // Parse hash: #user/123/info -> extract "info"
    const match = /^#user\/\d+\/([^\/]+)/.exec(location.hash);
    // Don't want to trigger the switch load
    if (!match) return null;

    const subPage = match[1];
    return this.knownComponents[subPage] || this.defaultComponentName;
  }
});
