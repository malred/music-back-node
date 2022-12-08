import db from "../db/db";
/**
 * 获取uid(通过uname)
 */
export async function getMuserIdByUname(uname) {
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
// 传入mysql2返回的数组,封装为userinfo对象
export async function toUserInfo(rows) {
  return {
    id: rows[0][0][0],
    name: rows[0][0][1],
    age: rows[0][0][2],
    birth: rows[0][0][3],
    createday: rows[0][0][4],
    location: rows[0][0][5],
    img: rows[0][0][6],
    sex: rows[0][0][7],
  };
}
// 获取用户信息(根据uname)
export default async function getInfo(req, res) {
  if (null !== req && undefined !== req) {
    const { uname } = req.query;
    try {
      let id = await getMuserIdByUname(uname);
      if (id === "") {
        return res.send({
          status: 200,
          msg: "该账号不存在",
        });
      } else {
        // 获取用户信息
        let rows = await db
          .query(`select * from music.muser_info where id='${id}'`)
        // 返回数组[[[x,x,x,x,x]],[],...],row[0][0][x]是单个的数据
        if (rows[0] != undefined) {
          let userinfo = await toUserInfo(rows)
          return res.send({
            status: 200,
            data: userinfo,
          });
        }
        else {
          return res.send({
            status: 500,
            msg: "查询结果为空",
          });
        }
      }
    } catch {
      return res.send({
        status: 500,
        msg: "获取用户信息失败",
      });
    }
  }
}
