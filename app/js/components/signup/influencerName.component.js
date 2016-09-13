import React from 'react'
import Styles from '../shared/forms/styles';

class InfluencerName extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isValid: false,
            wasChanged: false,
            value: '',
            validationError: 'Please enter the name of your influencer.'
        }
    }

    componentDidMount() {}

    handleChange(event) {
        var state = this.state;
        state.wasChanged = true;
        state.isValid = this.validate(event.target.value);
        state.value = event.target.value;

        this.setState(state);
    }

    validate(input) {
        return input.length > 0;
    }

    isValid() {
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

    generateGlypicon() {
        var classes = "glyphicon form-control-feedback";
        if (this.state.wasChanged) {
            if (this.state.isValid) {
                classes += " glyphicon-ok";
            } else {
                classes += " glyphicon-remove";
            }
        } else {
            classes = "";
        }

        return classes;
    }

    render() {
        return (
            <div id="influencer-name-group" className={this.generateClasses()}>
                <label htmlFor="influencer-name" className="control-label">
                    Your Name { this.state.isValid || !this.state.wasChanged ? '' : '- ' + this.state.validationError }
                </label>
                <div className="input-group">
                    <input 
                        id="influencer-name" 
                        type="text" 
                        className="form-control" 
                        placeholder="Ex: George Takei"
                        value = {this.state.value}
                        onChange={this.handleChange.bind(this)}
                    />
                    <span className={ this.generateGlypicon() } aria-hidden="true"></span>
                </div>
            </div>
        );
    }
}

export default InfluencerName;
