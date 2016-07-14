import React from 'react'
import UserStore from '../../stores/User.store';

class Freshdesk extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let isInternalInfluencer = /internal_influencer/.test(UserStore.getState().user.role);
        isInternalInfluencer ? this.renderSupportWidget() : this.renderChatbox();
    }

    render() {
        return false;
    }

    /**
     * This is used by outside influencers
     */
    renderChatbox() {
        var fc_CSS = document.createElement('link');
        fc_CSS.setAttribute('rel', 'stylesheet');
        var fc_isSecured = (window.location && window.location.protocol == 'https:');
        var fc_lang = document.getElementsByTagName('html')[0].getAttribute('lang');
        var fc_rtlLanguages = ['ar', 'he'];
        var fc_rtlSuffix = (fc_rtlLanguages.indexOf(fc_lang) >= 0) ? '-rtl' : '';
        fc_CSS.setAttribute('type', 'text/css');
        fc_CSS.setAttribute('href', ((fc_isSecured) ? 'https://d36mpcpuzc4ztk.cloudfront.net' : 'http://assets1.chat.freshdesk.com') + '/css/visitor' + fc_rtlSuffix + '.css');
        document.getElementsByTagName('head')[0].appendChild(fc_CSS);
        var fc_JS = document.createElement('script');
        fc_JS.type = 'text/javascript';
        fc_JS.defer = true;
        fc_JS.src = ((fc_isSecured) ? 'https://d36mpcpuzc4ztk.cloudfront.net' : 'http://assets.chat.freshdesk.com') + '/js/visitor.js';
        (document.body ? document.body : document.getElementsByTagName('head')[0]).appendChild(fc_JS);
        window.freshchat_setting = 'eyJ3aWRnZXRfc2l0ZV91cmwiOiJ0aGVzb2NpYWxlZGdlLmZyZXNoZGVzay5jb20iLCJwcm9kdWN0X2lkIjoxNjAwMDAwMDA1MiwibmFtZSI6IkNvbnRlbXBvIiwid2lkZ2V0X2V4dGVybmFsX2lkIjoxNjAwMDAwMDA1Miwid2lkZ2V0X2lkIjoiNTQyYzQ1MjgtNGNjMy00NjRhLWEyN2ItYjFlZTI4YTE1MzJhIiwic2hvd19vbl9wb3J0YWwiOmZhbHNlLCJwb3J0YWxfbG9naW5fcmVxdWlyZWQiOmZhbHNlLCJpZCI6MTYwMDAwMDIxNzEsIm1haW5fd2lkZ2V0IjpmYWxzZSwiZmNfaWQiOiI1ZGEyNjA3Yjk3YmIxOGUyMTM0MzJjNThhNWM3MTE3NSIsInNob3ciOjEsInJlcXVpcmVkIjoyLCJoZWxwZGVza25hbWUiOiJUaGUgU29jaWFsIEVkZ2UiLCJuYW1lX2xhYmVsIjoiTmFtZSIsIm1haWxfbGFiZWwiOiJFbWFpbCIsIm1lc3NhZ2VfbGFiZWwiOiJNZXNzYWdlIiwicGhvbmVfbGFiZWwiOiJQaG9uZSBOdW1iZXIiLCJ0ZXh0ZmllbGRfbGFiZWwiOiJUZXh0ZmllbGQiLCJkcm9wZG93bl9sYWJlbCI6IkRyb3Bkb3duIiwid2VidXJsIjoidGhlc29jaWFsZWRnZS5mcmVzaGRlc2suY29tIiwibm9kZXVybCI6ImNoYXQuZnJlc2hkZXNrLmNvbSIsImRlYnVnIjoxLCJtZSI6Ik1lIiwiZXhwaXJ5IjoxNDY0ODk3MTkzMDAwLCJlbnZpcm9ubWVudCI6InByb2R1Y3Rpb24iLCJkZWZhdWx0X3dpbmRvd19vZmZzZXQiOjMwLCJkZWZhdWx0X21heGltaXplZF90aXRsZSI6IkNoYXQgaW4gcHJvZ3Jlc3MiLCJkZWZhdWx0X21pbmltaXplZF90a'
            + 'XRsZSI6IkxldCdzIHRhbGshIiwiZGVmYXVsdF90ZXh0X3BsYWNlIjoiWW91ciBNZXNzYWdlIiwiZGVmYXVsdF9jb25uZWN0aW5nX21zZyI6IldhaXRpbmcgZm9yIGFuIGFnZW50IiwiZGVmYXVsdF93ZWxjb21lX21lc3NhZ2UiOiJIaSEgSG93IGNhbiB3ZSBoZWxwIHlvdSB0b2RheT8iLCJkZWZhdWx0X3dhaXRfbWVzc2FnZSI6Ik9uZSBvZiB1cyB3aWxsIGJlIHdpdGggeW91IHJpZ2h0IGF3YXksIHBsZWFzZSB3YWl0LiIsImRlZmF1bHRfYWdlbnRfam9pbmVkX21zZyI6Int7YWdlbnRfbmFtZX19IGhhcyBqb2luZWQgdGhlIGNoYXQiLCJkZWZhdWx0X2FnZW50X2xlZnRfbXNnIjoie3thZ2VudF9uYW1lfX0gaGFzIGxlZnQgdGhlIGNoYXQiLCJkZWZhdWx0X2FnZW50X3RyYW5zZmVyX21zZ190b192aXNpdG9yIjoiWW91ciBjaGF0IGhhcyBiZWVuIHRyYW5zZmVycmVkIHRvIHt7YWdlbnRfbmFtZX19IiwiZGVmYXVsdF90aGFua19tZXNzYWdlIjoiVGhhbmsgeW91IGZvciBjaGF0dGluZyB3aXRoIHVzLiBJZiB5b3UgaGF2ZSBhZGRpdGlvbmFsIHF1ZXN0aW9ucywgZmVlbCBmcmVlIHRvIHBpbmcgdXMhIiwiZGVmYXVsdF9ub25fYXZhaWxhYmlsaXR5X21lc3NhZ2UiOiJPdXIgYWdlbnRzIGFyZSB1bmF2YWlsYWJsZSByaWdodCBub3cuIFNvcnJ5IGFib3V0IHRoYXQsIGJ1dCBwbGVhc2UgbGVhdmUgdXMgYSBtZXNzYWdlIGFuZCB3ZSdsbCBnZXQgcmlnaHQgYmFjay4iLCJkZWZhdWx0X3ByZWNoYXRfbWVzc2FnZSI6IldlIGNhbi'
            + 'd0IHdhaXQgdG8gdGFsayB0byB5b3UuIEJ1dCBmaXJzdCwgcGxlYXNlIHRlbGwgdXMgYSBiaXQgYWJvdXQgeW91cnNlbGYuIiwiYWdlbnRfdHJhbnNmZXJlZF9tc2ciOiJZb3VyIGNoYXQgaGFzIGJlZW4gdHJhbnNmZXJyZWQgdG8ge3thZ2VudF9uYW1lfX0iLCJhZ2VudF9yZW9wZW5fY2hhdF9tc2ciOiJ7e2FnZW50X25hbWV9fSByZW9wZW5lZCB0aGUgY2hhdCIsInZpc2l0b3Jfc2lkZV9pbmFjdGl2ZV9tc2ciOiJUaGlzIGNoYXQgaGFzIGJlZW4gaW5hY3RpdmUgZm9yIHRoZSBwYXN0IDIwIG1pbnV0ZXMuIiwiYWdlbnRfZGlzY29ubmVjdF9tc2ciOiJ7e2FnZW50X25hbWV9fSBoYXMgYmVlbiBkaXNjb25uZWN0ZWQiLCJ2aXNpdG9yX2NvYnJvd3NlX3JlcXVlc3QiOiJDYW4gYWdlbnQgY29udHJvbCB5b3VyIGN1cnJlbnQgc2NyZWVuPyAiLCJjb2Jyb3dzaW5nX3N0YXJ0X21zZyI6IllvdXIgc2NyZWVuc2hhcmUgc2Vzc2lvbiBoYXMgc3RhcnRlZCIsImNvYnJvd3Npbmdfc3RvcF9tc2ciOiJZb3VyIHNjcmVlbnNoYXJpbmcgc2Vzc2lvbiBoYXMgZW5kZWQiLCJjb2Jyb3dzaW5nX2NhbmNlbF92aXNpdG9yX21zZyI6IlNjcmVlbnNoYXJpbmcgaXMgY3VycmVudGx5IHVuYXZhaWxhYmxlIiwiY2Jfdmlld2luZ19zY3JlZW5fdmkiOiJBZ2VudCBjYW4gdmlldyB5b3VyIHNjcmVlbiAiLCJjYl9jb250cm9sbGluZ19zY3JlZW5fdmkiOiJBZ2VudCBjYW4gY29udHJvbCB5b3VyIHNjcmVlbiIsImNiX2dpdmVfY29udHJvbF92aSI6IkF'
            + 'sbG93IGFnZW50IHRvIGNvbnRyb2wgeW91ciBzY3JlZW4iLCJjb2Jyb3dzaW5nX3N0b3BfcmVxdWVzdCI6IkVuZCB5b3VyIHNjcmVlbnNoYXJpbmcgc2Vzc2lvbiIsInNpdGVfaWQiOiI1ZGEyNjA3Yjk3YmIxOGUyMTM0MzJjNThhNWM3MTE3NSIsImFjdGl2ZSI6dHJ1ZSwid2lkZ2V0X3ByZWZlcmVuY2VzIjp7IndpbmRvd19jb2xvciI6IiM3Nzc3NzciLCJ3aW5kb3dfcG9zaXRpb24iOiJCb3R0b20gUmlnaHQiLCJ3aW5kb3dfb2Zmc2V0IjoiMzAiLCJtaW5pbWl6ZWRfdGl0bGUiOiJMZXQncyB0YWxrISIsIm1heGltaXplZF90aXRsZSI6IkNoYXQgaW4gcHJvZ3Jlc3MiLCJ0ZXh0X3BsYWNlIjoiWW91ciBNZXNzYWdlIiwid2VsY29tZV9tZXNzYWdlIjoiSGkhIEhvdyBjYW4gd2UgaGVscCB5b3UgdG9kYXk/IiwidGhhbmtfbWVzc2FnZSI6IlRoYW5rIHlvdSBmb3IgY2hhdHRpbmcgd2l0aCB1cy4gSWYgeW91IGhhdmUgYWRkaXRpb25hbCBxdWVzdGlvbnMsIGZlZWwgZnJlZSB0byBwaW5nIHVzISIsIndhaXRfbWVzc2FnZSI6Ik9uZSBvZiB1cyB3aWxsIGJlIHdpdGggeW91IHJpZ2h0IGF3YXksIHBsZWFzZSB3YWl0LiIsImFnZW50X2pvaW5lZF9tc2ciOiJ7e2FnZW50X25hbWV9fSBoYXMgam9pbmVkIHRoZSBjaGF0IiwiYWdlbnRfbGVmdF9tc2ciOiJ7e2FnZW50X25hbWV9fSBoYXMgbGVmdCB0aGUgY2hhdCIsImNvbm5lY3RpbmdfbXNnIjoiV2FpdGluZyBmb3IgYW4gYWdlbnQiLCJhZ2VudF90cmFuc2Zlcl9tc2dfdG9fdmlz'
            + 'aXRvciI6IllvdXIgY2hhdCBoYXMgYmVlbiB0cmFuc2ZlcnJlZCB0byB7e2FnZW50X25hbWV9fSJ9LCJyb3V0aW5nIjpudWxsLCJwcmVjaGF0X2Zvcm0iOnRydWUsInByZWNoYXRfbWVzc2FnZSI6IldlIGNhbid0IHdhaXQgdG8gdGFsayB0byB5b3UuIEJ1dCBmaXJzdCwgcGxlYXNlIHRha2UgYSBjb3VwbGUgb2YgbW9tZW50cyB0byB0ZWxsIHVzIGEgYml0IGFib3V0IHlvdXJzZWxmLiIsInByZWNoYXRfZmllbGRzIjp7Im5hbWUiOnsidGl0bGUiOiJOYW1lIiwic2hvdyI6IjIifSwiZW1haWwiOnsidGl0bGUiOiJFbWFpbCIsInNob3ciOiIyIn0sInBob25lIjp7InRpdGxlIjoiUGhvbmUgTnVtYmVyIiwic2hvdyI6IjAifSwidGV4dGZpZWxkIjp7InRpdGxlIjoiVGV4dGZpZWxkIiwic2hvdyI6IjAifSwiZHJvcGRvd24iOnsidGl0bGUiOiJEcm9wZG93biIsInNob3ciOiIwIiwib3B0aW9ucyI6WyJsaXN0MSIsImxpc3QyIiwibGlzdDMiXX19LCJidXNpbmVzc19jYWxlbmRhciI6bnVsbCwibm9uX2F2YWlsYWJpbGl0eV9tZXNzYWdlIjp7InRleHQiOiJPdXIgYWdlbnRzIGFyZSB1bmF2YWlsYWJsZSByaWdodCBub3cuIFNvcnJ5IGFib3V0IHRoYXQsIGJ1dCBwbGVhc2UgbGVhdmUgdXMgYSBtZXNzYWdlIGFuZCB3ZSdsbCBnZXQgcmlnaHQgYmFjay4iLCJ0aWNrZXRfbGlua19vcHRpb24iOiJmYWxzZSIsImN1c3RvbV9saW5rX3VybCI6IiJ9LCJwcm9hY3RpdmVfY2hhdCI6ZmFsc2UsInByb2FjdGl2ZV90aW1lIjoxNSwic2l0Z'
            + 'V91cmwiOiJ0aGVzb2NpYWxlZGdlLmZyZXNoZGVzay5jb20iLCJleHRlcm5hbF9pZCI6MTYwMDAwMDAwNTIsImRlbGV0ZWQiOmZhbHNlLCJvZmZsaW5lX2NoYXQiOnsic2hvdyI6IjEiLCJmb3JtIjp7Im5hbWUiOiJOYW1lIiwiZW1haWwiOiJFbWFpbCIsIm1lc3NhZ2UiOiJNZXNzYWdlIn0sIm1lc3NhZ2VzIjp7InRpdGxlIjoiTGVhdmUgdXMgYSBtZXNzYWdlISIsInRoYW5rIjoiVGhhbmsgeW91IGZvciB3cml0aW5nIHRvIHVzLiBXZSB3aWxsIGdldCBiYWNrIHRvIHlvdSBzaG9ydGx5LiIsInRoYW5rX2hlYWRlciI6IlRoYW5rIHlvdSEifX0sIm1vYmlsZSI6dHJ1ZSwiY3JlYXRlZF9hdCI6IjIwMTYtMDUtMDJUMjA6MTA6MzMuMDAwWiIsInVwZGF0ZWRfYXQiOiIyMDE2LTA1LTAyVDIwOjEwOjMzLjAwMFoifQ==';
    }

    /**
     * This is used by internal influencers
     */
    renderSupportWidget() {
        let widget = document.createElement('script');
        widget.src = 'http://assets.freshdesk.com/widget/freshwidget.js';
        widget.onload = this.initWidget;
        document.body.appendChild(widget);
    }

    initWidget() {
        if (typeof FreshWidget !== 'undefined' && typeof window !== 'undefined') { // in testing environments, we won't have window object
            FreshWidget.init("", {"queryString": "&widgetType=popup&formTitle=Contempo+Support", "utf8": "✓", "widgetType": "popup", "buttonType": "text", "buttonText": "Support", "buttonColor": "white", "buttonBg": "#006063 ", "alignment": "2", "offset": "235px", "formHeight": "500px", "url": "https://thesocialedge.freshdesk.com"} ); // FreshWidget is in global scope
            window.dispatchEvent(new Event('load')); // we need to trigger this event so FreshWidget widget gets displayed
        }
    }
}

export default Freshdesk;
