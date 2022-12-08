import db from "../db/db";
// 登录
export default async function login(request, response) {
  if (null !== request && undefined !== request) {
    // 从路由中获取参数(uname,upass)
    const { uname, upass } = request.query;
    const [rows] = await db.query(
      `select * from muser where uname='${uname}' and upass='${upass}'`
    );
    if (rows.length === 0) {
      // response.status(200).send({
      response.send({
        status: 200,
        // msg: "登录成功", //状态描述
        data: "登录成功",
      });
    } else if (rows == "") {
      response.status(200).send({
        msg: "登录失败", //状态描述
      });
    }
  }
}
