import React from 'react';
import NVD3Chart from 'react-nvd3';
import d3 from 'd3';
import moment from 'moment';
import numeral from 'numeral';
import classnames from 'classnames';
import _ from 'lodash';
import Style from './graph.style';

var date = new Date();

export default class Component extends React.Component {

    constructor(props) {
        super(props);
        this.configureTotalClicksGraph = this.configureTotalClicksGraph.bind(this);
    }

    componentDidMount() {
        this.updateRef = ::this.update;
        window.addEventListener('resize', this.updateRef);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateRef);
    }

    render() {
        var clicks = _.map(this.props.clicks, function(el){
            if(el.clicks == null){
                el.clicks = 0;
            }
            return el;
        });

        var numNodes = 0;

        //Check if the last node is withing the past 48 hours
        if(clicks.length >= 1){
            var lastDate = moment(clicks[length-1].date);

            console.log(lastDate.diff(moment(), 'days'));
            if( lastDate.diff(moment(), 'days') >= -1 ){
                numNodes = 2;
            }
        }

        //Check if the second to last node is withing the past 48 hours
        if(clicks.length >= 2){
            var secondToLastDate = moment(clicks[clicks.length-2].date);

            console.log(secondToLastDate.diff(moment(), 'days'));
            if( secondToLastDate.diff(moment(), 'days') >= -1 ){
                numNodes = 3;
            }
        }

        var highlight = _.slice(clicks, clicks.length-numNodes, this.props.clicks.length);

        return (
            <section className={classnames(Style.chart, Style.widget)}>
                <div className={Style.widgetWrapper}>
                    <h1>CLICKS REPORTED FOR THE LAST 48 HOURS ARE PRELIMINARY ESTIMATES</h1>
                    <NVD3Chart 
                        id="lineChart" 
                        type="lineChart" 
                        datum={[{
                            key: 'Total Clicks',
                            values: clicks,

                        },{
                            key: 'Highlight last set',
                            values: highlight
                        }]} 
                        x="date" 
                        y="clicks"
                        configure={::this.configureTotalClicksGraph}
                        showLegend={false}
                        renderStart={this.renderStart}
                        renderEnd={this.renderEnd}
                    />
                </div>
            </section>
        );
    }

    configureTotalClicksGraph(chart) {
        this.chart = chart;

        chart.color(['#45B757']);
        chart.yAxis.tickFormat(d => numeral(d).format('0.0 a'));
        chart.xAxis.rotateLabels(-60);
        chart.xAxis.tickFormat(d => moment(d).format('MMM D, YY'));
        chart.xAxis.tickValues(this.generateXAxisTicks());
        chart.margin({ "left": 50, "right": 25, "top": 10, "bottom": 100 });
        chart.forceY([0]);

        chart.tooltip.contentGenerator(function(data) {
            return `
                <div class="${Style.tooltip}">
                    <h3>${moment(data.point.date).format("ddd, MMM Do YYYY")}</h3>
                    <h4>${data.point.clicks.toLocaleString()} clicks</h4>
                </div>
            `;
        });
    }

    generateXAxisTicks(){
        return _.map(this.props.clicks, function(el){
            return el.date;
        });
    }

    renderEnd(chart){

    }

    renderStart(chart){
    }

    update(){
        if(this.chart){
            this.chart.xAxis.tickValues(this.generateXAxisTicks());
            _.defer(this.chart.update);
        }
    }
}