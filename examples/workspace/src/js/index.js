import './switch/main_switch.js';
import './switch/user_switch.js';

import './component/overview_page.js';
import './component/users_page.js';
import './component/user_list.js';
import './component/user_detail.js';
import './component/user_profile.js';
import './component/user_permissions.js';
import './component/settings_page.js';
import './component/settings_form.js';
import './component/settings_preview.js';

import dataInterface from './data.js';

function getTemplate(name, cb) {
  import(`./template/${name}.html`).then((tmpl) => {
    cb(tmpl.default);
  });
}

const app = W.app('workspace-console', getTemplate);

app.data.register('users', (cb) => {
  dataInterface.getUsers(cb);
});

app.data.register('permissions', (cb) => {
  dataInterface.getPermissions(cb);
});

app.data.register('auditLog', (cb) => {
  dataInterface.getAuditLog(cb);
});

app.data.register('workspaceSettings', (cb) => {
  dataInterface.getWorkspaceSettings(cb);
});

app.data.fetch(['users', 'permissions', 'auditLog', 'workspaceSettings'], () => {
  app.start(document.body);
});

export { app, dataInterface };
