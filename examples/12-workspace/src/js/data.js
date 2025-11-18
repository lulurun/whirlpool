const USERS = [
  { id: 1, name: 'Ava Collins', email: 'ava.collins@example.com', role: 'Owner', status: 'active', region: 'North America', joinedAt: '2021-01-18' },
  { id: 2, name: 'Liam García', email: 'liam.garcia@example.com', role: 'Admin', status: 'active', region: 'Europe', joinedAt: '2022-04-09' },
  { id: 3, name: 'Priya Desai', email: 'priya.desai@example.com', role: 'Editor', status: 'invited', region: 'Asia Pacific', joinedAt: '2024-02-14' },
  { id: 4, name: 'Noah Kim', email: 'noah.kim@example.com', role: 'Viewer', status: 'active', region: 'North America', joinedAt: '2023-07-01' },
  { id: 5, name: 'Sophia Rossi', email: 'sophia.rossi@example.com', role: 'Analyst', status: 'suspended', region: 'Europe', joinedAt: '2020-11-22' }
];

let permissions = {
  1: { analytics: true, billing: true, automation: true, experiments: true },
  2: { analytics: true, billing: false, automation: true, experiments: false },
  3: { analytics: false, billing: false, automation: true, experiments: false },
  4: { analytics: true, billing: false, automation: false, experiments: true },
  5: { analytics: true, billing: false, automation: false, experiments: false }
};

let auditLog = [
  { id: 101, userId: 1, message: 'Updated billing contacts', timestamp: '2025-10-01T09:15:00Z' },
  { id: 102, userId: 2, message: 'Enabled automation for workspace', timestamp: '2025-10-02T12:42:00Z' },
  { id: 103, userId: 4, message: 'Exported analytics dashboard', timestamp: '2025-10-03T17:05:00Z' },
  { id: 104, userId: 5, message: 'Suspended by owner', timestamp: '2025-10-04T08:23:00Z' }
];

let workspaceSettings = {
  general: {
    timezone: 'UTC',
    primaryRegion: 'North America',
    locales: ['en-US', 'fr-FR'],
    notifications: {
      email: true,
      sms: false,
      weeklyDigest: true,
    },
  },
  features: {
    analytics: {
      enabled: true,
      refreshIntervalMinutes: 30,
    },
    automation: {
      enabled: false,
      stages: ['draft', 'review', 'launch'],
    },
  },
  compliance: {
    exportControls: {
      enabled: true,
      regions: ['EU', 'US'],
    },
    dataRetentionMonths: 24,
  },
};

let auditSeq = auditLog.reduce((max, entry) => Math.max(max, entry.id), 0);

const delay = (fn) => setTimeout(fn, 120);

const clone = (value) => JSON.parse(JSON.stringify(value));

const addAuditEntry = (entry) => {
  auditSeq += 1;
  const record = { id: auditSeq, timestamp: new Date().toISOString(), ...entry };
  auditLog = [record, ...auditLog].slice(0, 25);
  return record;
};

export default {
  getUsers(cb) {
    delay(() => cb(clone(USERS)));
  },

  getPermissions(cb) {
    delay(() => cb(clone(permissions)));
  },

  getAuditLog(cb) {
    delay(() => cb(clone(auditLog)));
  },

  getWorkspaceSettings(cb) {
    delay(() => cb(workspaceSettings));
  },

  setUserStatus(userId, status, cb) {
    delay(() => {
      const user = USERS.find((u) => u.id === userId);
      if (!user) {
        cb({ error: 'User not found', users: clone(USERS) });
        return;
      }
      user.status = status;
      const entry = addAuditEntry({ userId, message: `Status changed to ${status}` });
      cb({ users: clone(USERS), auditLog: clone(auditLog), entry });
    });
  },

  togglePermission(userId, key, enabled, cb) {
    delay(() => {
      if (!permissions[userId]) {
        permissions[userId] = {};
      }
      permissions[userId][key] = enabled;
      const entry = addAuditEntry({ userId, message: `${enabled ? 'Enabled' : 'Disabled'} ${key}` });
      cb({ permissions: clone(permissions), auditLog: clone(auditLog), entry });
    });
  },

  updateWorkspaceSettings(nextSettings, cb) {
    delay(() => {
      workspaceSettings = nextSettings;
      const entry = addAuditEntry({ userId: null, message: 'Updated workspace settings' });
      cb({ settings: workspaceSettings, auditLog: clone(auditLog), entry });
    });
  },

  appendAudit(message, userId = null, cb) {
    delay(() => {
      const entry = addAuditEntry({ userId, message });
      cb({ auditLog: clone(auditLog), entry });
    });
  },

  getUserSync(userId) {
    return USERS.find((u) => u.id === userId) || null;
  },

  getPermissionsSync(userId) {
    return permissions[userId] ? { ...permissions[userId] } : {};
  },

  getAuditLogSync() {
    return clone(auditLog);
  },

  getWorkspaceSettingsSync() {
    return workspaceSettings;
  }
};
