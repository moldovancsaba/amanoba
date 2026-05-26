#!/usr/bin/env node
import { extendGdsTheme } from '@doneisbetter/gds-theme/server';

const theme = extendGdsTheme({
  colors: {
    amanoba: [
      '#fff9e6',
      '#fff0bf',
      '#ffe38a',
      '#ffd452',
      '#ffc421',
      '#fab908',
      '#c89100',
      '#966c00',
      '#654800',
      '#332400',
    ],
  },
  primaryColor: 'amanoba',
});

if (!theme?.colors) {
  console.error('extendGdsTheme failed');
  process.exit(1);
}

console.log('✅ @doneisbetter/gds-theme extendGdsTheme smoke passed');
