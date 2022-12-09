import db from "../db/db";
import { getMuserByUname } from "../user/info";
// 添加好友
export default async function addFriend(req, res) {
    if (!req || !req.body) {
        return res.send({
            status: 400,
            msg: "请求参数错误",
        });
    }
    const { uid, fname, fgroup } = req.body;
    //通过fname获取id
    try {
        let [rows] = await getMuserByUname(fname)
        if (rows.length < 0) return res.send({
            status: 500,
            msg: "查无此人",
        });
        let fid = rows[0][0].id
        await db.query(
            `insert into friends (uid, fid, group)
             values ('${uid}', '${fid}', '${fgroup}')`
        );
        return res.send({
            status: 200,
            data: "修改成功",
        });
    } catch {
        return res.send({
            status: 500,
            msg: "获取好友列表失败",fid,
        });
    }
}
