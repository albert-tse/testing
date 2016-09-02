import React, { Component } from 'react';
import Widget from './Widget.component';
import { widget, widgetContainer, widgetWrapper } from './cards.style';
import numeral from 'numeral';
import moment from 'moment';

export default class Cards extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            estimatedRevenue,
            totalLinkCount,
            averageRevenuePerPost,
            totalClicks,
            averageClicksPerPost,
            averageCtrPerPost,
            averageReachPerPost,
            postsPerDay,
            clicksPerDay,
            reachPerDay,
            projectedRevenue,
            userRole
        } = this.props;

        const projectedRevenueLabel = `Projected Revenue (${moment().format('MMM YYYY')})`;

        let displayWidgets = [
            <Widget key='1' label="Estimated Revenue" value={estimatedRevenue && numeral(estimatedRevenue).format('$0,0.00')} />,
            <Widget key='2' label="Total Posts" value={totalLinkCount && numeral(totalLinkCount).format('0a')} />,
            <Widget key='3' label="Average Revenue per Post" value={averageRevenuePerPost && numeral(averageRevenuePerPost).format('$0,0.00')} />,
            <Widget key='4' label={projectedRevenueLabel} value={projectedRevenue && numeral(projectedRevenue).format('$0,0.00')} />,
            <Widget key='5' label="Total Clicks" value={totalClicks && numeral(totalClicks).format('0.00a')} />,
        ];

        const internalWidgets = [
            <Widget key='6' label="Average Clicks Per Post" value={averageClicksPerPost && numeral(averageClicksPerPost).format('0.00a')} />,
            <Widget key='7' label="Average CTR Per Post" value={averageCtrPerPost && numeral(averageCtrPerPost).format('0.00a%')} />,
            <Widget key='8' label="Average Reach Per Post" value={averageReachPerPost && numeral(averageReachPerPost).format('0.00a')} />,
            <Widget key='9' label="Posts Per Day" value={postsPerDay && numeral(postsPerDay).format('0a')} />,
            <Widget key='10' label="Clicks Per Day" value={clicksPerDay && numeral(clicksPerDay).format('0.00a')} />,
            <Widget key='11' label="Reach Per Day" value={reachPerDay && numeral(reachPerDay).format('0.00a')} />,
        ];

        if (userRole === 'internal_influencer' || userRole === 'admin') {
            displayWidgets = displayWidgets.concat(internalWidgets);
        }

        return (
            <section className={widgetContainer}>
                {displayWidgets}
            </section>
        );
    }
}
