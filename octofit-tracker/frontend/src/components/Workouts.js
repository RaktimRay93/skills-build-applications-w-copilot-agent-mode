import ResourcePage from './ResourcePage';

// API endpoint reference for GitHub Actions
// https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/workouts/
function Workouts() {
  return <ResourcePage title="Workouts" endpointName="workouts" />;
}

export default Workouts;
