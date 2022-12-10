import db from "../../db/db";
// 获取账号密码(根据uname)
export default async function getMuserByUname(req, res) {
  if (null !== req && undefined !== req) {
    const { uname } = req.query;
    try {
      const rows = await db.query(`select * from music.muser where uname='${uname}'`);
      if (rows[0] !== undefined) {
        let muser = {
          id: rows[0][0][0],
          uname: rows[0][0][1],
          upass: rows[0][0][2]
        }
        res.send({
          status: 200,
          data: muser,
        });
        return res.end()
      } else {
        res.send({
          status: 200,
          msg: "查询结果为空",
        });
        return res.end()
      }
    } catch {
      res.send({
        status: 500,
        msg: "查询失败",
      });
      return res.end()
    }
  }
}
