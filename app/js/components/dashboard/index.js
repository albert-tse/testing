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
            var wait = setInterval(function () {
                if (window.angular) {
                    loadjs(document, 'script', 'legacy-dashboard', 'js/legacy/dashboard.js');

                    clearInterval(wait);
                }
            }, 10);
        }
    }

    render() {
        return (
            <div id="app">
                <link rel='stylesheet' href='css/legacy.css' />
                <Header />
                <Toolbar type='dashboard' />
                <div class="stats-only">
                    <div id="publisher-stats">
                        <div>
                            <h1>TOTAL CLICKS</h1>
                            <p id="totalClicks"></p>
                        </div>
                        <div>
                            <h1>ESTIMATED
                                <span id="aggregated-cost-or-revenue">COST</span>
                            </h1>
                            <p id="estimatedCost"></p>
                        </div>
                        <div>
                            <h1>AVERAGE CPC</h1>
                            <p id="avgCPC"></p>
                        </div>
                    </div>
                    <div>
                        <table cellpadding="0" cellspacing="0" border="0" class="display links-only" id="linkTable" width="100%"></table>
                    </div>
                </div>
                <LegacyTemplates />
            </div>
        );
    }
}

export default Dashboard;
