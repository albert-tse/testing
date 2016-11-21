import React from 'react'
import Select from 'react-select'
import AltContainer from 'alt-container';
import UserStore from '../../stores/User.store';
import UserActions from '../../actions/User.action';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import pick from 'lodash/pick';

class InfluencerUrl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isValid: false,
            wasChanged: false,
            value: '',
            validationError: 'Please enter the twitter or facebook url for your influencer.'
        }
    }

    handleChange(event) {
        var state = this.state;
        state.wasChanged = true;
        state.isValid = this.validate(event.target.value);
        state.value = event.target.value;

        this.setState(state);
    }

    validate(input) {
        return /twitter/.test(input) || /facebook/.test(input);
    }

    isValid() {
        return this.state.isValid;
    }

    getValue() {
        return this.state.value;
    }

    forceValidation() {
        var state = this.state;
        state.wasChanged = true;
        this.setState(state);
    }

    render() {
        const feedbackIconClassName = classnames(
            'glyphicon form-control-feedback',
            this.props.isValid ? 'glyphicon-ok' : 'glyphicon-remove'
        )

        const classNames = classnames(
            'form-group',
            this.state.wasChanged && !this.state.isValid && 'has-error has-feedback',
            this.state.wasChanged && this.state.isValid && 'has-success has-feedback'
        );

        return (
            <div id="influencer-url-group" className={classNames}>
                <label htmlFor="influencer-url" className="control-label">
                    URL of your primary social media page { this.state.isValid || !this.state.wasChanged ? '' : '- ' + this.state.validationError }
                </label>
                <input
                    id="influencer-url"
                    type="text"
                    className="form-control"
                    placeholder="https://facebook.com/georgehtakei"
                    onChange={this.handleChange.bind(this)}
                />
                <span className={feedbackIconClassName}></span>
            </div>
        );
    }
}

export default InfluencerUrl;
