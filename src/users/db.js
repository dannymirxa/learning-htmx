const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'posts',
    password: 'Danial123@',
    port: 5455,
})

module.exports = pool