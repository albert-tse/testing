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
                <nav className="mdl-navigation mdl-list">
                    <Link className="mdl-navigation__link mdl-list__item" to="/explore">
                        <span className="mdl-list__item-primary-content">
                            <i className="material-icons mdl-list__item-icon">explore</i>Explore
                        </span>
                    </Link>
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
