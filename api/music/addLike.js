// import db from "../../utils/db";
const db = require('../../utils/db')
// import R from '../../utils/res'
const R = require('../../utils/res')
// 根据id获取喜欢的歌曲
export async function getUserLikeById(id, res) {
    try {
        return db.query(
            `select *
                from music.muser_like
                where id = '${id}'`
        )
    } catch {
        return res.send({
            status: 500,
            msg: '获取歌曲失败'
        })
    }
}
// 添加音乐信息  
export async function insertMusicInfo(musicInfo, res) {
    try {
        db.query(
            `insert into music.music_info (mid, mname, pic_url, arname)
                values ('${musicInfo.mid}', '${musicInfo.mname}',
                        '${musicInfo.picUrl}', '${musicInfo.arname}')`
        )
    } catch {
        return res.send({
            status: 500,
            msg: '添加歌曲信息失败'
        })
    }
}
// 添加到喜欢的音乐
export async function insertUserLike(uid, musicInfo, res) {
    try {
        db.query(
            `insert into music.muser_like (id, uid, mid)
                values (concat('${uid}', '${musicInfo.mid}'),
                        '${uid}','${musicInfo.mid}')`
        )
    } catch {
        return res.send({
            status: 500,
            msg: '添加歌曲失败'
        })
    }
}
/**
 * 获取歌曲信息(通过mid)
 */
export async function getMusicByMid(mid, res) {
    try {
        return db.query(
            `select * from music.music_info
                where mid='${mid}'`
        )
    } catch {
        return res.send({
            status: 500,
            msg: '获取歌曲信息失败'
        })
    }
}
// 添加到我喜欢的音乐里
export default async function addMusicLikeById(req, res) {
    if (!req || !req.body) {
        return res.send({ status: 400, msg: '请求参数错误' })
    }
    try {
        const { uid, mid, arname, mname, picUrl } = req.body
        var musicinfo = {
            mid, mname, picUrl, arname
        }
        // 插入之前先查询是否已经存在
        // concat是拼接字符串
        // muser_like表的id是uid和mid拼接出来的
        let userlike = await getUserLikeById((uid + musicinfo.mid), res)
        if (userlike[0].length > 0) {
            return res.send({
                status: 500,
                msg: '歌曲已存在'
                // msg: userlike
            })
        } else {
            await insertUserLike(uid, musicinfo, res)
        }
        // 检测歌曲信息是否已经存在
        let oldmusic = await getMusicByMid(musicinfo.mid, res)
        if (oldmusic[0].length > 0) {
            return res.send({
                status: 200,
                // msg: '该歌曲信息已存在' ,
                data: '添加成功'
            })
        } else {
            await insertMusicInfo(musicinfo, res)
        }
        res.send({
            status: 200,
            data: '添加成功'
        })
        return res.end()
    } catch {
        return res.send({
            status: 500,
            msg: '添加失败'
        })
    }
}
