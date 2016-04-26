import Alt from 'alt';
import Config from './config/';
var alt = new Alt();

if (Config.debug == true) {
    window.contempo_alt = alt;
    Alt.debug('alt', alt);
}

export default alt
