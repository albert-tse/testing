import React from 'react';
import Widget from './Widget.component';
import { widget, widgetContainer, widgetWrapper } from './cards.style';
import numeral from 'numeral';
import moment from 'moment';

export default class Cards extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            estimatedRevenue,
            totalPosts,
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
            <Widget key='1' label="Estimated Revenue" value={estimatedRevenue === false ? false : numeral(estimatedRevenue).format('$0,0.00')} />,
            <Widget key='2' label="Total Posts" value={totalPosts === false ? false : numeral(totalPosts).format('0.00a')} />,
            <Widget key='3' label="Average Revenue per Post" value={averageRevenuePerPost === false ? false : numeral(averageRevenuePerPost).format('$0,0.00')} />,
            <Widget key='4' label={projectedRevenueLabel} value={projectedRevenue === false ? false : numeral(projectedRevenue).format('$0,0.00')} />,
        ];

        const internalWidgets = [
            <Widget key='5' label="Total Clicks" value={totalClicks === false ? false : numeral(totalClicks).format('0.00a')} />,
            <Widget key='6' label="Average Clicks Per Post" value={averageClicksPerPost === false ? false : numeral(averageClicksPerPost).format('0.00a')} />,
            <Widget key='7' label="Average CTR Per Post" value={averageCtrPerPost === false ? false : numeral(averageCtrPerPost).format('0.00a')} />,
            <Widget key='8' label="Average Reach Per Post" value={averageReachPerPost === false ? false : numeral(averageReachPerPost).format('0.00a')} />,
            <Widget key='9' label="Posts Per Day" value={postsPerDay === false ? false : numeral(postsPerDay).format('0.00a')} />,
            <Widget key='10' label="Clicks Per Day" value={clicksPerDay === false ? false : numeral(clicksPerDay).format('0.00a')} />,
            <Widget key='11' label="Reach Per Day" value={reachPerDay === false ? false : numeral(reachPerDay).format('0.00a')} />,
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
