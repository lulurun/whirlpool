// Mock user database
const USERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', phone: '+1-555-0101', department: 'Engineering', joinDate: '2020-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', phone: '+1-555-0102', department: 'Marketing', joinDate: '2021-03-20' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'Editor', phone: '+1-555-0103', department: 'Content', joinDate: '2019-11-08' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'User', phone: '+1-555-0104', department: 'Sales', joinDate: '2022-06-12' }
];

// Get all users
function getUsers() {
  return USERS;
}

// Get a specific user by ID
function getUser(id) {
  return USERS.find(u => u.id === id);
}

// Get user ID from location.hash
function getUserId() {
  const match = /^#user\/(\d+)/.exec(location.hash);
  return match ? parseInt(match[1]) : null;
}

export { getUsers, getUser, getUserId };
