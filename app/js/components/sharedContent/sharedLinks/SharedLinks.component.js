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
        this.state = {};
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
        return this.state.formattedValue;
    }

    renderDate() {
        return (
            <div>
                <div>
                    { moment(this.state.formattedValue).format('L')}
                </div>
                <div>
                    { moment(this.state.formattedValue).format('LT')}
                </div>
            </div>
        );
    }

    renderLink() {
        var openLink = function() {
            var newWindow = window.open(this.state.formattedValue, '_blank');
            newWindow.blur();
            window.focus();
        }

        return (
            <span>
                <span className={Styles.cellLink}>{this.state.formattedValue}</span>
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
        var value = this.props.dataFetcher(this.props.rowIndex, this.props.dataProp);
        if (this.props.dataTransform) {
            this.state.formattedValue = this.props.dataTransform(value);
        } else {
            this.state.formattedValue = value;
        }
        return (
            <Cell {...this.props} value={this.state.formattedValue}>
                { ::this.renderContent() }               
            </Cell>
        );
    }
}

class SharedLinks extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageSize: 50,
            page: 0
        }
    }

    renderCell(dataModel, dataFetcher, props) {
        return (
            <FormattedCell dataFetcher={dataFetcher} {...props} {...dataModel} />
        );
    }

    dataFetcher(rowIndex, dataProp) {
        var pagedIndex = rowIndex + this.state.page * this.state.pageSize;
        return this.props.links[pagedIndex][dataProp];
    }

    onPageSizeChange(event) {
        this.state.pageSize = parseInt(event.target.value);
        this.state.page = 0;
        this.setState(this.state);
    }

    onChangePage(event) {
        this.state.page = parseInt(event.target.value);
        this.setState(this.state);
        event.preventDefault();
    }

    render() {
        var classRef = this;
        var height = ((this.state.pageSize + 1) * 50) + 2;
        var width = _.reduce(this.props.dataModel, function(total, el) {
            return total + el.width;
        }, 0);
        return (
            <div>
                Results per page: 
                <select defaultValue="50" onChange={ ::this.onPageSizeChange }>
                    <option value="2">2</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="500">500</option>
                </select>
                <div className={Styles.pagination}>
                    <div className={Styles.pages}>
                        Pages: { function(){
                            var pages = [];
                            var numPages = Math.ceil(this.props.links.length / this.state.pageSize);
                            var hasNext = this.state.page < numPages-1;
                            var hasPrev = this.state.page != 0;

                            pages.push(
                                <Button label="Prev" disabled={!hasPrev} raised onClick={ ::this.onChangePage } value={ this.state.page - 1} />
                            );
                            for(var p = 0; p < numPages; p++){
                                var active = this.state.page == p;
                                pages.push(
                                    <Button label={ p } accent={active} raised onClick={ ::this.onChangePage } value={ p } key={ p } />
                                );
                            }
                            pages.push(
                                <Button label="Next" disabled={!hasNext} raised onClick={ ::this.onChangePage } value={ this.state.page + 1} />
                            );
                            return pages;
                        }.bind(this)() }
                    </div>
                </div>
                <Table rowHeight={50} 
                    rowsCount={this.state.pageSize} 
                    width={ width } 
                    height={ height } 
                    headerHeight={50}>
                    { _.map(this.props.dataModel,function(el, i){
                        return (<Column 
                                key = { i }
                                header = { <HeaderCell 
                                            title={el.label}
                                            isSorted={el.isSorted} 
                                            isDescending={el.isDescending} 
                                            sort={el.sort} /> }
                                cell = { props => (classRef.renderCell(el, classRef::classRef.dataFetcher, props)) }
                                width = { el.width } />);
                    })}
                </Table>
            </div>
        );
    }
}

exports.CellDataTypes = {
    link: 'link',
    date: 'date'
}

export default SharedLinks;
