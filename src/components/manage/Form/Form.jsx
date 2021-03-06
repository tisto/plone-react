/**
 * Form component.
 * @module components/manage/Form/Form
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { keys, map, uniq } from 'lodash';
import {
  Button,
  Form as UiForm,
  Segment,
  Tab,
  Message,
} from 'semantic-ui-react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';

import { EditTitleTile, EditTextTile, Field } from '../../../components';

const messages = defineMessages({
  required: {
    id: 'Required input is missing.',
    defaultMessage: 'Required input is missing.',
  },
  minLength: {
    id: 'Minimum length is {len}.',
    defaultMessage: 'Minimum length is {len}.',
  },
  uniqueItems: {
    id: 'Items must be unique.',
    defaultMessage: 'Items must be unique.',
  },
  save: {
    id: 'Save',
    defaultMessage: 'Save',
  },
  cancel: {
    id: 'Cancel',
    defaultMessage: 'Cancel',
  },
  error: {
    id: 'Error',
    defaultMessage: 'Error',
  },
  thereWereSomeErrors: {
    id: 'There were some errors.',
    defaultMessage: 'There were some errors.',
  },
});

/**
 * Form container class.
 * @class Form
 * @extends Component
 */
class Form extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    schema: PropTypes.shape({
      fieldsets: PropTypes.arrayOf(
        PropTypes.shape({
          fields: PropTypes.arrayOf(PropTypes.string),
          id: PropTypes.string,
          title: PropTypes.string,
        }),
      ),
      properties: PropTypes.objectOf(PropTypes.any),
      required: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    formData: PropTypes.objectOf(PropTypes.any),
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    submitLabel: PropTypes.string,
    resetAfterSubmit: PropTypes.bool,
    intl: intlShape.isRequired,
    title: PropTypes.string,
    error: PropTypes.shape({
      message: PropTypes.string,
    }),
    loading: PropTypes.bool,
    hideActions: PropTypes.bool,
    description: PropTypes.string,
    visual: PropTypes.bool,
    tiles: PropTypes.arrayOf(PropTypes.object),
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    formData: {},
    onSubmit: null,
    onCancel: null,
    submitLabel: null,
    resetAfterSubmit: false,
    title: null,
    description: null,
    error: null,
    loading: null,
    hideActions: false,
    visual: false,
    tiles: [],
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.state = {
      formData: props.formData,
      errors: {},
    };
    this.onChangeField = this.onChangeField.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * Change field handler
   * @method onChangeField
   * @param {string} id Id of the field
   * @param {*} value Value of the field
   * @returns {undefined}
   */
  onChangeField(id, value) {
    this.setState({
      formData: {
        ...this.state.formData,
        [id]: value || null,
      },
    });
  }

  /**
   * Change handler
   * @method onChange
   * @param {Object} data Data to change
   * @returns {undefined}
   */
  onChange(data) {
    if (data.properties) {
      this.setState({
        formData: data.properties,
      });
    }
  }

  /**
   * Submit handler
   * @method onSubmit
   * @param {Object} event Event object.
   * @returns {undefined}
   */
  onSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    const errors = {};
    map(this.props.schema.fieldsets, fieldset =>
      map(fieldset.fields, fieldId => {
        const field = this.props.schema.properties[fieldId];
        const data = this.state.formData[fieldId];
        if (this.props.schema.required.indexOf(fieldId) !== -1) {
          if (field.type !== 'boolean' && !data) {
            errors[fieldId] = errors[field] || [];
            errors[fieldId].push(
              this.props.intl.formatMessage(messages.required),
            );
          }
          if (field.minLength && data.length < field.minLength) {
            errors[fieldId] = errors[field] || [];
            errors[fieldId].push(
              this.props.intl.formatMessage(messages.minLength, {
                len: field.minLength,
              }),
            );
          }
        }
        if (field.uniqueItems && data && uniq(data).length !== data.length) {
          errors[fieldId] = errors[field] || [];
          errors[fieldId].push(
            this.props.intl.formatMessage(messages.uniqueItems),
          );
        }
      }),
    );
    if (keys(errors).length > 0) {
      this.setState({
        errors,
      });
    } else {
      this.props.onSubmit(this.state.formData);
      if (this.props.resetAfterSubmit) {
        this.setState({
          formData: this.props.formData,
        });
      }
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { schema, onCancel, onSubmit } = this.props;

    return this.props.visual ? (
      <div>
        {map(this.props.tiles, tile => {
          switch (tile.type) {
            case 'title':
              return (
                <EditTitleTile
                  onChange={this.onChange}
                  properties={this.state.formData}
                />
              );
            case 'text':
              return <EditTextTile onChange={this.onChange} data={tile.data} />;
            default:
              break;
          }
          return <div />;
        })}
        <div>
          <Button
            basic
            circular
            icon="plus"
            title={
              this.props.submitLabel
                ? this.props.submitLabel
                : this.props.intl.formatMessage(messages.save)
            }
          />
        </div>
      </div>
    ) : (
      <UiForm
        method="post"
        onSubmit={this.onSubmit}
        error={keys(this.state.errors).length > 0}
      >
        <Segment.Group raised>
          {schema.fieldsets.length > 1 && (
            <Tab
              menu={{
                secondary: true,
                pointing: true,
                attached: true,
                tabular: true,
              }}
              panes={map(schema.fieldsets, item => ({
                menuItem: item.title,
                render: () => [
                  this.props.title && (
                    <Segment secondary attached>
                      {this.props.title}
                    </Segment>
                  ),
                  ...map(item.fields, field => (
                    <Field
                      {...schema.properties[field]}
                      id={field}
                      value={this.state.formData[field]}
                      required={schema.required.indexOf(field) !== -1}
                      onChange={this.onChangeField}
                      key={field}
                      error={this.state.errors[field]}
                    />
                  )),
                ],
              }))}
            />
          )}
          {schema.fieldsets.length === 1 && (
            <Segment>
              {this.props.title && (
                <Segment className="primary">{this.props.title}</Segment>
              )}
              {this.props.description && (
                <Segment secondary>{this.props.description}</Segment>
              )}
              {keys(this.state.errors).length > 0 && (
                <Message
                  icon="warning"
                  negative
                  attached
                  header={this.props.intl.formatMessage(messages.error)}
                  content={this.props.intl.formatMessage(
                    messages.thereWereSomeErrors,
                  )}
                />
              )}
              {this.props.error && (
                <Message
                  icon="warning"
                  negative
                  attached
                  header={this.props.intl.formatMessage(messages.error)}
                  content={this.props.error.message}
                />
              )}
              {map(schema.fieldsets[0].fields, field => (
                <Field
                  {...schema.properties[field]}
                  id={field}
                  value={this.state.formData[field]}
                  required={schema.required.indexOf(field) !== -1}
                  onChange={this.onChangeField}
                  key={field}
                  error={this.state.errors[field]}
                />
              ))}
            </Segment>
          )}
          {!this.props.hideActions && (
            <Segment className="actions" clearing>
              {onSubmit && (
                <Button
                  basic
                  circular
                  primary
                  floated="right"
                  icon="arrow right"
                  type="submit"
                  title={
                    this.props.submitLabel
                      ? this.props.submitLabel
                      : this.props.intl.formatMessage(messages.save)
                  }
                  size="big"
                  loading={this.props.loading}
                />
              )}
              {onCancel && (
                <Button
                  basic
                  circular
                  secondary
                  icon="remove"
                  title={this.props.intl.formatMessage(messages.cancel)}
                  floated="right"
                  size="big"
                  onClick={onCancel}
                />
              )}
            </Segment>
          )}
        </Segment.Group>
      </UiForm>
    );
  }
}

export default injectIntl(Form, { withRef: true });
