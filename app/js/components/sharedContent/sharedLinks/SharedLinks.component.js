import React from 'react'
import { Table, Column, Cell } from 'fixed-data-table'
import { Button, IconButton } from 'react-toolbox/lib/button'
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu'
import Input from 'react-toolbox/lib/input'
import classNames from 'classnames'
import moment from 'moment'
import DataExporter from './DataExporter'
import Styles from './style'
import History from '../../../history'

class HeaderCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var className = '';
        
        if (this.props.isSortable === false) {
            className += ' ' + Styles.notSortable;
        }
        
        return (
            <Cell className={classNames([Styles.headerCell, this.props.isDescending ? Styles.isDescending : false])}>
                {this.props.title}
                <IconButton 
                    icon='sort' 
                    onClick={ (event) => (this.props.sort(event, this.props.dataProp)) } 
                    className={className}
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
        } else if (this.props.dataType == exports.CellDataTypes.dollars) {
            return this.renderDollars();
        } else if (this.props.dataType == exports.CellDataTypes.number) {
            return this.renderNumber();
        } else if (this.props.dataType == exports.CellDataTypes.articleIcon) {
            return this.renderArticleIcon();
        } else {
            return this.renderDefault();
        }
    }

    renderDefault() {
        return this.state.formattedValue;
    }

    renderNumber() {
        if (this.state.formattedValue == null) {
            return null;
        } else {
            return parseFloat(this.state.formattedValue).toLocaleString();
        }
    }

    renderDollars() {
        if (this.state.formattedValue == null) {
            return null;
        } else {
            return '$' + this.state.formattedValue;
        }
    }

    renderDate() {
        if (this.state.formattedValue == null) {
            return <div> --- </div>
        }
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
        var openLink = function () {
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
                    floating 
                    mini 
                    invert />
            </span>
        );
    }


    renderArticleIcon() {
        var openLink = function () {
            History.push(this.state.formattedValue);
        }

        return (
            <span>
                <span>View Article</span>
                <IconButton 
                    icon='pageview' 
                    onClick={ openLink.bind(this) } 
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

    onExport(format) {
        DataExporter(this.props.dataModel, this.props.links, format);
    }

    render() {
        if (!this.props.links) {
            return <div/>;
        }

        var classRef = this;
        var numRows = this.props.links.length - (this.state.page * this.state.pageSize); //The number of rows from this page onward.
        //Limit the number of rows to the page size.
        if (numRows > this.state.pageSize) {
            numRows = this.state.pageSize;
        }
        var height = ((numRows + 1) * 50) + 2;
        var width = _.reduce(this.props.dataModel, function (total, el) {
            return total + el.width;
        }, 0);

        return (
            <div className={Styles.sharedLinks}>
                <div className={Styles.tableHeader} style={{width: width+'px'}}>
                    <div className={Styles.leftSide}> 
                        Show&nbsp;
                        <select defaultValue="50" onChange={ ::this.onPageSizeChange }>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="500">500</option>
                        </select>
                        &nbsp;entries
                    </div>
                    <div className={Styles.rightSide}>
                        <IconMenu className={Styles.export} onSelect={ ::this.onExport } icon='file_download' position='top-right' menuRipple>
                            <MenuItem value='csv' icon={ CSVIcon() } caption='Save as CSV' />
                            <MenuItem value='xlsx' icon={ ExcelIcon() } caption='Save as Excel (xlsx)' />
                            <MenuItem value='pdf' icon={ PDFIcon() } caption='Save as PDF' />
                            <MenuItem value='clipboard' icon='content_copy' caption='Copy Data To Clipboard' />
                        </IconMenu>
                    </div>
                </div>
                <Table rowHeight={50} 
                    rowsCount={ numRows } 
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
                                            isSortable={el.isSortable}
                                            sort={el.sort} /> }
                                cell = { props => (classRef.renderCell(el, classRef::classRef.dataFetcher, props)) }
                                width = { el.width } />);
                    })}
                </Table>
                <div className={ Styles.pagination } style={{width: width+'px'}}>
                    <div className={Styles.entries}>
                        Showing { 1 + (this.state.page * this.state.pageSize) } to { this.state.page * this.state.pageSize + numRows } of {this.props.links.length} entries
                    </div>
                    <div className={Styles.pages}>
                        { function(){
                            var pages = [];
                            var numPages = Math.ceil(this.props.links.length / this.state.pageSize);
                            var hasNext = this.state.page < numPages-1;
                            var hasPrev = this.state.page != 0;

                            pages.push(
                                <Button label="Prev" disabled={!hasPrev} raised onClick={ ::this.onChangePage } value={ this.state.page - 1} key={'prev'}/>
                            );
                            for(var p = 0; p < numPages; p++){
                                var active = this.state.page == p;
                                pages.push(
                                    <Button label={ ''+p } primary={active} raised onClick={ ::this.onChangePage } value={ p } key={ p } />
                                );
                            }
                            pages.push(
                                <Button label="Next" disabled={!hasNext} raised onClick={ ::this.onChangePage } value={ this.state.page + 1} key={'next'}/>
                            );
                            return pages;
                        }.bind(this)() }
                    </div>
                </div>
            </div>
        );
    }
}

