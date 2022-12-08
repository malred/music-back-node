import db from "../db/db";
// 获取uid(通过uname)
export async function getMuserByUname(uname) {
  const [rows] = await db.query(`select * from muser where uname='${uname}'`);
  if (rows.length > 0) {
    return rows[0];
  } else {
    return "";
  }
}
// 获取用户信息(根据uname)
export default async function getInfo(req, res) {
  if (null !== req && undefined !== res) {
    const { uname } = req.query;
    let id = getMuserByUname(uname);
    if (id === "") {
      return res.send({
        status: 200,
        msg: "查询结果为空",
      });
    } else {
      // 获取用户信息
      const [rows] = await db.query(
        `select * from muser_info where id='${id}'`
      );
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
}
