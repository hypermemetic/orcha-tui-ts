#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import App from './App.js';

// Parse command line arguments
const args = process.argv.slice(2);
const urlArg = args.find((arg) => arg.startsWith('--url='));
const url = urlArg ? urlArg.split('=')[1] : 'ws://127.0.0.1:4444';

// Render the app
render(<App url={url} />);
