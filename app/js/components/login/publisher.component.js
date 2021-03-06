import React, { Component } from 'react'
import { Header, Facebook } from '../shared/index'
import GoogleAnalytics from '../shared/GoogleAnalytics.component';
import Styles from './styles';
import _ from 'lodash';
import qs from 'querystring';
import classnames from 'classnames';
import { container, jumbotron, overlay } from '../common';
import History from '../../history';
import Config from '../../config';

class LoginComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="login" className={Styles.sendToBack, Styles.scrollable}>
                <Facebook />
                <GoogleAnalytics />
                <div className='with-cover'>
                    <div className={overlay}>
                        <div className='container'>
                            <div className={jumbotron}>
                                <h1 className={Styles.brand}>Contempo</h1>
                                <h2>Publisher Login / Signup </h2>
                                <p>
                                    Select on of the options below to sign in. Don't have an account? Just log in with any of the accounts below, and we will make one for you.
                                </p>
                                { this.renderAuthOptions() }
                                { this.renderErrorMessage() }
                                <span className={Styles.footnote} onClick={function(){ History.push(Config.routes.loginState.replace(':state', 'influencer')); }}> 
                                    (Are you an influencer? Click here to login as an influencer.)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classnames(container, 'container')}>
                    <article className={classnames(Styles.article, 'row')}>
                        <section className="col-xs-12 col-sm-6">
                            <h2>Influencers</h2>
                            <h3 className={Styles.heading}>Access diverse, high-quality paid content from a network of online publishers</h3>
                            <p>Unlike typical influencer-publisher partnerships, The Social Edge’s lineup of online publishing houses offers a dynamic feed of content diverse enough to suit any fan base. Our publishers are high quality, vetted sources—many are sites you already love.</p>
                            <h3 className={Styles.heading}> Inspire movements. Let us handle the logistics.</h3>
                            <p>The Social Edge makes finding and sharing meaningful content with fans easy and enjoyable. Our expert team handles all the hoopla of contracts, tracking and payment, so you can spend energy on more interesting stuff — like building a social movement.</p>
                            <h3 className={Styles.heading}>Stay true to your voice and grow your followers organically</h3>
                            <p>You choose what material to share and when to share it. We help by giving you the best recommendations from a constant stream of new share-worthy articles, so you can keep your fans engaged with laughs, news and editorials that resonate with you.</p>
                            <a href="http://the-social-edge.com/influencers" target="_blank">Learn More</a>
                        </section>
                        <section className="col-xs-12 col-sm-6">
                            <h2>Publishers</h2>
                            <h3 className={Styles.heading}>Increase traffic exponentially and attract new regular readership</h3>
                            <p>Our broad influencer network broadcasts your content to millions of followers, plus millions more when followers share with their friends. With the exposure our Influencers can offer, you’ll become the go-to source for quality content in your industry.</p>
                            <h3 className={Styles.heading}>Match your content with targeted, engaged audiences</h3>
                            <p>Our approach capitalizes on the organic reach of vetted, influential internet personalities with avid followers who are eager to consume recommended content. Targeting specific fan bases yields more clicks than traditional and native ads.</p>
                            <h3 className={Styles.heading}>Configure your content feed for effortless management</h3>
                            <p>Spend less time distributing content and more time creating it. Our publisher portal automatically pulls content from your RSS feed and generates social media cards for our influencers to share. Additional levels of content management are also readily available.</p>
                            <a href="http://the-social-edge.com/publishers" target="_blank">Learn More</a>
                        </section>
                    </article>
                </div>
                { this.renderModalBackdrop() }
            </div>
        );
    }

    renderAuthOptions() {
        var ithis = this;
        return (
            <div id="auth-options">
                { _.map(this.props.authTypes, function(el){
                return <a onClick={ function(){
                        var role = ithis.props.route_state;
                        var query = window.location.hash.split('?');
                        query = query.length > 1 ? query[1] : '';
                        query = qs.parse(query);

                        if(query.ref){
                            el.action(ithis.props.route_state,query.ref)
                        }else{
                            el.action(ithis.props.route_state,'unreferred')
                        }
                } } key={ el.text } className={classnames(Styles.socialIcons, el.text.toLowerCase())}><i className={ 'fa fa-lg fa-' + el.text.toLowerCase() }></i></a>
                }) }
            </div>
        );
    }

    renderErrorMessage() {
        if (this.props.error_code || this.props.authError) {
            return (
                <p id="error-message" className="bg-danger">
                    <div>
                        <p>
                            Sorry, but we have encountered an error attempting to log you in. One common reason for
                            this is that you attempted to login with a different social platform than the one you
                            signed up with. Please try again using the original platform you used to sign up.
                        </p>
                        <p>
                            Thank you!
                        </p>
                        <p>
                            For further support please contact support@the-social-edge.com. { this.props.hash ? `Support Code: ${this.props.hash}` : '' }
                        </p>
                    </div>
                </p>
            );
        }
    }

    renderModalBackdrop() {
        var classNames = 'modal-backdrop ';

        if (this.props.authenticating) {
            classNames += ' fade in';
        } else {
            classNames += ' hidden';
        }

        return (
            <div className={classnames('modal-backdrop', this.props.authenticating ? 'fade in' : 'hidden')}></div>
        );
    }
}

export default LoginComponent;
