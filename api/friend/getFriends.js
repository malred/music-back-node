import db from "../db/db";
import { column } from "./addFriend";
// 根据uid查询分组信息
export async function getGroupsByUid(uid, res) {
    try {
        return db.query(
            `select ${column}
            from music.friends
            where uid = '${uid}'`
        )
    } catch {
        return res.send({
            status: 500,
            msg: `获取分组失败`,
        });
    }
}
// 获取好友列表
export default async function getFriendsByUid(req, res) {
    if (!req || !req.body) {
        return res.send({
            status: 400,
            msg: "请求参数错误",
        });
    }
    const { uid } = req.query;
    try {
        //先查询该uid的所有分组 
        return res.send({
            status: 200,
            data: getGroupsByUid(uid, res)
        })
    } catch {
        return res.send({
            status: 500,
            msg: `添加好友失败`, // ${uid},${fid},${fgroup}
        });
    }
}
