import React from 'react'
import { Header, Facebook } from '../shared/index'

class LoginComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    renderAuthOptions() {
        return (
            <div id="auth-options">
                { _.map(this.props.authTypes, function(el){
                return <a onClick={ el.action } key={ el.text } className={ 'social-icons ' + el.text.toLowerCase() }><i className={ 'fa fa-lg fa-' + el.text.toLowerCase() }></i></a>
                }) }
            </div>
        );
    }

    renderErrorMessage() {
        if (this.props.authError) {
            var errorMessage =
                'Sorry, but we have encountered an error attemping to log you in.' +
                ' Please try again. For further support please contact support@the-social-edge.com';

            if (this.props.authError && this.props.authError.data && this.props.authError.data.error_code == 'user_not_found') {
                errorMessage =
                    'Sorry, but we could not find that account. Please try again, or create and account' +
                    ' For further support please contact support@the-social-edge.com';
            }

            if (this.props.authError && this.props.authError.data && this.props.authError.data.error_code == 'dupe_account') {
                errorMessage =
                    'Whoops! It looks like you already have an account with Contempo, but are trying to login with ' +
                    'a platform that is not connected to your account. Please try again using a different ' +
                    'login platform. For further support please contact support@the-social-edge.com';
            }

            return (
                <p id="error-message" class="bg-danger">
                    { errorMessage }
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
            <div className={ classNames }></div>
        );
    }

    render() {
        return (
            <div id="login">
                <Facebook />
                <Header className="extended with-cover" />
                <div className="container">
                    <div className="jumbotron">
                        <h2>Login / Signup</h2>
                        <p>
                            Select on of the options below to sign in. Don't have an account? Just log in with any of the accounts below, and we will make one for you.
                        </p>
                        { this.renderAuthOptions() }
                        { this.renderErrorMessage() }
                    </div>
                    <article>
                        <section>
                            <h2>Influencers</h2>
                            <h3>Access diverse, high-quality paid content from a network of online publishers</h3>
                            <p>Unlike typical influencer-publisher partnerships, The Social Edge’s lineup of online publishing houses offers a dynamic feed of content diverse enough to suit any fan base. Our publishers are high quality, vetted sources—many are sites you already love.</p>
                            <h3> Inspire movements. Let us handle the logistics.</h3>
                            <p>The Social Edge makes finding and sharing meaningful content with fans easy and enjoyable. Our expert team handles all the hoopla of contracts, tracking and payment, so you can spend energy on more interesting stuff — like building a social movement.</p> 
                            <h3>Stay true to your voice and grow your followers organically</h3>
                            <p>You choose what material to share and when to share it. We help by giving you the best recommendations from a constant stream of new share-worthy articles, so you can keep your fans engaged with laughs, news and editorials that resonate with you.</p>
                            <a href="http://thesocialedgestaging.squarespace.com/influencers" target="_blank">Learn More</a>
                        </section>
                        <section>
                            <h2>Publishers</h2>
                            <h3>Increase traffic exponentially and attract new regular readership</h3>
                            <p>Our broad influencer network broadcasts your content to millions of followers, plus millions more when followers share with their friends. With the exposure our Influencers can offer, you’ll become the go-to source for quality content in your industry.</p>
                            <h3>Match your content with targeted, engaged audiences</h3>
                            <p>Our approach capitalizes on the organic reach of vetted, influential internet personalities with avid followers who are eager to consume recommended content. Targeting specific fan bases yields more clicks than traditional and native ads.</p>
                            <h3>Configure your content feed for effortless management</h3>
                            <p>Spend less time distributing content and more time creating it. Our publisher portal automatically pulls content from your RSS feed and generates social media cards for our influencers to share. Additional levels of content management are also readily available.</p>
                            <a href="http://thesocialedgestaging.squarespace.com/publishers" target="_blank">Learn More</a>
                        </section>
                    </article>
                </div>
                { this.renderModalBackdrop() }
            </div>
        );
    }
}

export default LoginComponent;
