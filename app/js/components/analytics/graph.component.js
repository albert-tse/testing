import React from 'react';
import NVD3Chart from 'react-nvd3';
import d3 from 'd3';
import moment from 'moment';
import numeral from 'numeral';
import classnames from 'classnames';
import Style from './graph.style';

var date = new Date();

export default class Component extends React.Component {

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
                        id="lineChart" 
                        type="lineChart" 
                        datum={[{
                            key: 'Total Clicks',
                            values: this.props.clicks
                        }]} 
                        x="date" 
                        y="clicks"
                        configure={::this.configureTotalClicksGraph}
                        useInteractiveGuideline={true}
                        showLegend={false}
                        callback={this.reconf}
                    />
                </div>
            </section>
        );
    }

    configureTotalClicksGraph(chart) {
        //useInteractiveGuideline={false}
        chart.color(['#45B757']);
        chart.tooltip.contentGenerator(function(data) {
            return `
                <div class="${Style.tooltip}">
                    <h3>${data.point.clicks.toLocaleString()} clicks</h3>
                    <h4>${moment(data.point.date).format("dddd, MMMM Do YYYY")}</h4>
                </div>
            `;
        });
        chart.yAxis.tickFormat(d => numeral(d).format('0.0 a'));
        chart.xAxis.rotateLabels(-60);
        chart.xAxis.tickFormat(d => moment(d).format('MMM D, YY'));
        chart.xAxis.tickValues(_.map(this.props.clicks, function(el){
            return el.date;
        }));
        chart.margin({ "left": 100, "right": 25, "top": 10, "bottom": 100 });
        chart.forceY([0]);
    }

    reconf(){
        console.log('reconfigure');
    }
}