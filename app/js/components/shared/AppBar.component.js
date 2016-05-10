import React from 'react';

class AppBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header id="header" className={::this.getClassName()}>
                <div className="mdl-layout-icon"></div>
                <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title">{this.props.title}</span>
                    <div className="mdl-layout-spacer"></div>
                    {this.props.actions}
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

AppBar.propTypes = {
    title: React.PropTypes.string
};

var createAppBar = function (props) {
    return React.createClass({
        render: function () {
            return <AppBar {...props} />
        }
    });
};

// This is where you can specify which components get loaded for each AppBar
const AppBars = {
    Explore: createAppBar({
        title: 'Explore',
        actions: (
            <div className="mdl-actions">
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable
                      mdl-textfield--floating-label mdl-textfield--align-right">
                    <label className="mdl-button mdl-js-button mdl-button--icon"
                       htmlFor="search-articles">
                        <i className="material-icons">search</i>
                    </label>
                    <div className="mdl-textfield__expandable-holder">
                        <input id="search-articles" className="mdl-textfield__input" type="text" name="search" />
                    </div>
                </div>
                <button className="hidden mdl-button mdl-js-button mdl-button--icon mdl-layout--large-screen-only">
                    <i className="material-icons">view_module</i>
                </button>
                <button className="mdl-button mdl-js-button mdl-button--icon mdl-layout--large-screen-only">
                    <i className="material-icons">view_list</i>
                </button>
                <button className="mdl-button mdl-js-button mdl-button--icon">
                    <i className="material-icons">date_range</i>
                </button>
                <div id="reportrange" className="hidden"></div>
                {/*
                <button id="view-mode" className="mdl-button mdl-js-button mdl-button--icon">
                    <i className="material-icons">more_vert</i>
                </button>
                <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor="view-mode">
                    <li className="mdl-menu__item">View as Grid</li>
                    <li className="mdl-menu__item">View as List</li>
                </ul>
                */}
            </div>
        )
    }),
    Saved: createAppBar({
        title: 'Saved',
        actions: (
            <div className="mdl-actions">
                <button className="mdl-button mdl-js-button mdl-button--icon">
                    <i className="material-icons">date_range</i>
                </button>
            </div>
        )
    }),
    Settings: createAppBar({ title: 'Settings' }),
    Shared: createAppBar({ title: 'Shared' })
};

export default AppBars;
