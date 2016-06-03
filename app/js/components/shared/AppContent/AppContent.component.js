import React from 'react';
import Styles from './style';

export default class AppContent extends React.Component {

    constructor (props) {
        super(props);
    }

    render() {
        return (
            <div id={this.props.id} className={Styles.scrollpane}>
                {this.props.children}
            </div>
        );
    }
}
