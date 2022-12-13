// import db from "../../utils/db";
const db = require('../../utils/db')
// import R from '../../utils/res'
const R = require('../../utils/res')
/** 数据库,根据账号获取账号密码 */
export async function getMuserByUname(uname, res) {
  try {
    return db.query(`select * from music.muser where uname='${uname}'`);
  } catch {
    return R.ERR('查询失败', res)
  }
}
/** 获取账号密码(根据uname) */
export default async function getMuser(req, res) {
  if (!req || !req.query) {
    return R.ERR('请求参数错误', res)
  }
  const { uname } = req.query;
  try {
    // console.log(uname);
    const rows = await getMuserByUname(uname, res)
    if (rows[0] !== undefined && rows[0].length > 0) {
      let muser = {
        id: rows[0][0][0],
        uname: rows[0][0][1],
        upass: rows[0][0][2]
      }
      return R.OK(muser, res)
    }
    return R.ERR('查询结果为空', res)
  } catch {
    return R.ERR('获取账号密码失败', res)
  }
} 
