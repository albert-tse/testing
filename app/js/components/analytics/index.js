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
                    <aside>
                        <List selectable ripple>
                            <ListSubHeader caption='Switch Views' />
                            <ListItem
                                disabled={/dashboard/.test(this.props.location.pathname)}
                                caption="Dashboard"
                                leftIcon="trending_up"
                                to={'#' + Config.routes.analytics + '/' + Config.routes.dashboard}
                            />
                            <ListItem
                                disabled={/accounting/.test(this.props.location.pathname)}
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

export Accounting from './Accounting.component';
export Dashboard from './Dashboard.component';
