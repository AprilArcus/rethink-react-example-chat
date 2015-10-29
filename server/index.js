require('babel/register');
require('coffee-script').register();
require.extensions['.cson'] = function(module, filename) {
  module.exports = require('cson').load(filename);
};

require('./apiServer');
