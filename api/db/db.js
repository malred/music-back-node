var mysql = require("mysql2");
var pool = mysql.createPool({
  host: "containers-us-west-109.railway.app",
  port: 6390,
  database: "music",
  user: "root",
  password: "nFNWD8a7KSaLLbDaN2uO",
  // select返回的从数组对象改为数组
  rowsAsArray: true,
  // 返回的时间格式以数据库的时间格式为准
  // 否则会返回1986-01-01T00:00:00.000Z这种格式
  timezone: 'SYSTEM',
  //强制日期类型(TIMESTAMP, DATETIME, DATE)以字符串返回，
  // 而不是一javascript Date对象返回. (默认: false)
  dateStrings: true,
});
export default pool.promise();
