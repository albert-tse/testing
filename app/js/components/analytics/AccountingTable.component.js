import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Griddle, { plugins, ColumnDefinition, RowDefinition } from 'griddle-react';

import { checkIfPinned } from './table.component';
import LinkComponent from './Link.component';
import ArticleModal from '../shared/articleModal';
import LinkCellActions from '../shared/LinkCellActions';
import { cloneTableHeaderForPinning, rowDataSelector, enhancedWithRowData, NoPaginationLayout, styleConfig, sortByTitle } from './utils';
import PageDropdown from '../pagination/PageDropdown.component';

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
        this.cloneTableHeaderForPinning = cloneTableHeaderForPinning.bind(this);
    }

    componentDidMount() {
        this.cloneTableHeaderForPinning(this.table);
    }

    render() {
        const isMobile = isMobilePhone();
        return (
            <div ref={table => this.table = table}>
                <Griddle
                    data={this.props.links}
                    components={{ Layout: NoPaginationLayout }}
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
                        <ColumnDefinition
                            id="credited_clicks"
                            title="Clicks"
                            customComponent={({value}) => (
                                <span>{numeral(value).format('0,0')}</span>
                            )}
                            visible={!isMobile}
                        />
                        <ColumnDefinition
                            id="reach"
                            title="Reach"
                            customComponent={({value}) => (
                                <span>{numeral(value).format('0,0')}</span>
                            )}
                        />
                        <ColumnDefinition
                            id="ctr"
                            title="CTR"
                            customComponent={({value}) => (
                                <span>{numeral(value).format('0.00')}%</span>
                            )}
                        />
                        <ColumnDefinition
                            id="link"
                            title=" "
                            customComponent={enhancedWithRowData(this.LinkCellActionsContainer)}
                            visible={!isMobile}
                        />
                    </RowDefinition>
                </Griddle>
            </div>
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

