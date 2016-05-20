import React from 'react'
import { Table, Column, Cell } from 'fixed-data-table'
import { Button, IconButton } from 'react-toolbox/lib/button'
import classNames from 'classnames'
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

class SimpleCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Cell>
                { this.props.rowData[this.props.dataProp] }               
            </Cell>
        );
    }
}

class SharedLinks extends React.Component {

    constructor(props) {
        super(props);
    }

    renderSimpleCell(dataProp, props) {
        var row = this.props.links[props.rowIndex]

        return (
            <SimpleCell data="title" rowData={ row } dataProp={ dataProp } {...props} />
        );
    }

    render() {
        var classRef = this;
        return (
            <Table rowHeight={50} rowsCount={this.props.links.length} width={1250} height={((this.props.links.length+1) * 50) + 2} headerHeight={50}>
                { this.props.dataModel.map(function(el, i){
                    return (<Column 
                            key = { i }
                            header = { <HeaderCell 
                                        title={el.label}
                                        isSorted={el.isSorted} 
                                        isDescending={el.isDescending} 
                                        sort={el.sort} /> }
                            cell = { props => (classRef.renderSimpleCell(el.dataProp, props)) }
                            width = { el.width } />);
                })}
            </Table>
        );
    }
}

export default SharedLinks;
