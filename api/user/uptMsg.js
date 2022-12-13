// import db from "../../utils/db";
const db = require('../../utils/db')
// import R from '../../utils/res'
const R = require('../../utils/res')
/** 数据库: 修改个人信息 */
export async function updateUserInfo(id, name, age, sex, birth, location, res) {
  try {
    db.query(
      `update music.muser_info
         set name = '${name}',
             age = ${age},
             sex = '${sex}',
             birth = DATE_FORMAT('${birth}', '%Y-%m-%d'),
             location = '${location}'
         where id = '${id}'`
    );
  } catch {
    return R.ERR('更新失败',res)
  }
}
/** 修改信息 */
export default async function uptMsg(req, res) {
  if (!req || !req.body) {
    return R.ERR('请求参数错误', res)
  }
  const { id, name, age, sex, birth, location } = req.body;
  try {
    // console.log(id, name, age, sex, birth, location);
    await updateUserInfo(id, name, age, sex, birth, location, res)
    return R.OK('修改成功', res)
  } catch {
    return R.ERR('修改失败', res)
  }
}
