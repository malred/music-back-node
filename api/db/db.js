var mysql = require("mysql2");
var pool = mysql.createPool({
  host: "containers-us-west-109.railway.app",
  port: 6390,
  database: "music",
  user: "root",
  password: "nFNWD8a7KSaLLbDaN2uO",
});
export default pool.promise()
