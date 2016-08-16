import React from 'react';
import { List, ListItem, ListSubHeader } from 'react-toolbox';
import Config from '../../config';
import { Toolbars } from '../toolbar';
import { analytics, content, subheader } from './styles';

export default class Analytics extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Toolbars.Analytics />
                <section className={analytics}>
                    <aside>
                        <List selectable ripple>
                            <ListSubHeader caption='Change Views' theme={{subheader}} />
                            <ListItem
                                caption="Dashboard"
                                leftIcon="trending_up"
                                to={'#' + Config.routes.analytics + '/' + Config.routes.dashboard}
                            />
                            <ListItem
                                caption="Accounting"
                                leftIcon="attach_money"
                                to={'#' + Config.routes.analytics + '/' + Config.routes.accounting}
                            />
                        </List>
                    </aside>
                    {this.props.children}
                </section>
            </div>
        );
    }
}

export Dashboard from './Dashboard.component';
