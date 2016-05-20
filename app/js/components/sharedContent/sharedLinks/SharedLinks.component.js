import React from 'react'
import { Table, Column, Cell } from 'fixed-data-table'
import { Button, IconButton } from 'react-toolbox/lib/button'
import classNames from 'classnames'
import moment from 'moment'
import Styles from './style'


class HeaderCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Cell className={classNames([Styles.headerCell, this.props.isDescending ? Styles.isDescending : false])}>
                {this.props.title}
                <IconButton 
                    icon='sort' 
                    onClick={ (event) => (this.props.sort(event, this.props.dataProp)) } 
                    accent={ this.props.isSorted }
                    floating 
                    mini 
                    invert />
            </Cell>
        );
    }
}

class FormattedCell extends React.Component {
    constructor(props) {
        super(props);
    }

    renderContent() {
        if (this.props.dataType == exports.CellDataTypes.link) {
            return this.renderLink();
        } else if (this.props.dataType == exports.CellDataTypes.date) {
            return this.renderDate();
        } else {
            return this.renderDefault();
        }
    }

    renderDefault() {
        return this.props.rowData[this.props.dataProp];
    }

    renderDate() {
        return (
            <span>
                <span className={Styles.cellLink}>{this.props.rowData[this.props.dataProp]}</span>
                <IconButton 
                    icon='open_in_new' 
                    onClick={ openLink.bind(this) } 
                    accent={ this.props.isSorted }
                    floating 
                    mini 
                    invert />
            </span>
        );
    }

    renderLink() {
        var openLink = function() {
            var newWindow = window.open(this.props.rowData[this.props.dataProp], '_blank');
            newWindow.blur();
            window.focus();
        }

        return (
            <span>
                <span className={Styles.cellLink}>{this.props.rowData[this.props.dataProp]}</span>
                <IconButton 
                    icon='open_in_new' 
                    onClick={ openLink.bind(this) } 
                    accent={ this.props.isSorted }
                    floating 
                    mini 
                    invert />
            </span>
        );
    }

    render() {
        return (
            <Cell>
                { ::this.renderContent() }               
            </Cell>
        );
    }
}

class SharedLinks extends React.Component {

    constructor(props) {
        super(props);
    }

    renderCell(dataModel, props) {
        var row = this.props.links[props.rowIndex]

        return (
            <FormattedCell data="title" rowData={ row } {...dataModel} />
        );
    }

    render() {
        var classRef = this;
        return (
            <Table rowHeight={50} rowsCount={this.props.links.length} width={1305} height={((this.props.links.length+1) * 50) + 2} headerHeight={50}>
                { this.props.dataModel.map(function(el, i){
                    return (<Column 
                            key = { i }
                            header = { <HeaderCell 
                                        title={el.label}
                                        isSorted={el.isSorted} 
                                        isDescending={el.isDescending} 
                                        sort={el.sort} /> }
                            cell = { props => (classRef.renderCell(el, props)) }
                            width = { el.width } />);
                })}
            </Table>
        );
    }
}

exports.CellDataTypes = {
    link: 'link',
    date: 'date'
}

export default SharedLinks;
