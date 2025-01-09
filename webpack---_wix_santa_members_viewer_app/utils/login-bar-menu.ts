import { APP_WIDGET_LOGIN_MENU_ID } from '../constants';
import type { I$WWrapper } from '../types';

export const getLoginBarMenu = ($w: I$WWrapper) => $w(APP_WIDGET_LOGIN_MENU_ID);
