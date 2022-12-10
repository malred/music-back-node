import db from "../../db/db";
// 修改密码
export default async function uptPass(req, res) {
  if (null !== req && undefined !== req) {
    const { uname, upass } = req.query;
    try {
      await db
        .query(
          `update muser
            set upass = '${upass}'
            where uname = '${uname}'`
        )
      res.send({
        status: 200,
        data: "修改成功",
      });
      return res.end()
    } catch {
      res.send({
        status: 200,
        msg: "修改失败",
      });
      return res.end()
    }
  }
}
