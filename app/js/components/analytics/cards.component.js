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
            totalLinkCount,
            totalClicks,
            averageClicksPerPost,
            averageCtrPerPost,
            averageReachPerPost,
            postsPerDay,
            clicksPerDay,
            reachPerDay,
            userRole
        } = this.props;

        let displayWidgets = [
            <Widget key='1' label="Total Posts" value={totalLinkCount && numeral(totalLinkCount).format('0a')} />,
            <Widget key='2' label="Total Clicks" value={totalClicks && numeral(totalClicks).format('0.00a')} />,
            <Widget key='3' label="Average Clicks Per Post" value={averageClicksPerPost && numeral(averageClicksPerPost).format('0.00a')} />,
            <Widget key='4' label="Posts Per Day" value={postsPerDay && numeral(postsPerDay).format('0a')} />,
        ];

        const internalWidgets = [
            <Widget key='5' label="Average CTR Per Post" value={averageCtrPerPost && numeral(averageCtrPerPost).format('0.00a%')} />,
            <Widget key='6' label="Average Reach Per Post" value={averageReachPerPost && numeral(averageReachPerPost).format('0.00a')} />,
            <Widget key='7' label="Clicks Per Day" value={clicksPerDay && numeral(clicksPerDay).format('0.00a')} />,
            <Widget key='8' label="Reach Per Day" value={reachPerDay && numeral(reachPerDay).format('0.00a')} />
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
