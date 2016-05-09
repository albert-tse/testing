import React from 'react';
import AltContainer from 'alt-container';
import { Link } from 'react-router';
import Config from '../../config';
import GA from './googleAnalytics';
import InfluencerStore from '../../stores/Influencer.store';
import InfluencerActions from '../../actions/Influencer.action';
import HeaderStore from '../../stores/Header.store';
// import AuthStore from '../../stores/Auth.store';
// import AuthActions from '../../actions/Auth.action';

// TODO: Refactor this out into Header.component
class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header id="header" className={::this.getClassName()}>
                <GA />
                <div className="mdl-layout-icon"></div>
                <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title">{this.props.title}</span>
                    <div className="mdl-layout-spacer"></div>
                </div>
            </header>
        );
    }

    getClassName() {
        return [
            'mdl-layout__header',
            'className' in this.props && this.props.className
        ].filter(Boolean).join(' ');
    }
}

HeaderComponent.propTypes = {
    title: React.PropTypes.string
};

// TODO: Refactor this out to Header.container
class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer store={HeaderStore} component={HeaderComponent} />
        );
    }

    /*
    TODO: is this dead code?
    constructor(props) {
        super(props);

        this.state = {
            auth: AuthStore.getState()
        };
    }

    componentDidMount() {
        AuthStore.listen(this.onAuthChange.bind(this));
    }

    componentWillUnmount() {
        AuthStore.unlisten(this.onAuthChange.bind(this));
    }

    onAuthChange(authState) {
        var state = this.state;
        state.auth = authState;

        this.setState(state);
    }

    // TODO: We need to re-dispatch this from the offcanvas menu
    influencerChanged(event) {
        InfluencerActions.influencerChanged(event.target.value)
    }
    */

}

export default Header;
