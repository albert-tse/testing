import React from 'react'

class LegalForm extends React.Component {

    TOSBlob = {
        __html: require('./tos.html')
    };

    constructor(props) {
        super(props);
        this.state = {
            isValid: false,
            wasChanged: false,
            tosValue: false,
            commsValue: true,
            validationError: 'In order to continue you must agree to the terms of service.'
        }
    }

    componentDidMount() {}

    handleCommsChange(event) {
        var state = this.state;
        state.commsValue = event.target.checked;
        this.setState(state);
    }

    handleTOSChange(event) {
        var state = this.state;
        state.wasChanged = true;
        state.isValid = this.validate(event.target.checked);
        state.tosValue = event.target.checked;
        this.setState(state);
    }

    validate(input) {
        return input;
    }

    isValid() {
        return this.state.isValid;
    }

    getValues() {
        return {
            comms: this.state.commsValue,
            tos: this.state.tosValue
        };
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
            <div id="legal-group" className={this.generateClasses()}>
                <div id="tos-group" className="input-group">
                    <label htmlFor="search" className="">Terms of Services</label>
                    <div id="tos" dangerouslySetInnerHTML={this.TOSBlob} />
                </div>
                <div className="form-group">
                    <div>
                        <input id="tos-checkbox" type="checkbox" onChange={this.handleTOSChange.bind(this)} /> 
                        <label htmlFor="tos-checkbox" className="control-label">
                            I agree to The Social Edge terms of service { this.state.isValid || !this.state.wasChanged ? '' : '- ' + this.state.validationError }
                        </label>
                    </div>
                    <div>
                        <input id="comms-checkbox" type="checkbox" defaultChecked onChange={this.handleCommsChange.bind(this)} /> 
                        <label htmlFor="comms-checkbox" >
                            I would like to keep up with The Social Edge via email
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}

export default LegalForm;
