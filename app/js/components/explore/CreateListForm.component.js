import React, { Component, PropTypes } from 'react';
import { Input } from 'react-toolbox';

import Styles from './styles.create-list-form';

export default class CreateListForm extends Component {

    constructor(props) {
        super(props);
        this.updateListName = this.updateListName.bind(this);
        this.state = {
            listName: ''
        };
    }

    render() {
        return (
            <form className={Styles.createListForm}>
                <Input type="text" label="+ Create a list" floating={false} value={this.state.listName} onChange={this.updateListName} maxLength={20} />
            </form>
        );
    }

    /**
     * Update the name of the list currently shown on the input field
     * @param String name current value of input field
     */
    updateListName(name) {
        this.setState({ listName: name });
    }
}
