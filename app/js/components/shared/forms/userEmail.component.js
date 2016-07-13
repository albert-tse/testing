import React from 'react'

class UserEmail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isValid: props.email ? this.validate(props.email) : false,
            wasChanged: false,
            value: props.email,
            validationError: 'Please enter a valid email address.'
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
        return input.length > 0 && input.indexOf('@') >= 0 && input.indexOf('.') >= 0;
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
            <div id="email-group" className={this.generateClasses()}>
                <label htmlFor="email" className="control-label">
                    {this.props.text} { this.state.isValid || !this.state.wasChanged ? '' : '- ' + this.state.validationError }
                </label>
                <div className="input-group">
                    <input 
                        id="email" 
                        type="text" 
                        className="form-control" 
                        placeholder="user@gmail.com"
                        value = {this.state.value}
                        onChange={this.handleChange.bind(this)}
                    />
                    <span className={ this.generateGlypicon() } aria-hidden="true"></span>
                </div>
            </div>
        );
    }
}

export default UserEmail;
