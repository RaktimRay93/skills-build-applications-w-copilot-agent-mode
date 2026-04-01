import ResourcePage from './ResourcePage';

// API endpoint reference for GitHub Actions
// https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/teams/
function Teams() {
  return <ResourcePage title="Teams" endpointName="teams" />;
}

export default Teams;
