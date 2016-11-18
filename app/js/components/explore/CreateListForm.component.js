import React, { Component, PropTypes } from 'react';
import { Input } from 'react-toolbox';

import ListActions from '../../actions/List.action';

import Styles from './styles.create-list-form';

/**
 * This is a form used for creating a new user-generated list on Explore view
 */
export default class CreateListForm extends Component {

    /**
     * Bind callback methods to this instance
     * and initialize the current state
     * @param {object} props - is currently not used
     * @constructor
     */
    constructor(props) {
        super(props);
        this.updateListName = this.updateListName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            listName: ''
        };
    }

    /**
     * Displays an input field 
     * @return {JSX} the form element
     */
    render() {
        return (
            <div className={Styles.createListForm}>
                <Input
                    hint="Hit [Enter] to create"
                    label="+ Create a list"
                    maxLength={20}
                    onChange={this.updateListName}
                    onKeyPress={this.onSubmit}
                    type="text"
                    value={this.state.listName}
                />
            </div>
        );
    }

    /**
     * Update the name of the list currently shown on the input field
     * @param {string} name current value of input field
     */
    updateListName(name) {
        this.setState({ listName: name });
    }

    /**
     * Create a new list when the User hits "Enter" key
     * @param {Event} keyEvent - we only want the name of the key they pressed
     */
    onSubmit({ key }) {
        if (key.toLowerCase() === 'enter') {
            ListActions.createList(this.state.listName);
            this.setState({ listName: '' })
        }
    }
}
