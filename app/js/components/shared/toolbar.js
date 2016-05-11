import React from 'react'
import { Link } from 'react-router'
import Config from '../../config'
import FilterStore from '../../stores/Filter.store'
import FilterActions from '../../actions/Filter.action'

class Toolbar extends React.Component {

    constructor(props) {
        super(props);

        let toolbarType = props.type || 'default'

        this.state = {
            type: toolbarType
        };
    }

    /**
     * Pops open a new tab containing just the selected articles
     * Also copies to clipboard the permalink
     * @param Event that triggered this
     * TODO: Bad code including the DOM here when it should only contain virtual DOM;
     *       Refactor without using document once the feed is moved into a React.Component
     *       In the future, it will just dispatch an action
     */
    sharePermalink(e) {
        feed.sharePermalink();
    }

    /**
     * Select all visible articles
     * @param Event
     */
    selectAll(e) {
        feed.selectAll();
    }

    /**
     * Deselect any selected articles
     * @param Event
     */
    cancelSelection(e) {
        feed.cancelSelection();
    }

    handleTrendingChange(e) {
        FilterActions.trendingChanged(e.target.checked)
    }

    handleRelevantChange(e) {
        FilterActions.relevantChanged(e.target.checked)
    }

    /**
     * Mark enabled the selected articles
     * @param Event
     */
    enableAll(e) {
        feed.enableAll(true);
    }

    /**
     * Mark disabled the selected articles
     * @param Event
     */
    disableAll(e) {
        feed.enableAll(false);
    }


    generateExploreToolbar() {
        return (
            <div className="container-fluid">
                <form className="navbar-form navbar-left">
                    <div className="form-group grid-mode-only">
                        <div className="input-group">
                            <select id="sort-by" className="form-control">
                                <option value="random">Random</option>
                                <option value="stat_type_95 desc">Performance</option>
                                <option value="creation_date desc">Date Published</option>
                                <option value="ucid desc">Date Added</option>
                                <option value="_score desc">Relevance</option>
                                <option value="site_id desc">Site</option>
                                <option value="title asc">Title</option>
                            </select>
                            <label for="sort-by" className="minimal input-group-addon mobile-only"><i className="fa fa-caret-down"></i></label>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group">
                            <span for="reportrange" className="minimal input-group-addon"><i className="fa fa-calendar"></i></span>
                            <input className="invisible form-control" style={{ width: 0, padding: 0 }} />
                            <div id="reportrange"></div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group">
                            <label>
                              <input type="checkbox"
                                onChange={this.handleTrendingChange} />
                              <span> Trending Now<i className="fa fa-fire"></i></span>
                            </label>
                        </div>
                        <div className="input-group">
                            <label>
                              <input type="checkbox"
                                onChange={this.handleRelevantChange} />
                              <span> Recommended for You</span>
                            </label>
                        </div>
                    </div>
                </form>
                <form id="selection-tools" className="navbar-btn navbar-nav select-mode-only">
                    <div className="btn-group" role="group">
                        <button type="button" className="btn btn-default" onClick={this.selectAll}><i className="fa fa-check"></i> Select All</button>
                        <button type="button" className="btn btn-default" onClick={this.cancelSelection}><i className="fa fa-remove"></i> Cancel</button>
                    </div>
                    <div className="btn-group" role="group">
                        <button type="button" className="btn btn-default" onClick={this.enableAll}><i className="fa fa-check-circle"></i> Mark Enabled</button>
                        <button type="button" className="btn btn-default" onClick={this.disableAll}><i className="fa fa-ban"></i> Mark Disabled</button>
                        <button type="button" className="btn btn-default" onClick={this.sharePermalink}><i className="fa fa-share"></i> Share Permalink</button>
                    </div>
                </form>
                <div className="navbar-right">
                    <a id="g-signin2" className="navbar-text show-guest"></a>
                    <select id="partner" className="navbar-text show-user" onChange={this.influencerChanged}></select>
                    <label htmlFor="partner" id="greeting" className="navbar-text show-user mobile-only"><i className="fa fa-caret-down"></i></label>
                </div>
                <form id="view-modes" className="navbar-form navbar-right">
                    <div className="btn-group" role="group">
                        <button type="button" className="btn btn-default view-mode" data-mode="grid"><i className="fa fa-th"></i></button>
                        <button type="button" className="btn btn-default view-mode" data-mode="table"><i className="fa fa-th-list"></i></button>
                    </div>
                </form>
                <form className="navbar-form navbar-right">
                    <div id="search-form-wrapper" className="input-group">
                        <input id="search" type="text" className="form-control" placeholder="Search # articles" aria-describedby="search-form" />
                        <label htmlFor="search" className="input-group-addon"><i className="fa fa-search"></i></label>
                    </div>
                </form>
            </div>
        );
    }

    generateDashboardToolbar() {
        return (
            <div className="container-fluid">
                <form className="navbar-form navbar-left">
                    <div className="form-group">
                        <label for="reportrange-stats"><i className="fa fa-calendar"></i></label>
                        <div id="reportrange-stats"></div>
                    </div>
                </form>
            </div>
        );
    }

    generateDefaultToolbar() {
        return (
            <div className="container-fluid">
            </div>
        );
    }

    generateToolbar() {
        return;
        switch (this.state.type) {
            case 'dashboard':
                return this.generateDashboardToolbar();
                break;
            case 'explore':
                return this.generateExploreToolbar();
            default:
                return this.generateDefaultToolbar();
                break;
        }
    }

    render() {
        return (
            <div id="toolbar" className={this.getClassNames()}>
                    { this.generateToolbar() }
            </div>
        );
    }

    getClassNames() { // TODO: require classnames module instead
        var defaultClassNames = "navbar navbar-fixed-top navbar-default show-user";
        return defaultClassNames + (this.state.previousDirection ? ' slide-up ' : '');
    }

}

export default Toolbar;
