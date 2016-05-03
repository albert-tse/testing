import React from 'react';
import Config from '../../config';
import { Header } from '../shared';
import Toolbar from '../shared/toolbar';
import LegacyTemplates from '../legacy_templates'
import FilterActions from '../../actions/Filter.action'
import AuthStore from '../../stores/Auth.store'
import AuthActions from '../../actions/Auth.action'


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        window.altHack = {
            auth: {
                store: AuthStore,
                actions: AuthActions
            },
            FilterActions: FilterActions
        };

        // TODO: BAD BAD legacy code
        if (window.dashboardApp) {
            dashboardApp.initialize();
        } else {
            var loadjs = function (d, s, id, url) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = url;
                fjs.parentNode.insertBefore(js, fjs);
            };

            loadjs(document, 'script', 'foundation', 'js/legacy/foundation.js');
            loadjs(document, 'script', 'legacy-dashboard', 'js/legacy/dashboard.js');
        }
    }

    render() {
        return (
            <div id="app" className="dashboard tab">
                <link rel='stylesheet' href='css/legacy.css' />
                <Header />
                <Toolbar type='dashboard' />
                <div className="container-fluid row">
                    <div className="main">
                        <div id="publisher-stats">
                            <div>
                                <h1>TOTAL CLICKS</h1>
                                <p id="totalClicks"></p>
                            </div>
                            <div>
                                <h1>ESTIMATED&nbsp;
                                    <span id="aggregated-cost-or-revenue"> COST</span>
                                </h1>
                                <p id="estimatedCost"></p>
                            </div>
                            <div>
                                <h1>AVERAGE CPC</h1>
                                <p id="avgCPC"></p>
                            </div>
                        </div>
                        <div>
                            <table cellpadding="0" cellspacing="0" border="0" className="display table links-only" id="linkTable" width="100%"></table>
                        </div>
                    </div>
                    <aside className="container-fluid">
                        <div>
                            <div className="stats-filter-group hide-publisher-role" data-attribute="platform">
                                <header>
                                    Platforms
                                    <p className="stats-group-toggle" data-stats-group-id="platforms-list">
                                        <a className="check-all">All</a>|
                                        <a className="check-none">None</a>
                                    </p>
                                </header>
                                <ul id="platforms-list"></ul>
                            </div>
                            <div className="hide-publisher-role stats-filter-group" data-attribute="site_name">
                                <header>
                                    Sites
                                    <p className="stats-group-toggle" data-stats-group-id="platforms-list">
                                        <a className="check-all">All</a>|
                                        <a className="check-none">None</a>
                                    </p>
                                </header>
                                <ul id="sites-list"></ul>
                            </div>
                        </div>
                    </aside>
                </div>
                <LegacyTemplates />
            </div>
        );
    }
}

export default Dashboard;
