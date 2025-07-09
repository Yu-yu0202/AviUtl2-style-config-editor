'use strict';
import { contextBridge } from 'electron';
import { ConfFileHandler } from './handler/ConfFileHandler.js';

const confPath = 'c:/Applications/AviUtl2/style.conf';
const handler = new ConfFileHandler(confPath);

contextBridge.exposeInMainWorld('electronAPI', {
  readConf: () => {
    const confText = handler.readConfFile();
    return handler.parseConfFile(confText);
  },
  writeConf: (confJson: Record<string, Record<string, string>>) => {
    const confText = handler.setConfFile(confJson);
    handler.writeConfFile(confText);
  }
});