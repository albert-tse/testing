import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Checkbox, Dropdown, Input, ListDivider } from 'react-toolbox';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import styles from './styles.sites-filter';

export default class SitesFilter extends Component {

    constructor(props) {
        super(props);
        this.disableAllSites = this.toggleAllSites.bind(this, false);
        this.enableAllSites = this.toggleAllSites.bind(this, true);
        this.getTemplate = this.getTemplate.bind(this);
        this.getValues = this.getValues.bind(this);
    }

    render() {
        return (
            <AltContainer
                component={Dropdown}
                store={FilterStore}
                transform={ ({ sites }) => {
                    const values = this.getValues(sites); 

                    return {
                        label: 'Filter sites',
                        source: values,
                        template: this.getTemplate,
                        theme: styles,
                        value: values[0].value
                    };
                }}
            />
        );
    }

    getTemplate({ enabled, label, value, ...site }) {
        if (value === 'display') {
            return <input type="text" value={label} />;
        } else if (value === 'selectAll') {
            return <div onClick={this.enableAllSites}>{label}</div>;
        } else if (value === 'selectNone') {
            return <div onClick={this.disableAllSites}>{label}</div>;
        } else if (value === 'divider') {
            return <ListDivider />
        } else {
            return (
                <Checkbox 
                    checked={!!enabled}
                    label={label} 
                    onChange={this.toggleValue.bind(this, { enabled: !enabled, ...site })}
                />
            );
        }
    }

    getValues(sites) {
        const transformed = sites.map(site => Object.assign({}, site, { value: site.name, label: site.name }));
        const selectedSites = transformed.filter(site => site.enabled);
        const label = transformed.length === selectedSites.length ? 'All Selected' : `${selectedSites.length} Selected`;

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
        ]
    }

    toggleAllSites(enabled) {
        const sites = FilterStore.getState().sites.map(site => Object.assign({}, site, { enabled }));
        this.update({ sites });
    }

    toggleValue(toggledSite) {
        const sites = FilterStore.getState().sites.map(site => site.id === toggledSite.id ? toggledSite : site);
        this.update({ sites });
    }

    update(newValue) {
        const currentFilters = FilterStore.getState();
        FilterActions.update(Object.assign({}, currentFilters, newValue));
        'onSelect' in this.props && this.props.onSelect();
    }
}
