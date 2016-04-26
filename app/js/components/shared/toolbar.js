import React from 'react'
import { Link } from 'react-router'
import Config from '../../config'

class Toolbar extends React.Component {

    constructor(props) {
        super(props);

        this.defaults = {
            scrollStrengthBuffer: 5 // the amount of pixels on the page the user must scroll thorugh before collapsing/revealing header
        };

        this.state = {
            collapse: false,
            previousDirection: false
        };
    }

    componentDidMount() {
        document.body.addEventListener('mousewheel', this.slideUp.bind(this));
    }

    componentWillUnmount() {
        document.body.removeEventListener('mousewheel', this.slideUp.bind(this));
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

    render() {
        return (
            <div id="toolbar" className={this.getClassNames()}>
                <div className="container-fluid">
                    <form className="navbar-form navbar-left">
                        <div className="form-group explore-only grid-mode-only">
                            <div className="input-group">
                                <span for="sort-by" className="minimal input-group-addon">Sort By</span>
                                <select id="sort-by" className="form-control">
                                    <option value="random">Random</option>
                                    <option value="stat_type_95 desc">Performance</option>
                                    <option value="creation_date desc">Date Published</option>
                                    <option value="ucid desc">Date Added</option>
                                    <option value="_score desc">Relevance</option>
                                    <option value="site_id desc">Site</option>
                                    <option value="title asc">Title</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group explore-only">
                        <div className="input-group">
                            <span for="reportrange" className="minimal input-group-addon">Filter by Date</span>
                            <input className="invisible form-control" style={{ width: 0, padding: 0 }} />
                            <div id="reportrange"></div>
                        </div>
                        </div>
                        <div className="form-group stats-only">
                            <label for="reportrange-stats">Filter by Date</label>
                            <div id="reportrange-stats"></div>
                        </div>
                    </form>
                    <form className="navbar-form navbar-right explore-only">
                        <div id="search-form-wrapper" className="input-group">
                            <input id="search" type="text" className="form-control" placeholder="Search # articles" aria-describedby="search-form" />
                            <span className="input-group-addon"><i className="fa fa-search"></i></span>
                        </div>
                    </form>
                    <form className="navbar-btn navbar-right explore-only">
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-default view-mode" data-mode="grid"><i className="fa fa-th"></i></button>
                            <button type="button" className="btn btn-default view-mode" data-mode="table"><i className="fa fa-th-list"></i></button>
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
                </div>
            </div>
        );
    }

    slideUp(e) {
        var currentDirection = e.deltaY > 0; // ? 'down' : 'up';
        
        if (currentDirection !== this.state.previousDirection && e.deltaY !== 0) {
            this.setState({ collapse: currentDirection, previousDirection: currentDirection });
        }
    }

    getClassNames() { // TODO: require classnames module instead
        var defaultClassNames = "navbar navbar-fixed-top navbar-default show-user";
        return defaultClassNames + (this.state.previousDirection ? ' slide-up ' : '');
    }

}

export default Toolbar;
