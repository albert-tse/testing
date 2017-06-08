import { Button } from 'react-toolbox';
import { DIALOG, OVERLAY } from 'react-toolbox/lib/identifiers';
import { dialogFactory } from 'react-toolbox/lib/dialog/Dialog';
import { Overlay } from 'react-toolbox/lib/overlay/Overlay';
import { themr } from 'react-css-themr';

import dialogTheme from 'react-toolbox/lib/dialog/theme';
import overlayTheme from '../../scss/overlay';

const ThemedOverlay = themr(OVERLAY, overlayTheme)(Overlay);

const Dialog = dialogFactory(ThemedOverlay, Button);
const ThemedDialog = themr(DIALOG, dialogTheme)(Dialog);

export default ThemedDialog;
export { ThemedDialog as Dialog };
