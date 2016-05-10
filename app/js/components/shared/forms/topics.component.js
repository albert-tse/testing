import React from 'react'
import Select from 'react-select'

class TopicSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isValid: props.topics ? this.validate(props.topics) : false,
            wasChanged: false,
            validationError: 'Please select at least 3 topics.',
            topics: [
                { value: '1', label: 'art and entertainment' },
                { value: '2', label: 'automotive and vehicles' },
                { value: '3', label: 'business and industrial' },
                { value: '4', label: 'careers' },
                { value: '5', label: 'education' },
                { value: '6', label: 'family and parenting' },
                { value: '7', label: 'finance' },
                { value: '8', label: 'food and drink' },
                { value: '9', label: 'health and fitness' },
                { value: '10', label: 'hobbies and interests' },
                { value: '11', label: 'home and garden' },
                { value: '12', label: 'law, govt and politics' },
                { value: '13', label: 'news' },
                { value: '14', label: 'pets' },
                { value: '15', label: 'real estate' },
                { value: '16', label: 'religion and spirituality' },
                { value: '17', label: 'science' },
                { value: '18', label: 'shopping' },
                { value: '19', label: 'society' },
                { value: '20', label: 'sports' },
                { value: '21', label: 'style and fashion' },
                { value: '22', label: 'technology and computing' },
                { value: '23', label: 'travel' }
            ],
            value: props.topics
        }
    }

    componentDidMount() {}

    handleChange(value) {
        var state = this.state;
        state.wasChanged = true;
        state.isValid = this.validate(value);
        state.value = value;

        this.setState(state);
    }

    validate(input) {
        if (input == null) {
            return false;
        } else {
            return input.split(',').length >= 3;
        }
    }

    isValid() {
        this.handleChange(this.state.value);
        return this.state.isValid;
    }

    getValue() {
        return this.state.value;
    }

    forceValidation() {
        var state = this.state;
        state.wasChanged = true;
        this.setState(state);
    }

    generateClasses() {
        var classes = "form-group";
        if (this.state.wasChanged) {
            if (this.state.isValid) {
                classes += " has-success has-feedback";
            } else {
                classes += " has-error has-feedback";
            }
        }

        return classes;
    }

    render() {
        return (
            <div id="topics-group" className={this.generateClasses()}>
                <label htmlFor="topics-selector" className="control-label">
                    {this.props.text} { this.state.isValid || !this.state.wasChanged ? '' : '- ' + this.state.validationError }
                </label>
                <div id="topics-selector" className="input-group">
                    <Select 
                        multi
                        simpleValue
                        value = { this.state.value }
                        placeholder = "Ex: Shopping, style and fashion, and society"
                        options = { this.state.topics }
                        onChange = { this.handleChange.bind(this) }
                        />
                </div>
            </div>
        );
    }
}

export default TopicSelector;
