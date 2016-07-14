import React from 'react';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import NVD3Chart from 'react-nvd3'
import moment from 'moment'
import d3 from 'd3'
import Style from './style';
import numeral from 'numeral';


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
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
        chart.xAxis
            .tickFormat(function(d) {
                return d3.time.format('%x')(new Date(d))
            });
        chart.xAxis.rotateLabels(-45);
        chart.margin({ "left": 100, "right": 25, "top": 10, "bottom": 100 })
    }

    render() {
        var totalClicks = _.reduce(this.props.links.links, function(accum, el) {
            return accum + el.total_clicks;
        }, 0);

        var estimatedRevenue = _.reduce(this.props.links.links, function(accum, el) {
            return accum + el.cost;
        }, 0);

        var totalPosts = this.props.links && this.props.links.links ? this.props.links.links.length : 0;

        var averageCPP = totalClicks / totalPosts; // Cannot divide by 0

        var totalClicksGraphData = [{
            key: 'Total Clicks',
            values: this.props.clicks
        }];

        return (
            <div className={Style.dashboard}>
                <Card className={Style.quarterCard} raised>
                    <CardTitle
                        subtitle={ numeral(totalClicks).format('0,0') }
                        title="Total Clicks"
                    />
                </Card>
                <Card className={Style.quarterCard} raised>
                    <CardTitle
                        subtitle={ numeral(estimatedRevenue).format('$0,0.00') }
                        title="Estimated Revenue"
                    />
                </Card>
                <Card className={Style.quarterCard} raised>
                    <CardTitle
                        subtitle={ numeral(totalPosts).format('0,0') }
                        title="Total Posts"
                    />
                </Card>
                <Card className={Style.quarterCard} raised>
                    <CardTitle
                        subtitle={ Number.isNaN(averageCPP) ? '0' : numeral(averageCPP).format('0,0.00') }
                        title="Avg. Clicks/Post"
                    />
                </Card>
                <Card className={Style.fullCard} raised>
                    <CardTitle
                        title="Total Clicks Per Day"
                    />
                    <CardMedia>
                        <NVD3Chart 
                            id="barChart" 
                            type="discreteBarChart" 
                            datum={totalClicksGraphData} 
                            x="date" 
                            y="clicks"
                            configure={ ::this.configureTotalClicksGraph }
                        />
                    </CardMedia>
                </Card>
            </div>
        );
    }
}

export default Dashboard;
