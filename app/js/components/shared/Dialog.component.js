import React, { Component } from 'react';
import { Button, Dialog as Base } from 'react-toolbox';
import pick from 'lodash/pick';
import Brand from '../../../images/brand.png';
import Style from './styles.dialog';

export default class Dialog extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Base
                {...pick(this.props, 'actions', 'active')}
                onEscKeyDown={::this.toggleHandler}
                onOverlayClick={::this.toggleHandler}
                title={<img className={Style.title} src={Brand} />}
            >
                <div className={Style.content}>{this.props.content}</div>
            </Base>
        );
    }

    toggleHandler() {
        return this.props.toggleHandler();
    }

}
