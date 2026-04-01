import ResourcePage from './ResourcePage';

// API endpoint reference for GitHub Actions
// https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/activities/
function Activities() {
  return <ResourcePage title="Activities" endpointName="activities" />;
}

export default Activities;
