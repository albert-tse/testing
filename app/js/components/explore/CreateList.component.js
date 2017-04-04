import React, { Component } from 'react';
import classnames from 'classnames';

import ListActions from '../../actions/List.action';

import { IconButton, Input } from 'react-toolbox';

import Style from './style';

export default class CreateList extends Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.clear = this.clear.bind(this);
        this.createList = this.createList.bind(this);
        this.showForm = this.showForm.bind(this);
        this.hideForm = this.hideForm.bind(this);
        this.checkForSubmission = this.checkForSubmission.bind(this);
        this.input = null;
        this.state = {
            newListName: '',
            active: false
        };
    }

    render() {
        return (
            <div className={classnames(this.state.active && Style.activelyCreatingNewList)}>
                <section className={Style.subheader}>
                    <h5 className={Style.subheaderTitle}>Saved Lists</h5>
                    <IconButton icon="add_circle_outline" onClick={this.showForm} />
                </section>
                <section className={Style.newListForm}>
                    <IconButton icon="clear" onClick={this.clear} />
                    <Input
                        ref={c => this.input = c}
                        theme={Style}
                        value={this.state.newListName}
                        onChange={this.onChange}
                        onKeyPress={this.checkForSubmission}
                    />
                    <IconButton disabled={this.state.newListName.length < 1} icon="arrow_forward" onClick={this.createList} />
                </section>
            </div>
        );
    }

    onChange(newValue) {
        this.setState({ newListName: newValue });
    }

    clear() {
        this.setState({ newListName: '' });
        this.hideForm();
    }

    createList() {
        ListActions.createList(this.state.newListName).then(this.hideForm);;
    }

    showForm() {
        this.setState({ active: true }, () => {
            this.input.getWrappedInstance().focus();
        });
    }

    hideForm() {
        this.setState({ newListName: '', active: false });
    }

    checkForSubmission(evt) {
        if (evt.key === 'Enter') {
            setTimeout(this.createList, 0);
        }
    }
}
