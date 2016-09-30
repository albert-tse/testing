import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import SaveButton from '../../shared/article/SaveButton.component';
import { actions } from '../../links/style';
import classnames from 'classnames';

export default class LinkCellActions extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { props, context } = this.props;

        return (
            <div className={classnames(actions, 'className' in this.props && this.props.className)}>
                <SaveButton ucid={props.rowData.ucid} raised={true} />
                <Button
                    raised
                    icon="info"
                    onClick={evt => context.setState({ infoArticle: props.rowData, showArticleModal: true })}
                />
            </div>
        );
    }
    
}
