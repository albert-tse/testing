import React, { Component } from 'react';
import { IconButton } from 'react-toolbox';
import SaveButton from '../../shared/article/SaveButton.component';
import { actions } from '../../links/style';
import classnames from 'classnames';
import SaveToListButton from '../article/SaveToListButton.component.js'

export default class LinkCellActions extends Component {

    render() {
        const { props, setPreviewArticle } = this.props;

        return (
            <div className={classnames(actions, 'className' in this.props && this.props.className)}>
                <SaveToListButton isOnCard ucid={props.rowData.ucid} isOnTable />
                <IconButton
                    icon="info"
                    onClick={evt => setPreviewArticle(props.rowData)}
                />
            </div>
        );
    }

}
