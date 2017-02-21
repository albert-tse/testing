import React, { Component } from 'react';
import Griddle from 'griddle-react';
import _ from 'lodash';
import { checkIfPinned } from './table.component';

import { isMobilePhone } from '../../utils';

import TableStyle from './table.style';
import classnames from 'classnames';
import numeral from 'numeral';

export default class SiteTable extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const isMobile = isMobilePhone();

        let sortedData = _.orderBy(this.props.siteData, [ function(data){
                if(data.siteBudget == -1){
                    //All sites without a budget go to the bottom of the report, they will be sorted by clicks
                    return -2;
                }else if(data.siteBudget == 0){
                    //This is an error state, that needs to be manually resolved by the accounts team
                    //We put these above the general site list so that they stick out
                    return -1;
                }else{
                    //Sort the rest by the % reached
                    return data.siteClicks / data.siteBudget;
                }
            } ,"siteClicks"], ["desc","desc"]);

        return (
            <div className="griddle-container">
                <div className="griddle-body">
                    <div className={TableStyle.siteSummaryContainer}>
                        <h1>Site Click Summary</h1>
                        <table className={TableStyle.siteSummaryTable}>
                            <thead>
                                <tr>
                                    <th>Publisher</th>
                                    <th>Site</th>
                                    <th>Billable Clicks</th>
                                    <th>Click Cap</th>
                                    <th>% Reached</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map((data, index) => {
                                    let clicks = data.siteClicks;
                                    let budget = data.siteBudget;
                                    let reach = Math.round((clicks/budget)*100) + '%';
                                    if(budget == 0){
                                        reach = 'Invalid Budget';
                                    } else if(budget == -1){
                                        reach = ' -- ';
                                    }

                                    let rowClassName = '';

                                    if (budget > 0) {
                                        if (clicks >= budget) {
                                            rowClassName = TableStyle.overbudget;
                                        } else if (clicks > (budget - (budget *  0.15))) {
                                            rowClassName = TableStyle.warning;
                                        }
                                    }

                                    return (
                                        <tr key={index} className={rowClassName}>
                                            <td>{data.publisherName}</td>
                                            <td>{data.siteName}</td>
                                            <td>{numeral(clicks).format('0,0')}</td>
                                            <td>{budget !== -1 ? numeral(budget).format('0,0') : 'None'}</td>
                                            <td>{reach}</td>
                                        </tr>
                                    )
                                }
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
