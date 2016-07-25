import React from 'react'
import Select from 'react-select'
import AltContainer from 'alt-container';
import SignUpStore from '../../stores/SignUp.store';
import SignUpActions from '../../actions/SignUp.action';
import debounce from 'lodash/debounce';
import classnames from 'classnames';

class InfluencerUrl extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={Component}
                stores={{
                    profile: nil => ({
                        store: SignUpStore,
                        value: SignUpStore.getState().profile
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
        return this.props !== nextProps;
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
        SignUpActions.verifyProfileUrl({ url });
    }
}

export default InfluencerUrl;
