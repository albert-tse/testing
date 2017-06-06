import React from 'react';
import { compose, pure, setPropTypes } from 'recompose';
import PropTypes from 'prop-types';

import Queue from './Queue.component';

export default compose(
    setPropTypes({
        title: PropTypes.string,
        items: PropTypes.array
    }),
    pure
)(Queue);
