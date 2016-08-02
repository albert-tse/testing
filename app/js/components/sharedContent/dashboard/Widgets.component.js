import React from 'react';
import AltContainer from 'alt-container';
import InfluencerStore from '../../../stores/Influencer.store';
import UserStore from '../../../stores/User.store';
import { widget, widgetContainer, widgetWrapper } from './style';
import numeral from 'numeral';
import moment from 'moment';

export default class Widgets extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                stores={
                    {
                        InfluencerStore,
                        UserStore
                    }
                }
                component={Component}
                transform={ ({InfluencerStore, UserStore}) => {
                    const stats = InfluencerStore.searchSummary;
                    const projectedRevenue = InfluencerStore.projectedRevenue;
                    const userRole = UserStore.user.role;

                    return {...stats, projectedRevenue, userRole};
                }}
            />
        );
    }
}

class Component extends React.Component {

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
            <Widget key='1' label="Estimated Revenue" value={numeral(estimatedRevenue).format('$0,0.00')} />,
            <Widget key='2' label="Total Posts" value={numeral(totalPosts).format('0.00a')} />,
            <Widget key='3' label="Average Revenue per Post" value={numeral(averageRevenuePerPost).format('$0,0.00')} />,
            <Widget key='4' label={projectedRevenueLabel} value={numeral(projectedRevenue).format('$0,0.00')} />,
        ];

        const internalWidgets = [
            <Widget key='5' label="Total Clicks" value={numeral(totalClicks).format('0.00a')} />,
            <Widget key='6' label="Average Clicks Per Post" value={numeral(averageClicksPerPost).format('0.00a')} />,
            <Widget key='7' label="Average CTR Per Post" value={numeral(averageCtrPerPost).format('0.00a')} />,
            <Widget key='8' label="Average Reach Per Post" value={numeral(averageReachPerPost).format('0.00a')} />,
            <Widget key='9' label="Posts Per Day" value={numeral(postsPerDay).format('0.00a')} />,
            <Widget key='10' label="Clicks Per Day" value={numeral(clicksPerDay).format('0.00a')} />,
            <Widget key='11' label="Reach Per Day" value={numeral(reachPerDay).format('0.00a')} />,
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

class Widget extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { label, value } = this.props;

        return (
            <div className={widget}>
                <div className={widgetWrapper}>
                    <h1>{label}</h1>
                    <strong>{value}</strong>
                </div>
            </div>
        );
    }
}
