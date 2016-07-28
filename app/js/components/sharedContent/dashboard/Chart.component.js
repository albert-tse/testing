import React from 'react';
import AltContainer from 'alt-container';
import InfluencerStore from '../../../stores/Influencer.store';
import NVD3Chart from 'react-nvd3';
import d3 from 'd3';
import moment from 'moment';
import numeral from 'numeral';
import classnames from 'classnames';
import Style from './style';

export default class Chart extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                store={InfluencerStore}
                component={Component}
                transform={props => ({ clicks: props.searchedClickTotals })}
            />
        );
    }

}

class Component extends React.Component {

    constructor(props) {
        super(props);
        this.configureTotalClicksGraph = this.configureTotalClicksGraph.bind(this);
    }

    render() {
        return (
            <section className={classnames(Style.chart, Style.widget)}>
                <div className={Style.widgetWrapper}>
                    <h1>Total Clicks Per Day</h1>
                    <NVD3Chart 
                        id="barChart" 
                        type="discreteBarChart" 
                        datum={[{
                            key: 'Total Clicks',
                            values: this.props.clicks
                        }]} 
                        x="date" 
                        y="clicks"
                        configure={this.configureTotalClicksGraph}
                    />
                </div>
            </section>
        );
    }

    configureTotalClicksGraph(chart) {
        chart.tooltip.contentGenerator(function(data) {
            return `
                <div class="${Style.tooltip}">
                    <h3>${data.data.clicks.toLocaleString()} clicks</h3>
                    <h4>${moment(data.data.date).format("dddd, MMMM Do YYYY")}</h4>
                </div>
            `;
        });
        chart.xAxis.tickFormat(d => moment(d).format('D MMM YYYY'));
        chart.xAxis.rotateLabels(-45);
        chart.yAxis.tickFormat(d => numeral(d).format('0.0a'));
        chart.margin({ "left": 100, "right": 25, "top": 10, "bottom": 100 })
    }
}
