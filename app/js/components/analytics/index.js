import React from 'react';
import { List, ListItem, ListSubHeader } from 'react-toolbox';
import Config from '../../config';
import styles, { analytics, content, subheader } from './styles';

export default class Analytics extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={content}>
                <section className={analytics}>
                    {this.props.children}
                </section>
            </div>
        );
    }
}

export Accounting from './Accounting.component';
export Dashboard from './Dashboard.component';
export GlobalStats from './GlobalStats.component';
