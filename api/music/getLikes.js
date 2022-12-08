import db from "../db/db";
// 获取喜欢的歌曲列表(根据uid)
export async function getMuserLikesByUid(uid, res) {
    try {
        return db.query(
            `select mid
            from music.muser_like
            where uid = '${uid}'`)
    } catch {
        return res.send({ status: 500, msg: '获取喜欢歌曲列表失败' })
    }
}
// 根据mid获取歌曲信息
export async function getLike(mid, res) {
    try {
        return db.query(
            `select *
            from music.music_info
            where mid = '${mid}'`)
    } catch {
        return res.send({ status: 500, msg: '获取歌曲信息失败' })
    }
}
// 根据mysql2的返回结果封装为musicinfo对象
export async function toMusicInfo(rows) {
    return {
        mid: rows[0][0][0],
        mname: rows[0][0][1],
        pic_url: rows[0][0][2],
        arname: rows[0][0][3],
    };
}
// 获取喜欢的歌曲列表
export default async function getLikes(req, res) {
    if (!req || !req.query) {
        return res.send({
            status: 400,
            msg: "请求参数错误",
        });
    }
    const { uid } = req.query
    try {
        //喜欢的歌曲列表
        let likes = []
        // 获取喜欢的歌曲列表
        let mids = await getMuserLikesByUid(uid, res)
        if (mids[0] !== undefined && mids[0].length > 0) {
            for (let i = 0; i < mids[0].length; i++) {
                // 遍历获取音乐信息
                let rows = await getLike(mids[0][i][0])
                if (rows[0] !== undefined && rows.length > 0) {
                    // 转为musicinfo对象
                    let musicinfo = await toMusicInfo(rows)
                    likes.push(musicinfo)
                }
            }
        }
        res.send({
            status: 200,
            data: likes
        })
        // 防止res一直挂起,导致报错:Error: Cannot set headers after they are sent to the client
        return res.end()
    } catch {
        return res.send({ status: 500, msg: '获取喜欢歌曲列表失败' })
    }
}