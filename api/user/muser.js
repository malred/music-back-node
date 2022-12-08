import db from "../db/db";
// 获取账号密码(根据uname)
export default async function getMuserByUname(req, res) {
  if (null !== req && undefined !== res) {
    const { uname } = request.query;
    const [rows] = await db.query(`select * from muser where uname='${uname}'`);
    if (rows.length > 0) {
      return res.send({
        status: 200,
        data: rows[0],
      });
    } else {
      return res.send({
        status: 200,
        msg: "查询结果为空",
      });
    }
  }
}
