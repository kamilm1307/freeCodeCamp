import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { reducer as app, ns as appNameSpace } from './';
import {
  reducer as flash,
  ns as flashNameSpace
} from '../components/Flash/redux';
import { reducer as settings, ns as settingsNameSpace } from './settings';
import {
  reducer as challenge,
  ns as challengeNameSpace
} from '../templates/Challenges/redux';
import {
  reducer as search,
  ns as searchNameSpace
} from '../components/search/redux';

export default combineReducers({
  [appNameSpace]: app,
  [challengeNameSpace]: challenge,
  [flashNameSpace]: flash,
  form: formReducer,
  [searchNameSpace]: search,
  [settingsNameSpace]: settings
});
