import React from 'react'
import { Link } from 'react-router'
import Config from '../../config'

class Toolbar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="toolbar" className="navbar navbar-fixed-top navbar-default show-user">
                <div className="container-fluid">
                    <form className="navbar-form navbar-left">
                        <div className="form-group explore-only">
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
                            <div id="reportrange"></div>
                        </div>
                        </div>
                        <div className="form-group stats-only">
                            <label for="reportrange-stats">Filter by Date</label>
                            <div id="reportrange-stats"></div>
                        </div>
                    </form>
                    <form className="navbar-form navbar-right">
                        <div id="search-form-wrapper" className="input-group">
                            <input id="search" type="text" className="form-control" placeholder="Search # articles" aria-describedby="search-form" />
                            <span className="input-group-addon"><i className="fa fa-search"></i></span>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Toolbar;
