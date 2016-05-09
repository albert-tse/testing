import React from 'react'
import { Link } from 'react-router'
import Config from '../../config'
import GA from './googleAnalytics'
import AuthStore from '../../stores/Auth.store'
import AuthActions from '../../actions/Auth.action'
import InfluencerStore from '../../stores/Influencer.store'
import InfluencerActions from '../../actions/Influencer.action'

class Header extends React.Component {
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

    influencerChanged(event) {
        InfluencerActions.influencerChanged(event.target.value)
    }

    generateNavbar() {
        var navBar = false;

        if (this.state.auth.isAuthenticated) {
            navBar =
                <nav className="navbar-collapse">
                    <ul className="nav navbar-nav navbar-left show-user">
                        <li className="tab"><Link id="explore" to="/explore" activeClassName="active" data-name="explore">Explore</Link></li>
                        <li className="tab"><Link id="saved" to="/saved" activeClassName="active" data-name="saved">Saved</Link></li>
                        <li className="tab"><Link id="my-links" to="/dashboard" activeClassName="active" data-name="stats">Dashboard</Link></li>
                    </ul>
                    <div className="navbar-text navbar-right">
                        <a type="button" id="settings"><i className="fa fa-lg fa-ellipsis-v"></i></a>
                    </div>
                </nav>;
        }

        return navBar;
    }

    render() {
        return (
            <header id="header" className={::this.getClassName()}>
                <GA />
                <div className="mdl-layout-icon"></div>
                <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title">{this.props.title}</span>
                    <div className="mdl-layout-spacer"></div>

                    { /*this.generateNavbar()*/ }
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

Header.propTypes = {
    title: React.PropTypes.string
};

export default Header;
