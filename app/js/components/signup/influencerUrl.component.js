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
        this.isValid = nil => UserStore.getState().profile.isVerified;
        this.forceValidation = nil => true;
        this.getValue = nil => UserStore.getState().profile;
    }

    render() {
        return (
            <AltContainer
                component={Component}
                stores={{
                    profile: nil => ({
                        store: UserStore,
                        value: UserStore.getState().profile
                    })
                }}
            />
        );
    }
}

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.verify = debounce(this.verify, 500);
    }

    shouldComponentUpdate(nextProps) {
        return this.props.profile !== nextProps.profile;
    }

    componentDidUpdate() {
        console.log('I updated', this.props.profile);
    }

    render() {
        const { isVerifying, isVerified, error } = this.props.profile;
        const feedbackIconClassName = classnames(
            'glyphicon form-control-feedback',
            isVerified ? 'glyphicon-ok' : 'glyphicon-remove'
        )
        const classNames = classnames(
            'form-group',
            !isVerifying && error && 'has-error has-feedback',
            !isVerifying && isVerified && 'has-success has-feedback'
        );

        return (
            <div id="influencer-url-group" className={classNames}>
                <label htmlFor="influencer-url" className="control-label">
                    Profile URL
                    {!isVerifying && error && ` - ${error}`}
                </label>
                <input
                    id="influencer-url"
                    type="text"
                    className="form-control"
                    placeholder="https://facebook.com/georgehtakei"
                    onChange={this.onChange}
                />
                <span className={feedbackIconClassName}></span>
            </div>
        );
    }

    onChange({ nativeEvent: { target: { value } } }) {
        this.verify(value);
    }

    verify(url) {
        UserActions.verifyProfileUrl({ url });
    }

    isValid() {
        const { isVerified, error } = UserStore.getState();
        return isVerified && !error;
    }

    getValue() {
        return UserStore.getState().profile;
    }
}

export default InfluencerUrl;
