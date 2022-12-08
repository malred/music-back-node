import db from "../db/db";
import { get } from "../utils/objects";
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
        msg: "该账号不存在",
      });
    } else {
      // 获取用户信息
      await db
        .query(`select * from music.muser_info where id='${id}'`)
        .then((rows) => {
          // 返回数组[[[x,x,x,x,x]],[],...],row[0][0][x]是单个的数据
          let data = get(rows);
          let userinfo = {
            id: data[0],
            name: data[1],
            age: data[2],
            birth: data[3],
            createday: data[4],
            location: data[5],
            img: data[6],
            sex: data[7],
          };
          if (rows.length > 0) {
            return res.send({
              status: 200,
              data: userinfo,
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
