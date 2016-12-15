'use strict';

const fs = require('fs');
const path = require('path');
const tmp = path.join(__dirname, '..', 'tmp');

fs.access(tmp, fs.constants.R_OK | fs.constants.W_OK, (err) => {
  if (err) {
    console.log('Creating tmp folder...');
    fs.mkdir(tmp, (err) => new Error(err));
  }
});
