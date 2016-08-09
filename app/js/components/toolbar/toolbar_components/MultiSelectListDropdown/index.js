import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Checkbox, Dropdown, Input, ListDivider } from 'react-toolbox';
import styles from './styles';

export default class MultiSelectListDropdown extends Component {

    constructor(props) {
        super(props);
        this.disableAll = this.toggleAll.bind(this, false);
        this.enableAll = this.toggleAll.bind(this, true);
        this.getTemplate = this.getTemplate.bind(this);
        this.onUpdate = this.props.onUpdate;
    }

    render() {
        const { label, filterName, store } = this.props;

        return (
            <AltContainer
                component={Dropdown}
                store={store}
                transform={ props => {
                    const values = this.getValues(props[filterName]);
                    return {
                        label: label,
                        source: values,
                        template: this.getTemplate,
                        theme: styles,
                        value: values[0].value
                    };
                }}
            />
        );
    }

    getTemplate({ enabled, label, value, ...item }) {
        if (value === 'display') {
            return <input type="text" value={label} />;
        } else if (value === 'selectAll') {
            return <div onClick={this.enableAll}>{label}</div>;
        } else if (value === 'selectNone') {
            return <div onClick={this.disableAll}>{label}</div>;
        } else if (value === 'divider') {
            return <ListDivider />
        } else {
            return (
                <Checkbox 
                    checked={!!enabled}
                    label={label} 
                    onChange={this.toggleValue.bind(this, { enabled: !enabled, ...item })}
                />
            );
        }
    }

    getValues(items) {
        const transformed = items.map(item => Object.assign({}, item, { label: item.name, value: item.id }));
        const selected = transformed.filter(item => item.enabled);
        const label = transformed.length === selected.length ? 'All Selected' : `${selected.length} Selected`;

        return [
            { 
                label: label,
                value: 'display'
            },
            {
                label: 'Select All',
                value: 'selectAll'
            },
            {
                label: 'Select None',
                value: 'selectNone'
            },
            {
                label: 'Divider',
                value: 'divider'
            }, ...transformed
        ];
    }

    toggleAll(enabled) {
        const { filterName, store } = this.props;
        const storeState = store.getState();
        const items = storeState[filterName].map(item => Object.assign({}, item, { enabled }));
        this.update({ [filterName]: items });
    }

    toggleValue(toggledItem) {
        const { filterName, store } = this.props;
        const storeState = store.getState();
        const items = storeState[filterName].map(item => item.id === toggledItem.id ? toggledItem : item);
        this.update({ [filterName]: items });
    }

    update(newValue) {
        const currentState = this.props.store.getState();
        const newState = Object.assign({}, currentState, newValue);
        this.onUpdate(newState);
    }

}

MultiSelectListDropdown.propTypes = {
    filterName: React.PropTypes.string.isRequired, // in store that contains the array of filterable values
    label: React.PropTypes.string.isRequired, // of the filter component
    onUpdate: React.PropTypes.func.isRequired, // callback func that is called when selection is made
    store: React.PropTypes.object.isRequired, // where filter is located
};
