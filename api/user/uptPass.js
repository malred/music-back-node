import db from "../db/db";
// 修改密码
export default async function uptPass(req, res) {
  if (null !== req && undefined !== req) {
    const { uname, upass } = req.query;
    await db
      .query(
        `update muser
            set upass = '${upass}'
            where uname = '${uname}'`
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
