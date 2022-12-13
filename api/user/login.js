import db from "../../db/db";
// 登录
export default async function login(request, response) {
    if (!request || !request.body) {
        return response.send({
            status: 400,
            msg: "请求参数错误",
        });
    } 
    // 从路由中获取参数(uname,upass)
    const { uname, upass } = request.body;
    const rows = await db.query(
      `select * from music.muser where uname='${uname}' and upass='${upass}'`
    );
    if (rows[0].length !== 0 && rows[0] !== undefined) {
      // response.status(200).send({
      return response.send({
        status: 200,
        data: "登录成功",
      });
    } else {
      return response.send({
        status: 500,
        msg: "登录失败", //状态描述
      });
    }
  
}
