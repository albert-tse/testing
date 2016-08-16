import React, { Component } from 'react';
import Widget from './Widget.component';
import { AppContent } from '../shared';
import { Toolbars } from '../toolbar';
import numeral from 'numeral';
import { widgetContainer } from './cards.style';
import { content } from './styles';
import AccountingTable from './AccountingTable.component';

export default class Accounting extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const estimatedRevenue = 102993.89;
        const projectedRevenueLabel = 'Project Revenue (Aug 2016)';
        const projectedRevenue = 189300.00;
        const totalPosts = 3000992;

        return (
            <div className={content}>
                <Toolbars.Accounting />
                <AppContent>
                    <section className={widgetContainer}>
                        <Widget label="Estimated Revenue" value={estimatedRevenue === false ? false : numeral(estimatedRevenue).format('$0,0.00')} />
                        <Widget label={projectedRevenueLabel} value={projectedRevenue === false ? false : numeral(projectedRevenue).format('$0,0.00')} />
                        <Widget label="Total Posts" value={ totalPosts > 999 ? numeral(totalPosts).format('0.00a') : totalPosts } />
                    </section>
                    <AccountingTable />
                </AppContent>
            </div>
        );
    }

}
