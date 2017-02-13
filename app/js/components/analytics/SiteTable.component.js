import React, { Component } from 'react';
import Griddle from 'griddle-react';
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

        return (
            <div className="griddle-container">
                <div className="griddle-body">
                    <div className={TableStyle.siteSummaryContainer}>
                        <h1>Site Click Summary</h1>
                        <table className={TableStyle.siteSummaryTable}>
                            <thead>
                                <tr>
                                    <th>Site</th>
                                    <th>Billable Clicks</th>
                                    <th>Click Cap</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.siteData.map((data, index) => {
                                    let clicks = data.siteClicks;
                                    let budget = data.siteBudget;

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
                                            <td>{data.siteName}</td>
                                            <td>{numeral(clicks).format('0,0')}</td>
                                            <td>{budget !== -1 ? numeral(budget).format('0,0') : 'None'}</td>
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
