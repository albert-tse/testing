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

var createAppBar = function(props) {
    return React.createClass({
        render: function() {
            return <AppBar {...props} />
        }
    });
};

var showDatePicker = function(datePicker) {
    var triggerButton = datePicker.currentTarget.parentElement.querySelector('.comiseo-daterangepicker-triggerbutton');
    triggerButton.click();
};

const BrowseActions = (
    <div className="mdl-actions">
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable
              mdl-textfield--floating-label mdl-textfield--align-right">
            <label className="mdl-button mdl-js-button mdl-button--icon"
               htmlFor="search">
                <i className="material-icons">search</i>
            </label>
            <div className="mdl-textfield__expandable-holder">
                <input id="search" className="mdl-textfield__input" type="text" name="search" />
            </div>
        </div>
        <button className="mdl-button mdl-js-button mdl-button--icon" onClick={showDatePicker}>
            <i className="material-icons">date_range</i>
        </button>
        <div id="reportrange" className="hidden"></div>
        <label htmlFor="sort-by" className="mdl-button mdl-js-button mdl-button--icon mdl-layout--large-screen-only">
            <i className="material-icons">sort</i>
        </label>
        <select id="sort-by" className="mdl-layout--large-screen-only">
            <option value="random">Random</option>
            <option value="stat_type_95 desc">Performance</option>
            <option value="creation_date desc">Date Published</option>
            <option value="ucid desc">Date Added</option>
            <option value="_score desc">Relevance</option>
            <option value="site_id desc">Site</option>
            <option value="title asc">Title</option>
        </select>
        <button className="view-mode mdl-button mdl-js-button mdl-button--icon mdl-layout--large-screen-only" data-mode="grid">
            <i className="material-icons">view_module</i>
        </button>
        <button className="view-mode mdl-button mdl-js-button mdl-button--icon mdl-layout--large-screen-only" data-mode="table">
            <i className="material-icons">view_list</i>
        </button>
    </div>
);

const SettingsActions = (
    <div className="mdl-actions">
        <button className="mdl-button mdl-js-button mdl-button--icon mdl-layout--small-screen-only">
            <i className="material-icons">save</i>
        </button>
        <button className="mdl-button mdl-button--accent mdl-js-button mdl-layout--large-screen-only">Save</button>
    </div>
);

// This is where you can specify which components get loaded for each AppBar
const AppBars = {

    Explore: createAppBar({
        title: 'Explore',
        actions: BrowseActions
    }),

    Recommended: createAppBar({
        title: 'Recommended',
        actions: BrowseActions
    }),

    Saved: createAppBar({
        title: 'Saved'
    }),

    Related: createAppBar({
        title: 'Related Articles'
    }),

    Settings: createAppBar({
        title: 'Settings'
            // actions: SettingsActions
    }),

    Shared: createAppBar({
        title: 'Shared Content',
        actions: (
            <div className="mdl-actions">
                <label htmlFor="reportrange-stats" className="mdl-button mdl-js-button mdl-button--icon mdl--layout-large-screen-only">
                    <i className="material-icons">date_range</i>
                </label>
                <div id="reportrange-stats"></div>
            </div>
        )
    }),

    Trending: createAppBar({
        title: 'Trending Now',
        actions: BrowseActions
    })
};

export default AppBars;
