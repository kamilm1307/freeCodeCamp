import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from '@freecodecamp/react-bootstrap';
import Spinner from 'react-spinkit';

import '../Donation.css';

const propTypes = {
  error: PropTypes.string,
  processing: PropTypes.bool,
  reset: PropTypes.func.isRequired,
  success: PropTypes.bool
};

function DonateCompletion({ processing = true, reset, success, error = null }) {
  /* eslint-disable no-nested-ternary */
  // success = error = null;
  // processing = true;
  const style = processing ? 'info' : success ? 'success' : 'danger';
  const heading = processing
    ? 'We are processing your donation.'
    : success
    ? 'Your donation was successful.'
    : 'Something went wrong with your donation';
  return (
    <Alert bsStyle={style} className='donation-completion'>
      <h4>
        <b>{heading}</b>
      </h4>
      <div className='donation-completion-body'>
        {processing && (
          <Spinner
            className='user-state-spinner'
            color='#0a0a23'
            fadeIn='none'
            name='line-scale'
          />
        )}
        {success && (
          <p>Thank you for supporting the freeCodeCamp.org community.</p>
        )}
        {error && <p>{error}</p>}
      </div>
      <p className='donation-completion-buttons'>
        {error && (
          <div>
            <Button bsStyle='primary' onClick={reset}>
              Try again
            </Button>
          </div>
        )}
      </p>
    </Alert>
  );
}

DonateCompletion.displayName = 'DonateCompletion';
DonateCompletion.propTypes = propTypes;

export default DonateCompletion;
