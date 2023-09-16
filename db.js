/** Database setup for BizTime. */

const { Client } = require("pg");

let client = new Client({connectionString: "postgresql:///biztime"});

client.connect();

module.exports = client;
