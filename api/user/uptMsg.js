import db from "../../db/db"; 
// 修改信息
export default async function uptMsg(req, res) {
  if (!req || !req.body) {
    return res.send({
      status: 400,
      msg: "请求参数错误",
    });
  }
  const { id, name, age, sex, birth, location } = req.body; 
  try {
    await db.query(
      `update music.muser_info
         set name = '${name}',
             age = ${age},
             sex = '${sex}',
             birth = DATE_FORMAT('${birth}', '%Y-%m-%d'),
             location = '${location}'
         where id = '${id}';`
    );
    return res.send({
      status: 200,
      data: "修改成功",
    });
  } catch (error) {
    return res.send({
      status: 500,
      msg: "修改失败",
    });
  }
}
