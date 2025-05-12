import users from '../data/users.json';

export function validateAdmin(username, password) {
  return users.find(
    (user) => user.username === username && user.password === password && user.role === 'admin'
  );
}
