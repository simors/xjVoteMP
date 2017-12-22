const logger = require('../lib/logger')

logger.info('Starting server...')
require('../../server/main').listen(8091, () => {
  logger.success('Server is running at http://localhost:8091')
})
