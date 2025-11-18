import { getPrimaryRoute } from '../shared/hash.js';

W.switch('main_switch', {
  knownComponents: {
    overview: 'overview_page',
    users: 'users_page',
    settings: 'settings_page',
  },

  getComponentName: function(hash) {
    const route = getPrimaryRoute(hash || window.location.hash);
    return this.knownComponents[route] || this.defaultComponentName;
  }
});
