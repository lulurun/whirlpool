import { getUserSection } from '../users.js';

W.switch('user_switch', {
  knownComponents: {
    info: 'user_info',
    settings: 'user_settings',
  },

  getComponentName: function(hash) {
    const section = getUserSection(hash);
    return this.knownComponents[section] || this.defaultComponentName;
  }
});
