import React from 'react';
import { Link } from 'react-router';

class Drawer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        /* If necessary, we can extract the fixed-drawer and fixed-header classNames into props so we can modify header but I don't see us doing that at the moment */
        return (
            <div className="mdl-layout__drawer">
                <div className="influencer-switcher mdl-color--blue-grey-600">
                    <div className="dropdown">
                        <select id="partner" className="navbar-text show-user" onChange={this.influencerChanged}></select>
                        <button className="mdl-button mdl-button--icon">
                            <i className="material-icons">arrow_drop_down</i>
                        </button>
                    </div>
                </div>
                <nav className="mdl-navigation mdl-list">
                    <header>Browse</header>
                    <Link className="mdl-navigation__link mdl-list__item" to="/explore">
                        <span className="mdl-list__item-primary-content">
                            <i className="material-icons mdl-list__item-icon">explore</i>Explore
                        </span>
                    </Link>
                    <a className="mdl-navigation__link mdl-list__item">
                        <span className="mdl-list__item-primary-content">
                            <i className="material-icons mdl-list__item-icon">trending_up</i>Trending Now
                        </span>
                    </a>
                    <a className="mdl-navigation__link mdl-list__item">
                        <span className="mdl-list__item-primary-content">
                            <i className="material-icons mdl-list__item-icon">thumb_up</i>Recommended
                        </span>
                    </a>
                </nav>
                <nav className="mdl-navigation mdl-list">
                    <header>Collections</header>
                    <Link className="mdl-navigation__link mdl-list__item" to="/saved">
                        <span className="mdl-list__item-primary-content">
                            <i className="material-icons mdl-list__item-icon">bookmark</i>Saved
                        </span>
                    </Link>
                    <Link className="mdl-navigation__link mdl-list__item" to="/dashboard">
                        <span className="mdl-list__item-primary-content">
                            <i className="material-icons mdl-list__item-icon">share</i>Shared
                        </span>
                    </Link>
                </nav>
                <nav className="mdl-navigation mdl-list">
                    <Link className="mdl-navigation__link mdl-list__item" to="/settings">
                        <span className="mdl-list__item-primary-content">
                            <i className="material-icons mdl-list__item-icon">settings</i>Settings
                        </span>
                    </Link>
                </nav>
            </div>
        );
    }

}

Drawer.propTypes = {
    title: React.PropTypes.string
};

export default Drawer;
