import db from "../db/db";
// 注册
export default async function register(request, response) {
  if (null !== request && undefined !== request) {
    // 从路由中获取参数(uname,upass)
    const { id, uname, upass } = request.query;
    if (uname === "" || upass === "") {
      return response.send({
        status: 200,
        msg: "账号密码不能为空",
      });
    }
    // id是唯一的
    const [rows] = await db
      .query(`select * from muser where id='${id}'`)
      .catch((err) => {
        if (err) {
          return response.send({
            status: err.status || 500,
            msg: "注册失败",
          });
        }
      });
    // 如果id已存在
    if (rows.length !== 0) {
      return response.send({
        status: err.status || 500,
        msg: "账号已存在",
      });
    } else {
      // 插入muser表
      db.query(`insert into muser values ('${id}','${uname}','${upass}')`)
        .catch((err) => {
          return response.send({
            status: err.status || 500,
            msg: "注册失败",
          });
        })
        .then(() => {
          // 插入muser_info表
          db.query(
            `insert into muser_info(id, createday) 
            values ('${id}', DATE_FORMAT(now(), '%Y-%m-%d'))`
          )
            .then(() => {
              // 执行完所有操作后 进行提交
              // 都成功,并提交完成后
              return response.send({
                status: 200,
                data: "注册成功",
              });
            })
            .catch((err) => {
              return response.send({
                status: err.status || 200,
                msg: "注册失败",
              });
            });
        });
    }
  }
}
