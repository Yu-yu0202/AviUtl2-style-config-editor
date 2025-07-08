'use strict';
import { contextBridge, ipcRenderer } from 'electron';
import path from 'path';

contextBridge.exposeInMainWorld('electronAPI', {
    
});