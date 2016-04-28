import React from 'react';


class InfluencerPostStats extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="influencer">
                <h2>{this.props.name}</h2>
                {this.props.platforms.map(function (platform, index) {
                    return (
                        <Platform key={index} 
                                  name={platform.name}
                                  shortlink={platform.shortlink}
                                  stats={platform.stats} />
                    );
                })}
            </div>
        );
    }
}

class Platform extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var stats = 'stats' in this.props && this.props.stats.length > 0 ? this.props.stats.map(function (stat, index) {
            return (<Stat key={index} name={stat.name} value={stat.value} />);
        }) : (<li className="list-group-item">There are no stats available for this link.</li>);

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <strong>{this.props.name}</strong>
                    <a href={this.props.shortlink} target="_blank">{this.props.shortlink}</a>
                </div>
                <ul className="list-group">
                    {stats}
                </ul>
            </div>
        );
    }
}

class Stat extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li className="list-group-item">
                <strong>{this.props.name}</strong>
                {this.props.value}
            </li>
        );
    }
}


export default InfluencerPostStats;
