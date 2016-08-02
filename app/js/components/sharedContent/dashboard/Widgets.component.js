import React from 'react';
import AltContainer from 'alt-container';
import InfluencerStore from '../../../stores/Influencer.store';
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
                store={InfluencerStore}
                component={Component}
                transform={ ({searchSummary, projectedRevenue}) => ({...searchSummary, projectedRevenue})}
            />
        );
    }
}

class Component extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { estimatedRevenue, totalPosts, averageRevenuePerPost, projectedRevenue } = this.props;

        const projectedRevenueLabel = `Projected Revenue (${moment().format('MMM YYYY')})`;

        return (
            <section className={widgetContainer}>
                <Widget label="Estimated Revenue" value={numeral(estimatedRevenue).format('$0,0.00')} />
                <Widget label="Total Posts" value={numeral(totalPosts).format('0.00a')} />
                <Widget label="Average Revenue per Post" value={numeral(averageRevenuePerPost).format('$0,0.00')} />
                <Widget label={projectedRevenueLabel} value={numeral(projectedRevenue).format('$0,0.00')} />
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
