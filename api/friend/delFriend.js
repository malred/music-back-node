import db from "../db/db"
// 根据uid和mid从我喜欢的音乐里移除
export async function delFriendByUidAndFid(uid, fid, res) {
    try {
        db.query(
            `delete
                from music.friends
                where uid = '${uid}'
                and fid = '${fid}'`
        )
    } catch {
        res.send({
            status: 500,
            msg: '删除失败'
        })
        return res.end()
    }
}
// 删除好友
export default async function delFriend(req, res) {
    if (!req || !req.query) {
        return res.send({
            status: 400,
            msg: '请求参数错误'
        })
    }
    try {
        // query是因为我前端把参数放url里了
        const { uid, fid } = req.query
        if (undefined !== uid && undefined !== fid) {
            await delFriendByUidAndFid(uid, fid, res)
            res.send({
                status: 200,
                data: '删除成功'
            })
        }
        return res.end()
    } catch {
        res.send({
            status: 500,
            msg: '删除失败'
        })
        return res.end()
    }
}
