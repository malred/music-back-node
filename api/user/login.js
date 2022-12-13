// 在本地要用import,在浏览器用require
// import db from "../../utils/db";
const db = require('../../utils/db')
// import R from '../../utils/res'
const R = require('../../utils/res')
/** 数据库查询,登录 */
export function getUserByUnameAndUpass(uname, upass, res) {
    try {
        return db.query(`select *
             from music.muser
             where uname = '${uname}'
               and upass = '${upass}'`)
    } catch {
        return R.ERR('查询错误', res)
    }
}
/** 登录 */
export default async function login(req, res) {
    if (!req || !req.body) {
        return R.ERR('请求参数错误', res)
    }
    // 从路由中获取参数(uname,upass)
    const { uname, upass } = req.body;
    try {
        const rows = await getUserByUnameAndUpass(uname, upass, res)
        // console.log(rows);
        if (rows[0].length !== 0 && rows[0] !== undefined) {
            return R.OK('登录成功', res)
        }
        return R.ERR('账号或密码错误', res)
    } catch {
        return R.ERR('登录失败', res)
    }
}
