import { getUserRoute } from '../shared/hash.js';

W.switch('user_switch', {
  knownComponents: {
    profile: 'user_profile',
    permissions: 'user_permissions',
  },

  getComponentName: function(hash) {
    const { userId, section } = getUserRoute(hash || window.location.hash);
    if (!userId) return null;
    return this.knownComponents[section] || this.defaultComponentName;
  }
});
