import React, { Component } from 'react';
import { IconButton } from 'react-toolbox';
import SaveButton from '../../shared/article/SaveButton.component';
import { actions } from '../../links/style';
import classnames from 'classnames';
import AddToListButton from '../article/AddToListButton.component.js'

export default class LinkCellActions extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { props, setPreviewArticle } = this.props;

        return (
            <div className={classnames(actions, 'className' in this.props && this.props.className)}>
                <AddToListButton ucid={props.rowData.ucid} isOnTable />
                <IconButton
                    icon="info"
                    onClick={evt => setPreviewArticle(props.rowData)}
                />
            </div>
        );
    }
    
}
