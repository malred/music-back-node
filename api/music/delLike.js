import db from "../db/db"
// 根据uid和mid从我喜欢的音乐里移除
export async function deleteByUidAndMid(uid, mid, res) {
    try {
        db.query(
            `delete
                from music.muser_like
                where uid = '${uid}'
                and mid = '${mid}'`
        )
    } catch {
        return res.send({
            status: 500,
            msg: '移除失败'
        })
    }
}
// 从列表移除喜欢的音乐
export default async function delLike(req, res) {
    if (!req || !req.query) {
        return res.send({
            status: 400,
            msg: '请求参数错误'
        })
    }
    try {
        // query是因为我前端把参数放url里了
        const { uid, mid } = req.query
        await deleteByUidAndMid(uid, mid, res)
        res.send({
            status: 200,
            data: '移除成功'
        })
        return res.end()
    } catch {
        return res.send({   
            status: 500,
            msg: '移除失败'
        })
    }
}
