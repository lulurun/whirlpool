import dataInterface from '../data.js';

const formatTime = (stamp) => {
  try {
    return new Date(stamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return stamp;
  }
};

W.component('overview_page', {
  getData: function(cb) {
    const users = this.app.data.get('users') || [];
    const permissions = this.app.data.get('permissions') || {};
    const auditLog = this.app.data.get('auditLog') || [];
    const settings = this.app.data.get('workspaceSettings') || {};

    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.status === 'active').length;
    const pendingInvites = users.filter((user) => user.status === 'invited').length;
    const suspendedUsers = users.filter((user) => user.status === 'suspended').length;

    const enabledFeatures = Object.values(settings.features || {}).filter((feature) => feature.enabled).length;

    const metrics = [
      { label: 'Total Users', value: totalUsers, tone: 'primary' },
      { label: 'Active Users', value: activeUsers, tone: 'success' },
      { label: 'Pending Invites', value: pendingInvites, tone: 'warning' },
      { label: 'Suspended', value: suspendedUsers, tone: 'danger' },
      { label: 'Enabled Features', value: enabledFeatures, tone: 'info' },
    ];

    const recentActivity = auditLog.slice(0, 6).map((entry) => {
      const user = entry.userId ? dataInterface.getUserSync(entry.userId) : null;
      return {
        id: entry.id,
        timestamp: formatTime(entry.timestamp),
        message: entry.message,
        actor: user ? user.name : 'System',
      };
    });

    cb({ metrics, recentActivity });
  }
});
