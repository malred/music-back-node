// import db from "../../utils/db";
const db = require('../../utils/db')
// import R from '../../utils/res'
const R = require('../../utils/res')
/** 数据库: 修改密码 */
export async function uptPassByUnameAndUpass(uname, upass, res) {
  try {
    db.query(
      `update music.muser
            set upass = '${upass}'
            where uname = '${uname}'`
    )
  } catch {
    return R.ERR('修改失败', res)
  }
}
/** 修改密码 */
export default async function uptPass(req, res) {
  if (!req || !req.body) {
    return R.ERR('请求参数错误', res)
  }
  const { uname, upass } = req.body;
  try {
    await uptPassByUnameAndUpass(uname, upass, res)
    return R.OK('修改成功', res)
  } catch {
    return R.ERR('修改失败')
  }
}
