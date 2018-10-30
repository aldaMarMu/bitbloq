import {createAction} from 'redux-actions';

export const showNotification = createAction(
  'UI_SHOW_NOTIFICATION',
  (key, content, time) => ({key, content, time}),
);
export const hideNotification = createAction('UI_HIDE_NOTIFICATION');
export const keyDown = createAction('UI_KEY_DOWN');
export const keyUp = createAction('UI_KEY_UP');
export const appClick = createAction('UI_APP_CLICK');