exports.CellDataTypes = {
    link: 'link',
    date: 'date',
    number: 'number',
    dollars: 'dollars',
    articleIcon: 'articleIcon',
}


const CSVIcon = () => (
    <span className={Styles.svgIcon}>
        <svg viewBox="0 0 56.25 56.25">
            <defs id="defs6">
                <clipPath id="clipPath16">
                    <path d="M 0,0 0,45 45,45 45,0 0,0" id="path18" />
                </clipPath>
            </defs>
            <g id="g10" transform="matrix(1.25,0,0,-1.25,0,56.25)">
                <g id="g12">
                    <g clip-path="url(#clipPath16)" id="g14">
                        <g id="g20">
                            <g id="g22">
                                <g id="g24">
                                    <path d="m 9.347,6.027 0,32.946 c 0,0.843 0.684,1.527 1.527,1.527 l 13.349,0 11.43,-11.43 0,-23.043 C 35.653,5.184 34.969,4.5 34.126,4.5 l -23.252,0 c -0.843,0 -1.527,0.684 -1.527,1.527 z" id="path26" style={{fill:'#2b2b2b',fillOpacity:1,fillRule:'evenodd',stroke:'none'}} />
                                </g>
                            </g>
                            <g id="g28">
                                <g id="g30">
                                    <path d="m 24.223,40.5 11.43,-11.43 -9.903,0 c -0.843,0 -1.527,0.684 -1.527,1.527 l 0,9.903 z" id="path32" style={{fill:'#525252',fillOpacity:1,fillRule:'evenodd',stroke:'none'}} />
                                </g>
                            </g>
                            <g id="g34">
                                <g id="g36">
                                    <path d="M 17.625,9.95 17.96,9.38 C 17.476,8.836 16.805,8.564 15.947,8.564 c -0.814,0 -1.488,0.263 -2.022,0.789 -0.533,0.525 -0.799,1.211 -0.799,2.058 0,0.847 0.268,1.533 0.805,2.058 0.538,0.526 1.209,0.789 2.016,0.789 0.809,0 1.46,-0.244 1.955,-0.73 l -0.324,-0.624 c -0.128,0.163 -0.34,0.317 -0.636,0.46 -0.297,0.143 -0.618,0.215 -0.964,0.215 -0.601,0 -1.093,-0.199 -1.477,-0.597 -0.384,-0.398 -0.576,-0.917 -0.576,-1.555 0,-0.639 0.194,-1.157 0.58,-1.553 0.386,-0.397 0.877,-0.595 1.473,-0.595 0.687,0 1.236,0.223 1.647,0.671 z" id="path38" style={{fill:'#e6e6e6',fillOpacity:1,fillRule:'nonzero',stroke:'none'}} />
                                </g>
                            </g>
                            <g id="g40">
                                <g id="g42">
                                    <path d="m 22.12,10.195 c 0,-0.483 -0.192,-0.883 -0.577,-1.197 -0.352,-0.289 -0.802,-0.434 -1.351,-0.434 -0.223,0 -0.435,0.032 -0.634,0.094 -0.199,0.062 -0.375,0.151 -0.53,0.265 -0.155,0.115 -0.273,0.21 -0.353,0.287 -0.081,0.077 -0.168,0.171 -0.262,0.283 l 0.453,0.519 c 0.158,-0.213 0.362,-0.398 0.61,-0.556 0.249,-0.157 0.512,-0.236 0.791,-0.236 0.309,0 0.566,0.084 0.77,0.252 0.204,0.168 0.307,0.393 0.307,0.677 0,0.132 -0.03,0.252 -0.088,0.359 -0.059,0.106 -0.148,0.198 -0.267,0.275 -0.12,0.077 -0.209,0.13 -0.268,0.16 -0.058,0.03 -0.149,0.068 -0.271,0.115 -0.432,0.172 -0.724,0.295 -0.878,0.371 -0.224,0.101 -0.408,0.231 -0.554,0.39 -0.239,0.249 -0.359,0.569 -0.359,0.96 0,0.426 0.168,0.78 0.503,1.061 0.325,0.271 0.75,0.407 1.272,0.41 0.601,0 1.128,-0.238 1.581,-0.714 l -0.406,-0.527 c -0.372,0.395 -0.777,0.593 -1.214,0.593 -0.283,0 -0.514,-0.067 -0.692,-0.201 -0.178,-0.134 -0.267,-0.323 -0.267,-0.568 0,-0.122 0.019,-0.23 0.058,-0.324 0.039,-0.093 0.098,-0.173 0.176,-0.24 0.078,-0.066 0.151,-0.118 0.22,-0.156 0.069,-0.037 0.154,-0.077 0.256,-0.119 l 1.014,-0.425 c 0.265,-0.122 0.474,-0.27 0.625,-0.445 0.223,-0.278 0.335,-0.588 0.335,-0.929 z" id="path44" style={{fill:'#e6e6e6',fillOpacity:1,fillRule:'nonzero',stroke:'none'}} />
                                </g>
                            </g>
                            <g id="g46">
                                <g id="g48">
                                    <path d="m 26.346,14.176 0.816,0 -2.033,-5.522 -0.687,0 -2.029,5.522 0.831,0 1.549,-4.394 1.553,4.394 z" id="path50" style={{fill:'#e6e6e6',fillOpacity:1,fillRule:'nonzero',stroke:'none'}} />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    </span>
);

