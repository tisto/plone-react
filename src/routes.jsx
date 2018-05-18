/**
 * Routes.
 * @module routes
 */

import React from 'react';
import { IndexRoute, Route } from 'react-router';
import isMobile from 'ismobilejs';

import {
  Add,
  App,
  ChangePassword,
  Contents,
  Controlpanel,
  Controlpanels,
  Edit,
  Diff,
  Delete,
  History,
  View,
  NotFound,
  Layout,
  Login,
  Logout,
  ModerateComments,
  PersonalInformation,
  PersonalPreferences,
  Search,
  Sharing,
  HomeView,
} from './components';

/**
 * Routes function.
 * @function
 * @returns {Object} Routes.
 */
export default () => (
  <Route
    path="/"
    component={App}
    onChange={(prevState, nextState) => {
      if (isMobile.any && nextState.location.action === 'PUSH') {
        setTimeout(() => window.scrollTo(0, 0), 0);
      }
    }}
  >
    <IndexRoute component={HomeView} />
    <Route path="/login" component={Login} />
    <Route path="/logout" component={Logout} />
    <Route path="/search" component={Search} />
    <Route path="/change-password" component={ChangePassword} />
    <Route path="/controlpanel" component={Controlpanels} />
    <Route
      path="/controlpanel/moderate-comments"
      component={ModerateComments}
    />
    <Route path="/controlpanel/:id" component={Controlpanel} />
    <Route path="/personal-information" component={PersonalInformation} />
    <Route path="/personal-preferences" component={PersonalPreferences} />
    <Route path="/add" component={Add} />
    <Route path="/contents" component={Contents} />
    <Route path="/sharing" component={Sharing} />
    <Route path="/**/add" component={Add} />
    <Route path="/**/contents" component={Contents} />
    <Route path="/**/delete" component={Delete} />
    <Route path="/**/diff" component={Diff} />
    <Route path="/**/edit" component={Edit} />
    <Route path="/**/history" component={History} />
    <Route path="/**/layout" component={Layout} />
    <Route path="/**/sharing" component={Sharing} />
    <Route path="/**" component={View} />
    <Route path="*" component={NotFound} status={404} />
  </Route>
);
