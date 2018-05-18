/**
 * View container.
 * @module components/theme/View/View
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Dropdown, Icon } from 'semantic-ui-react';
import { Portal } from 'react-portal';
import { find } from 'lodash';

import { injectIntl, intlShape } from 'react-intl';

import {
  Toolbar,
  Actions,
  Display,
  Types,
  Workflow,
} from '../../../components';

import { getBaseUrl } from '../../../helpers';
import { listActions, getContent } from '../../../actions';
import config from '../../../config';
import DocumentView from '../View/DocumentView';

@injectIntl
@connect(
  (state, props) => ({
    actions: state.actions.actions,
    content: state.content.data,
    pathname: props.location.pathname,
  }),
  {
    listActions,
    getContent,
  },
)
/**
 * View container class.
 * @class View
 * @extends Component
 */
export default class HomeView extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    actions: PropTypes.shape({
      object: PropTypes.arrayOf(PropTypes.object),
      object_buttons: PropTypes.arrayOf(PropTypes.object),
      user: PropTypes.arrayOf(PropTypes.object),
    }),
    listActions: PropTypes.func.isRequired,
    getContent: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    content: PropTypes.shape({
      layout: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      '@type': PropTypes.string,
    }),
    intl: intlShape.isRequired,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    actions: null,
    content: null,
  };

  state = {
    hasObjectButtons: null,
  };

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  componentWillMount() {
    this.props.listActions(`${this.props.pathname}front-page`);
    this.props.getContent(`${this.props.pathname}front-page`);
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.pathname !== this.props.pathname) {
      this.props.listActions(nextProps.pathname);
      this.props.getContent(nextProps.pathname);
    }

    if (nextProps.actions.object_buttons) {
      const objectButtons = nextProps.actions.object_buttons;
      this.setState({
        hasObjectButtons: !!objectButtons.length,
      });
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const path = getBaseUrl(`${this.props.pathname}front-page`);
    const editAction = find(this.props.actions.object, { id: 'edit' });
    const folderContentsAction = find(this.props.actions.object, {
      id: 'folderContents',
    });
    const historyAction = find(this.props.actions.object, { id: 'history' });
    const sharingAction = find(this.props.actions.object, {
      id: 'local_roles',
    });

    return (
      <div id="HomeView" className="home_page_view">
        {this.props.content && (
          <Helmet
            title={this.props.content.title}
            bodyAttributes={{ class: 'home_page_view' }}
          />
        )}

        <DocumentView content={this.props.content} />

        <Portal node={__CLIENT__ && document.getElementById('toolbar')}>
          <Toolbar
            pathname={this.props.pathname}
            inner={
              <div>
                {editAction && (
                  <Link to={`${path}/edit`} id="toolbar-edit" className="item">
                    <Icon
                      name="write"
                      size="big"
                      color="blue"
                      title={editAction.title}
                    />
                  </Link>
                )}
                {this.props.content && (
                  <Link
                    to={`${getBaseUrl(this.props.pathname)}/contents`.replace(
                      /\/\//g,
                      '/',
                    )}
                    id="toolbar-folder-contents"
                    className="item"
                  >
                    <Icon name="folder open" size="big" title="contents" />
                  </Link>
                )}
                {this.props.content && <Types pathname={path} />}

                <Dropdown
                  id="toolbar-more"
                  item
                  trigger={<Icon name="ellipsis horizontal" size="big" />}
                >
                  <Dropdown.Menu>
                    <Workflow pathname={path} />
                    {this.state.hasObjectButtons && <Actions pathname={path} />}
                    {editAction && <Display pathname={path} />}
                    {historyAction && (
                      <Link
                        to={`${path}/history`}
                        id="toolbar-history"
                        className="item"
                      >
                        <Icon name="clock" size="big" /> {historyAction.title}
                      </Link>
                    )}
                    {sharingAction && (
                      <Link
                        to={`${path}/sharing`}
                        id="toolbar-sharing"
                        className="item"
                      >
                        <Icon name="share" size="big" /> {sharingAction.title}
                      </Link>
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown
                  id="toolbar-personal"
                  className="personal-bar"
                  item
                  upward
                  trigger={<Icon name="user" size="big" />}
                >
                  <Dropdown.Menu>
                    {this.props.actions.user &&
                      this.props.actions.user.map(item => {
                        switch (item.id) {
                          case 'preferences':
                            return (
                              <Link
                                key={item.id}
                                to="/personal-preferences"
                                className="item"
                              >
                                <span>
                                  <Icon name="setting" /> {item.title}
                                </span>
                              </Link>
                            );

                          case 'plone_setup':
                            return (
                              <Link
                                key={item.id}
                                to="/controlpanel"
                                className="item"
                              >
                                <span>
                                  <Icon name="settings" /> {item.title}
                                </span>
                              </Link>
                            );

                          case 'logout':
                            return (
                              <Link
                                key={item.id}
                                to="/logout"
                                id="toolbar-logout"
                                className="item"
                              >
                                <span>
                                  <Icon name="sign out" /> {item.title}
                                </span>
                              </Link>
                            );
                          default: {
                            return null;
                          }
                        }
                      })}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            }
          />
        </Portal>
      </div>
    );
  }
}
