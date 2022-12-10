import db from "../../utils/db";
import R from '../../utils/res'
/** 获取uid(通过uname) */
export async function getMuserIdByUname(uname, res) {
  try {
    return db.query(
      `select id from music.muser where uname='${uname}'`
    );
  } catch {
    return R.ERR('查询失败', res)
  }
}
/** 传入mysql2返回的数组,封装为userinfo对象 */
export async function toUserInfo(rows) {
  return {
    id: rows[0][0][0],
    name: rows[0][0][1],
    age: rows[0][0][2],
    birth: rows[0][0][3],
    createday: rows[0][0][4],
    location: rows[0][0][5],
    img: rows[0][0][6],
    sex: rows[0][0][7],
  };
}
/** 获取用户信息(根据uid) */
export async function getInfoByUname(uid, res) {
  try {
    return db.query(`select * from music.muser_info where id='${uid}'`)
  } catch {
    return R.ERR('查询失败', res)
  }
}
/** 获取用户信息 */
export default async function getInfo(req, res) {
  if (!req || !req.query) {
    return R.ERR('请求参数错误', res)
  }
  const { uname } = req.query;
  try {
    let id = await getMuserIdByUname(uname, res);
    if (id[0].length < 0 || id[0] === undefined) {
      return R.ERR('该账号不存在', res)
    }
    // 获取用户信息
    let rows = await getInfoByUname(id[0][0][0], res)
    // 返回数组[[[x,x,x,x,x]],[],...],row[0][0][x]是单个的数据
    if (rows[0] != undefined && rows[0].length > 0) {
      let userinfo = await toUserInfo(rows)
      return R.OK(userinfo, res)
    }
    return R.ERR('查询结果为空', res)
  } catch {
    return R.ERR('获取用户信息失败', res)
  }
}
