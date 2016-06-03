import React from 'react';

export default class AppContent extends React.Component {

    constructor (props) {
        super(props);
    }

    render() {
        return (
            <div id={this.props.id} className="app content">
                {this.props.children}
            </div>
        );
    }
}
