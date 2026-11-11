const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { sequelize } = require('../src/config/db');

(async () => {
  try {
    const [cols] = await sequelize.query('DESCRIBE Users;');
    const fields = cols.map(c => c.Field);
    if (!fields.includes('addresses')) {
      await sequelize.query('ALTER TABLE Users ADD COLUMN addresses JSON NULL;');
      console.log('Added addresses column to Users table!');
    } else {
      console.log('addresses column already exists!');
    }
  } catch (err) {
    console.error('Error:', err);
  }
  process.exit(0);
})();
