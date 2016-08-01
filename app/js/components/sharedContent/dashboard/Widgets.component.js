import React from 'react';
import AltContainer from 'alt-container';
import InfluencerStore from '../../../stores/Influencer.store';
import { widget, widgetContainer, widgetWrapper } from './style';
import numeral from 'numeral';

export default class Widgets extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                store={InfluencerStore}
                component={Component}
                transform={ ({searchSummary}) => ({...searchSummary})}
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

        return (
            <section>
                <Widget label="Estimated Revenue" value={numeral(estimatedRevenue).format('$0,0.00')} />
                <Widget label="Total Posts" value={numeral(totalPosts).format('0.00a')} />
                <Widget label="Average Revenue per Post" value={numeral(averageRevenuePerPost).format('$0,0.00')} />
                <Widget label="Projected Revenue" value={numeral(projectedRevenue).format('$0,0.00')} />
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
                    <span>{value}</span>
                </div>
            </div>
        );
    }
}
