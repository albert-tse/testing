import React from 'react'
import { Link } from 'react-router'
import Config from '../../config'

class Toolbar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="toolbar" className="navbar navbar-fixed-top navbar-default">
                <div className="container-fluid">
                    <form className="navbar-form navbar-left">
                        <div className="form-group">
                            <label for="partner">Influencer</label>
                            <select id="partner" className="form-control"></select>
                        </div>
                        <div className="form-group explore-only">
                            <label for="sort-by">Sort By</label>
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
                        <div className="form-group explore-only">
                            <label for="reportrange">Filter by Date</label>
                            <div id="reportrange"></div>
                        </div>
                        <div className="form-group stats-only">
                            <label for="reportrange-stats">Filter by Date</label>
                            <div id="reportrange-stats"></div>
                        </div>
                    </form>
                    <form className="navbar-form navbar-right">
                        <div id="search-form-wrapper" className="input-group">
                            <input id="search-form" type="text" className="form-control" placeholder="Search # articles" aria-describedby="search-form" />
                            <span className="input-group-addon"><i className="fa fa-search"></i></span>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Toolbar;