const ExcelIcon = () => (
    <span className={Styles.svgIcon}>
        <svg viewBox="0 0 56.25 56.25">
            <defs id="defs6">
                <clipPath id="clipPath16">
                    <path d="M 0,0 0,45 45,45 45,0 0,0" id="path18" />
                </clipPath>
            </defs>
            <g id="g10" transform="matrix(1.25,0,0,-1.25,0,56.25)">
                <g id="g12">
                    <g clip-path="url(#clipPath16)" id="g14">
                        <g id="g20">
                            <g id="g22">
                                <g id="g24">
                                    <path d="m 9.347,6.027 0,32.946 c 0,0.843 0.684,1.527 1.527,1.527 l 13.349,0 11.43,-11.43 0,-23.043 C 35.653,5.184 34.969,4.5 34.126,4.5 l -23.252,0 c -0.843,0 -1.527,0.684 -1.527,1.527 z" id="path26" style={{fill:'#2b2b2b',fillOpacity:1,fillRule:'evenodd',stroke:'none'}} />
                                </g>
                            </g>
                            <g id="g28">
                                <g id="g30">
                                    <path d="m 24.223,40.5 11.43,-11.43 -9.903,0 c -0.843,0 -1.527,0.684 -1.527,1.527 l 0,9.903 z" id="path32" style={{fill:'#525252',fillOpacity:1,fillRule:'evenodd',stroke:'none'}} />
                                </g>
                            </g>
                            <g id="g34">
                                <g id="g36">
                                    <path d="m 15.644,11.508 1.83,-2.846 -0.937,0 -1.397,2.342 -1.39,-2.342 -0.929,0 1.823,2.846 -1.694,2.67 0.91,0 1.28,-2.151 1.288,2.151 0.91,0 -1.694,-2.67 z" id="path38" style={{fill:'#e6e6e6',fillOpacity:1,fillRule:'nonzero',stroke:'none'}} />
                                </g>
                            </g>
                            <g id="g40">
                                <g id="g42">
                                    <path d="m 20.781,9.326 0,-0.664 -2.717,0 0,5.516 0.773,0 0,-4.852 1.944,0 z" id="path44" style={{fill:'#e6e6e6',fillOpacity:1,fillRule:'nonzero',stroke:'none'}} />
                                </g>
                            </g>
                            <g id="g46">
                                <g id="g48">
                                    <path d="m 24.841,10.196 c 0,-0.484 -0.193,-0.883 -0.578,-1.198 -0.351,-0.289 -0.802,-0.434 -1.351,-0.434 -0.223,0 -0.435,0.032 -0.634,0.094 -0.199,0.063 -0.376,0.151 -0.531,0.265 -0.155,0.115 -0.273,0.211 -0.353,0.287 -0.081,0.077 -0.168,0.172 -0.262,0.283 l 0.453,0.52 c 0.159,-0.214 0.363,-0.399 0.611,-0.557 0.249,-0.157 0.512,-0.236 0.79,-0.236 0.31,0 0.567,0.084 0.772,0.252 0.204,0.168 0.306,0.394 0.306,0.677 0,0.133 -0.029,0.253 -0.088,0.359 -0.058,0.107 -0.148,0.199 -0.267,0.276 -0.12,0.076 -0.209,0.13 -0.268,0.16 -0.058,0.03 -0.149,0.068 -0.271,0.115 -0.432,0.172 -0.725,0.295 -0.878,0.371 -0.224,0.101 -0.409,0.231 -0.555,0.39 -0.239,0.25 -0.359,0.57 -0.359,0.96 0,0.427 0.168,0.781 0.504,1.062 0.325,0.271 0.749,0.407 1.272,0.41 0.602,0 1.129,-0.238 1.581,-0.714 l -0.406,-0.527 c -0.372,0.395 -0.777,0.593 -1.214,0.593 -0.283,0 -0.514,-0.067 -0.693,-0.201 -0.178,-0.134 -0.267,-0.323 -0.267,-0.568 0,-0.122 0.019,-0.23 0.059,-0.324 0.039,-0.094 0.097,-0.174 0.175,-0.24 0.078,-0.066 0.152,-0.119 0.221,-0.156 0.069,-0.038 0.154,-0.078 0.255,-0.119 L 23.88,11.57 c 0.266,-0.122 0.474,-0.27 0.625,-0.445 0.224,-0.278 0.336,-0.588 0.336,-0.929 z" id="path50" style={{fill:'#e6e6e6',fillOpacity:1,fillRule:'nonzero',stroke:'none'}} />
                                </g>
                            </g>
                            <g id="g52">
                                <g id="g54">
                                    <path d="m 27.941,11.508 1.83,-2.846 -0.937,0 -1.397,2.342 -1.39,-2.342 -0.929,0 1.823,2.846 -1.694,2.67 0.91,0 1.28,-2.151 1.288,2.151 0.91,0 -1.694,-2.67 z" id="path56" style={{fill:'#e6e6e6',fillOpacity:1,fillRule:'nonzero',stroke:'none'}} />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    </span>
);

