import React from 'react';
import Select from 'react-select';

const localStorageItemName = 'selectedSites';

class SiteSelector extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.getSelectedSites(),
            options: this.props.sites.map((site) => {
                return {
                    value: site.id,
                    label: site.name
                };
            })
        };
    }

    getValue() {
        var returnable = this.state.value.map((site) => site.value);
        console.log(returnable);
        return returnable;
    }

    render() {
        var className = [
            'form-group'
        ].filter(Boolean).join(' ');

        return (
            <div className={className}>
                <label htmlFor="topics-selector" className="control-label">
                    {this.props.text} { this.state.isValid || !this.state.wasChanged ? '' : '- ' + this.state.validationError }
                </label>
                <Select multi
                        value={this.state.value}
                        options={this.state.options}
                        onChange={::this.update} /> 
            </div>
        );
    }

    update(value) {
        this.setState({
            value: value
        });
    }

    getSelectedSites() {
        return this.props.selectedSites.map((siteId) => {
            var site = _.find(this.props.sites, { id: siteId });

            return {
                value: siteId,
                label: site && site.name || 'Unkown'
            };
        });
    }
}

export default SiteSelector;
