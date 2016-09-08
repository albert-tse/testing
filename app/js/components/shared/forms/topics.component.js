import React from 'react'
import Select from 'react-select'
import Styles from './styles';

class TopicSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isValid: props.topics ? this.validate(props.topics) : false,
            wasChanged: false,
            validationError: 'Please select at least 3 topics.',
            topics: [
                { value: '1', label: 'Art and Entertainment' },
                { value: '2', label: 'Automotive and Vehicles' },
                { value: '3', label: 'Business and Industrial' },
                { value: '4', label: 'Careers' },
                { value: '5', label: 'Education' },
                { value: '6', label: 'Family and Parenting' },
                { value: '7', label: 'Finance' },
                { value: '8', label: 'Food and Drink' },
                { value: '9', label: 'Health and Fitness' },
                { value: '10', label: 'Hobbies and Interests' },
                { value: '11', label: 'Home and Garden' },
                { value: '12', label: 'Law, Govt and Politics' },
                { value: '13', label: 'News' },
                { value: '14', label: 'Pets' },
                { value: '15', label: 'Real Estate' },
                { value: '16', label: 'Religion and Spirituality' },
                { value: '17', label: 'Science' },
                { value: '18', label: 'Shopping' },
                { value: '19', label: 'Society' },
                { value: '20', label: 'Sports' },
                { value: '21', label: 'Style and Fashion' },
                { value: '22', label: 'Technology and Computing' },
                { value: '23', label: 'Travel' }
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
        var classes = Styles.form + ' form-group';
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
