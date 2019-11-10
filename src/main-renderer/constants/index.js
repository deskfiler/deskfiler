import { remote } from 'electron';
import path from 'path';

const { app } = remote.require('electron');

/* Directories */
export const DESKFILER_DIR = app.getPath('userData');
export const HOME_DIR = app.getPath('home');
export const PLUGINS_DIR = path.join(DESKFILER_DIR, 'plugins');
export const LOGS_DIR = path.join(DESKFILER_DIR, 'logs');
export const TEMP_DIR = path.join(app.getPath('temp'), 'deskfiler');

export const PORT = 4400;
