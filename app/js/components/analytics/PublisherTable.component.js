import React, { Component } from 'react';
import Griddle from 'griddle-react';
import { checkIfPinned } from './table.component';

import { isMobilePhone } from '../../utils';

import TableStyle from './table.style';
import classnames from 'classnames';
import numeral from 'numeral';

export default class PublisherTable extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const isMobile = isMobilePhone();

        return (
            <div className="griddle-container">
                <div className="griddle-body">
                    <div className={TableStyle.publisherSummaryContainer}>
                        <h1>Publisher Click Summary</h1>
                        <table className={TableStyle.publisherSummaryTable}>
                            <thead>
                                <tr>
                                    <th>Publisher</th>
                                    <th>Billable Clicks</th>
                                    <th>Budget</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.publisherData.map((data, index) => {
                                    let clicks = data.publisherClicks;
                                    let budget = data.publisherBudget;

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
