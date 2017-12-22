'use strict';

var logger = require('../lib/logger');

logger.info('Starting server...');
require('../../server/main').listen(8091, function () {
  logger.success('Server is running at http://localhost:8091');
});

//# sourceMappingURL=start-compiled.js.map