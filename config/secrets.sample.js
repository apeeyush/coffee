/**
 * This is a sample config file.
 * Fill the config variables for yourself and rename it to secrets.js to load your config options
 */

module.exports = {

  db: process.env.DATABASE_URL || 'postgres://peeyush:password@localhost:5432/coffee',

  transporter: {
    service: 'xx',
    auth: {
        user: 'xxx@xx.xx',
        pass: 'xxxxxxx'
    }
  }

};
