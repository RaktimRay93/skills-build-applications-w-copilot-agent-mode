import ResourcePage from './ResourcePage';

// API endpoint reference for GitHub Actions
// https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/leaderboard/
function Leaderboard() {
  return <ResourcePage title="Leaderboard" endpointName="leaderboard" />;
}

export default Leaderboard;
