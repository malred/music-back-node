// import db from "../../utils/db";
const db = require('../../utils/db')
// import R from '../../utils/res'
const R = require('../../utils/res')
/** 数据库: 根据id查询账号密码表 */
export async function getUserById(id, res) {
  try {
    return db.query(`select * from music.muser where id='${id}'`)
  } catch {
    return R.ERR('注册失败', res)
  }
}
/** 数据库: 注册,插入账号密码表 */
export async function insertUser(id, uname, upass, res) {
  try {
    db.query(`insert into music.muser values 
                ('${id}','${uname}','${upass}')`)
  } catch {
    return R.ERR('插入数据失败', res)
  }
}
/** 数据库: 注册,插入用户信息 */
export async function insertUserInfo(id, res) {
  try {
    db.query(
      `insert into music.muser_info(id, createday) 
            values ('${id}', DATE_FORMAT(now(), '%Y-%m-%d'))`
    )
  } catch {
    return R.ERR('插入数据失败', res)
  }
}
/** 注册 */
export default async function register(req, res) {
  if (!req || !req.body) {
    return R.ERR('请求参数错误', res)
  }
  // 从路由中获取参数(uname,upass)
  const { id, uname, upass } = req.body;
  if (uname === "" || upass === "") {
    return R.ERR('账号密码不能为空')
  }
  try {
    // id是唯一的
    const rows = await getUserById(id, res)
    // 如果id已存在
    if (rows[0].length > 0 && rows[0] !== undefined) {
      return R.ERR('账号已存在', res)
    }
    // 插入muser表
    await insertUser(id, uname, upass, res)
    // 插入muser_info表
    await insertUserInfo(id, res)
    // 执行完所有操作后 进行提交
    // 都成功,并提交完成后
    return R.OK("注册成功", res)
  } catch {
    return R.ERR('注册失败', res)
  }
} 
