import React from 'react'
import Select from 'react-select'
import debounce from 'lodash/debounce';

class InfluencerUrl extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.verifyProfile = debounce(this.verifyProfile.bind(this), 500);

        this.state = {
            isValid: false,
            wasChanged: false,
            value: '',
            platform: 'facebook.com/',
            validationError: 'Please enter your influencer\'s url'
        };
    }

    verifyProfile() {
        console.log('verifying', this.state);
    }

    handleChange(event) {
        this.verifyProfile();
        this.setState({
            wasChanged: true,
            isValid: this.validate(event.target.value),
            value: event.target.value
        });
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
        return {
            platform: this.state.platform == 'facebook.com/' ? 'facebook' : 'twitter',
            url: this.state.value
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
            	<div className="form-group col-md-6">
                	<label htmlFor="influencer-platform" className="control-label">Social Media Platform</label>
                	<div className="input-group">
                		<Select 
			     			simpleValue 
		                    value={this.state.platform} 
		                    placeholder="Ex: Facebook" 
                            clearable={false}
		                    options={[
						                { value: 'facebook.com/', label: 'Facebook' },
						                { value: 'twitter.com/', label: 'Twitter' }
						            ]} 
		                    onChange={this.handlePlatformChange.bind(this)} 
		                />
                	</div>
            	</div>
	            <div id="influencer-url-group" className={this.generateClasses() + " col-md-6"}>
	                <label htmlFor="influencer-url" className="control-label">
	                	Profile URL { this.state.isValid || !this.state.wasChanged ? '' : '- ' + this.state.validationError }
	                </label>
					<div className="input-group">
						<div className="input-group-addon">{ this.state.platform || 'http://www.facebook.com' }</div>
		                <input
		                	id="influencer-url" 
		                	type="text" 
		                	className="form-control" 
		                	placeholder="georgehtakei"
		                	value={this.state.value}
		                	onChange={this.handleChange}
		                />
		                <span className={this.generateGlypicon()} aria-hidden="true"></span>
					</div>
	            </div>
            </div>
        );
    }
}

export default InfluencerUrl;
