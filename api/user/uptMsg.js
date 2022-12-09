import db from "../db/db";
// 修改密码
export default async function uptMsg(req, res) {
  if (null !== req && undefined !== res) {
    const { id, name, age, sex, birth, location } = req.query;
    await db
      .query(
        ` update music.muser_info
          set   name= ${name},
                age = ${age},
                sex=${sex},
                birth=DATE_FORMAT(${birth}, '%Y-%m-%d'),
                location=${location}
                where id = ${id};`
      )
      .then(() => {
        return res.send({
          status: 200,
          data: "修改成功",
        });
      })
      .catch(() => {
        return res.send({
          status: 200,
          msg: "修改失败",
        });
      });
  }
}
