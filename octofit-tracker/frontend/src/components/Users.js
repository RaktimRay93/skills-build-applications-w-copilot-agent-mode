import ResourcePage from './ResourcePage';

// API endpoint reference for GitHub Actions
// https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/users/
function Users() {
  return <ResourcePage title="Users" endpointName="users" />;
}

export default Users;
