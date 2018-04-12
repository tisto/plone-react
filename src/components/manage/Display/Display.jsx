import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import { getSchema, editContent, getContent } from '../../../actions';
import layouts from '../../../constants/Layouts';
import { Icon } from '../../../components';
import downSVG from '../../../icons/down-key.svg';
import upSVG from '../../../icons/up-key.svg';
import checkSVG from '../../../icons/check.svg';

@connect(
  state => ({
    loaded: state.content.edit.loaded,
    layouts: state.schema.schema ? state.schema.schema.layouts : [],
    layout: state.content.data ? state.content.data.layout : '',
    type: state.content.data ? state.content.data['@type'] : '',
  }),
  dispatch =>
    bindActionCreators({ getSchema, editContent, getContent }, dispatch),
)
/**
 * Display container class.
 * @class Display
 * @extends Component
 */
class DisplaySelect extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getSchema: PropTypes.func.isRequired,
    editContent: PropTypes.func.isRequired,
    getContent: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    pathname: PropTypes.string.isRequired,
    layouts: PropTypes.arrayOf(PropTypes.string),
    layout: PropTypes.string,
    type: PropTypes.string.isRequired,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    layouts: [],
    layout: '',
  };

  state = {
    selectedOption: {
      value: this.props.layout,
      label: layouts[this.props.layout],
    },
  };

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  componentWillMount() {
    this.props.getSchema(this.props.type);
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.pathname !== this.props.pathname) {
      this.props.getSchema(nextProps.type);
    }
    if (!this.props.loaded && nextProps.loaded) {
      this.props.getContent(nextProps.pathname);
    }
  }

  /**
   * On set layout handler
   * @method setLayout
   * @param {Object} event Event object
   * @returns {undefined}
   */
  setLayout = selectedOption => {
    this.props.editContent(this.props.pathname, {
      layout: selectedOption.value,
    });
    this.setState({ selectedOption });
  };

  selectValue = option => (
    <Fragment>
      <span className="Select-value-label">{option.label}</span>
    </Fragment>
  );

  optionRenderer = option => (
    <Fragment>
      <span style={{ marginRight: 'auto' }}>{option.label}</span>
      <Icon name={checkSVG} size="24px" />
    </Fragment>
  );

  render() {
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;

    return (
      <Fragment>
        <label htmlFor="display-select">View</label>
        <Select
          name="state-select"
          arrowRenderer={({ onMouseDown, isOpen }) =>
            isOpen ? (
              <Icon name={upSVG} size="24px" />
            ) : (
              <Icon name={downSVG} size="24px" />
            )
          }
          clearable={false}
          searchable={false}
          // onBlur={() => {
          //   debugger;
          // }}
          value={value}
          onChange={this.setLayout}
          options={this.props.layouts.map(item => ({
            value: item,
            label: layouts[item] || item,
          }))}
          valueRenderer={this.selectValue}
          optionRenderer={this.optionRenderer}
        />
      </Fragment>
    );
  }
}

export default DisplaySelect;
