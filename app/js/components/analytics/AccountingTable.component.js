import React, { Component } from 'react';
import Griddle, { plugins, ColumnDefinition, RowDefinition } from 'griddle-react';

import { checkIfPinned } from './table.component';
import LinkComponent from './Link.component';
import ArticleModal from '../shared/articleModal';
import LinkCellActions from '../shared/LinkCellActions';
import { rowDataSelector, enhancedWithRowData, MinimalLayout, styleConfig, sortByTitle } from './utils';

import { isMobilePhone } from '../../utils';

import { influencer } from './table.style';
import Style, { accounting, linkComponent, linksTable, stickyHeader } from './table.style';

import classnames from 'classnames';
import numeral from 'numeral';

export default class AccountingTable extends Component {

    constructor(props) {
        super(props);
        this.setPreviewArticle = this.props.setPreviewArticle;
        this.LinkCellActionsContainer = this.LinkCellActionsContainer.bind(this);
    }

    render() {
        const isMobile = isMobilePhone();
        return (
            <Griddle
                data={this.props.links}
                components={{ Layout: MinimalLayout }}
                plugins={[plugins.LocalPlugin]}
                styleConfig={styleConfig}
            >
                <RowDefinition>
                    <ColumnDefinition
                        id="title"
                        title="My Top Earning Links"
                        customComponent={enhancedWithRowData(LinkComponent)}
                        sortMethod={sortByTitle}
                    />
                    <ColumnDefinition
                        id="revenue"
                        title="Revenue"
                        customComponent={({value}) => (
                            <span>{numeral(value).format('$0,0.00')}</span>
                        )}
                    />
                    {!isMobile && (
                        <ColumnDefinition
                            id="credited_clicks"
                            title="Clicks"
                            customComponent={({value}) => (
                                <span>{numeral(value).format('0.00a')}</span>
                            )}
                        />
                    )}
                    <ColumnDefinition
                        id="reach"
                        title="Reach"
                    />
                    <ColumnDefinition
                        id="ctr"
                        title="CTR"
                    />
                    {!isMobile && (
                        <ColumnDefinition
                            id="link"
                            title=" "
                            customComponent={enhancedWithRowData(this.LinkCellActionsContainer)}
                        />
                    )}
                </RowDefinition>
            </Griddle>
        );
    }

    LinkCellActionsContainer(props) {
        return (
            <LinkCellActions
                className={Style.showOnHover}
                props={{rowData: props.rowData}}
                setPreviewArticle={this.setPreviewArticle}
            />
        );
    };
}

