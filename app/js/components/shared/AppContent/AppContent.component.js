import React from 'react';
import classnames from 'classnames';
import Styles from './style';

export default class AppContent extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id={this.props.id} className={classnames(Styles.scrollpane, 'className' in this.props && this.props.className)} onScroll={this.props.onScroll}>
                {this.props.children}
            </div>
        );
    }
}
