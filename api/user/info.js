import db from "../db/db";
// 获取uid(通过uname)
export async function getMuserByUname(uname) {
  const [rows] = await db.query(
    `select id from music.muser where uname='${uname}'`
  );
  console.log(rows);
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
    let id = await getMuserByUname(uname);
    if (id === "") {
      return res.send({
        status: 200,
        msg: id,
      });
    } else {
      // 获取用户信息
      await db
        .query(`select * from music.muser_info where id='${id}'`)
        .then(([rows]) => {
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
        });
    }
  }
}
