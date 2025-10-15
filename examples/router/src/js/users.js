// Mock user directory (kept simple on purpose for the demo)
const USERS = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Admin',
    phone: '+1-555-0101',
    department: 'Engineering',
    joinDate: '2020-01-15',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'User',
    phone: '+1-555-0102',
    department: 'Marketing',
    joinDate: '2021-03-20',
  },
  {
    id: 3,
    name: 'Carol Williams',
    email: 'carol@example.com',
    role: 'Editor',
    phone: '+1-555-0103',
    department: 'Content',
    joinDate: '2019-11-08',
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david@example.com',
    role: 'User',
    phone: '+1-555-0104',
    department: 'Sales',
    joinDate: '2022-06-12',
  },
];

const USER_SETTINGS = [
  { name: 'Email Notifications', type: 'boolean', value: true },
  { name: 'Theme', type: 'select', value: 'Light', options: ['Light', 'Dark', 'Auto'] },
  { name: 'Language', type: 'select', value: 'English', options: ['English', 'Spanish', 'French', 'German'] },
  { name: 'Two-Factor Auth', type: 'boolean', value: false },
  { name: 'Auto-save', type: 'boolean', value: true },
  { name: 'Show Online Status', type: 'boolean', value: true },
];

export function getUsers() {
  return USERS;
}

export function getUser(id) {
  return USERS.find((user) => user.id === id) || null;
}

export function getUserId(hash = location.hash) {
  const match = /^#user\/(\d+)/.exec(hash);
  return match ? parseInt(match[1], 10) : null;
}

export function getUserSection(hash = location.hash) {
  const match = /^#user\/\d+\/([^\/]+)/.exec(hash);
  return match ? match[1] : 'info';
}

export function getUserSettings() {
  return USER_SETTINGS.map((setting) => ({ ...setting }));
}
