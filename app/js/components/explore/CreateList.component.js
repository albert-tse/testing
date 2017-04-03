import React, { Component } from 'react';

import { IconButton, Input } from 'react-toolbox';

import Style from './style';

export default class CreateList extends Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            newListName: ''
        };
    }

    render() {
        return (
            <div>
                <section className={Style.subheader}>
                    <h5 className={Style.subheaderTitle}>Saved Lists</h5>
                    <IconButton icon="add_circle_outline" />
                </section>
                <section className={Style.newListForm}>
                    <IconButton icon="clear" />
                    <Input theme={Style} value={this.state.newListName} onChange={this.onChange} />
                    <IconButton icon="arrow_forward" />
                </section>
            </div>
        );
    }

    onChange(newValue) {
        this.setState({ newListName: newValue });
    }
}
