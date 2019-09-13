import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as routes from '../constants/routes';
import Organization from '../Organization';
import Profile from '../Profile';
import Navigation from './Navigation';
import './style.css';

const App = () => {
  const [organizationName, setOrganizationName] = React.useState('facebook');

  const onOrganizationSearch = (value: string) => {
    setOrganizationName(value);
  };
  return (
    <Router>
      <div className="App">
        <Navigation
          organizationName={organizationName}
          onOrganizationSearch={onOrganizationSearch}
        />
        <div className="App-main">
          <Route
            exact
            path={routes.ORGANIZATION}
            component={() => (
              <div className="App-content_large-header">
                <Organization
                  organizationName={organizationName}
                />
              </div>
            )}
          />
          <Route
            exact
            path={routes.PROFILE}
            component={() => (
              <div className="App-content_small-header">
                <Profile />
              </div>
            )}
          />
        </div>
      </div>
    </Router>
  );
};

export default App;
