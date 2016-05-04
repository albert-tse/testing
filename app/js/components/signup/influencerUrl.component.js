import React from 'react'
import Select from 'react-select'

class InfluencerUrl extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isValid: false,
            wasChanged: false,
            value: '',
            platform: 'http://www.facebook.com/',
            validationError: 'Please enter your influencer\'s url'
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

    handlePlatformChange(value) {
        var state = this.state;
        state.platform = value;
        this.setState(state);
    }

    validate(input) {
        return input.length > 0;
    }

    isValid() {
        return this.state.isValid;
    }

    getValue() {
        return this.state.platform + this.state.value;
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
            <div id="influencer-url-component" className="row">
            	<div className="form-group col-xs-6">
                	<label htmlFor="influencer-platform" className="control-label">Social Media Platform</label>
                	<div className="input-group">
                		<Select 
			     			simpleValue 
		                    value={this.state.platform} 
		                    placeholder="Ex: Facebook" 
                            clearable={false}
		                    options={[
						                { value: 'http://www.facebook.com/', label: 'Facebook' },
						                { value: 'http://www.twitter.com/', label: 'Twitter' }
						            ]} 
		                    onChange={this.handlePlatformChange.bind(this)} 
		                />
                	</div>
            	</div>
	            <div id="influencer-url-group" className={this.generateClasses() + " col-xs-6"}>
	                <label htmlFor="influencer-url" className="control-label">
	                	Profile URL { this.state.isValid || !this.state.wasChanged ? '' : '- ' + this.state.validationError }
	                </label>
					<div className="input-group">
						<div className="input-group-addon">{ this.state.platform || 'http://www.facebook.com'}</div>
		                <input 
		                	id="influencer-url" 
		                	type="text" 
		                	className="form-control" 
		                	placeholder="georgehtakei"
		                	value = {this.state.value}
		                	onChange={this.handleChange.bind(this)}
		                />
		                <span className={ this.generateGlypicon() } aria-hidden="true"></span>
					</div>
	            </div>
            </div>
        );
    }
}

export default InfluencerUrl;