const PDFIcon = () => (
    <span className={Styles.svgIcon}>
        <svg viewBox="0 0 56.25 56.25">
            <defs id="defs6">
                <clipPath id="clipPath16">
                    <path d="M 0,0 0,45 45,45 45,0 0,0" id="path18" />
                </clipPath>
            </defs>
            <g id="g10" transform="matrix(1.25,0,0,-1.25,0,56.25)">
                <g id="g12">
                    <g clip-path="url(#clipPath16)" id="g14">
                        <g id="g20">
                            <g id="g22">
                                <g id="g24">
                                    <path d="m 9.347,6.027 0,32.946 c 0,0.843 0.684,1.527 1.527,1.527 l 13.349,0 11.43,-11.43 0,-23.043 C 35.653,5.184 34.969,4.5 34.126,4.5 l -23.252,0 c -0.843,0 -1.527,0.684 -1.527,1.527 z" id="path26" style={{fill:'#2b2b2b',fillOpacity:1,fillRule:'evenodd',stroke:'none'}} />
                                </g>
                            </g>
                            <g id="g28">
                                <g id="g30">
                                    <path d="m 24.223,40.5 11.43,-11.43 -9.903,0 c -0.843,0 -1.527,0.684 -1.527,1.527 l 0,9.903 z" id="path32" style={{fill:'#525252',fillOpacity:1,fillRule:'evenodd',stroke:'none'}} />
                                </g>
                            </g>
                            <g id="g34">
                                <g id="g36">
                                    <path d="m 16.856,12.604 c 0,-0.489 -0.178,-0.884 -0.534,-1.183 -0.305,-0.26 -0.75,-0.391 -1.335,-0.394 l -0.776,0 0,-2.365 -0.773,0 0,5.514 1.549,0 c 0.585,0 1.03,-0.13 1.335,-0.39 0.356,-0.31 0.534,-0.704 0.534,-1.182 z m -1.135,-0.738 c 0.223,0.166 0.335,0.412 0.335,0.738 0,0.325 -0.112,0.567 -0.335,0.725 -0.203,0.143 -0.469,0.215 -0.796,0.215 l -0.714,0 0,-1.885 0.714,0 c 0.33,0 0.595,0.069 0.796,0.207 z" id="path38" style={{fill:'#e6e6e6',fillOpacity:1,fillRule:'nonzero',stroke:'none'}} />
                                </g>
                            </g>
                            <g id="g40">
                                <g id="g42">
                                    <path d="m 21.402,13.458 c 0.57,-0.523 0.855,-1.202 0.855,-2.039 0,-0.836 -0.285,-1.516 -0.855,-2.039 C 20.88,8.902 20.193,8.662 19.342,8.662 l -1.662,0 0,5.514 1.662,0 c 0.853,0 1.54,-0.239 2.06,-0.718 z m 0.063,-2.037 c 0,0.64 -0.218,1.167 -0.656,1.581 -0.361,0.34 -0.85,0.511 -1.467,0.511 l -0.889,0 0,-4.179 0.889,0 c 0.619,0 1.108,0.17 1.467,0.511 0.438,0.416 0.656,0.941 0.656,1.576 z" id="path44" style={{fill:'#e6e6e6',fillOpacity:1,fillRule:'nonzero',stroke:'none'}} />
                                </g>
                            </g>
                            <g id="g46">
                                <g id="g48">
                                    <path d="m 26.218,14.176 0,-0.648 -2.286,0 0,-1.838 2.15,0 0,-0.647 -2.15,0 0,-2.381 -0.773,0 0,5.514 3.059,0 z" id="path50" style={{fill:'#e6e6e6',fillOpacity:1,fillRule:'nonzero',stroke:'none'}} />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    </span>
);

export default SharedLinks;
