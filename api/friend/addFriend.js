import db from "../db/db";
import { getMuserIdByUname } from "../user/info";
// 如果直接在语句用group会报错(因为是关键词)
// 但是在``里又不能加``来区别关键字
// 所有用变量来规避关键字
var column = '`group`'
// 根据uid和fid查询分组信息
export function getByUidAndFid(uid, fid) {
    try {
        // 查询旧分组
        var oldGroup = db.query(
            `select ${column}
            from music.friends
            where uid = '${uid}'
              and fid = '${fid}'`
        )
        return oldGroup[0]
    } catch {
        return res.send({
            status: 500,
            msg: `获取分组失败`,
        });
    }
}
// 根据uid和fid改分组
export function updataGroupByUidAndFid(uid, fid, fgroup) {
    try {
        // 更新分组 
        db.query(
            `update music.friends
            set ${column} = '${fgroup}'
            where uid = '${uid}'
              and fid = '${fid}'`
        )
    } catch {
        return res.send({
            status: 500,
            msg: `更新分组失败`,
        });
    }
}
// 用于新添加的好友是否已存在(分组也没变)
export function getByUidAndFidAndGroup(uid, fid, fgroup) {
    try {
        var [rows] = db.query(
            `select *
            from friends
            where uid = ${uid}
              and fid = ${fid}
              and ${column} = ${fgroup}`
        )
        return rows
    } catch {
        return res.send({
            status: 500,
            msg: `查询好友信息失败`,
        });
    }
}
// 添加好友
export default async function addFriend(req, res) {
    if (!req || !req.body) {
        return res.send({
            status: 400,
            msg: "请求参数错误",
        });
    }
    const { uid, fname, fgroup } = req.body;
    try {
        //通过fname获取id
        var fid = await getMuserIdByUname(fname)
        if (fid.length < 0 || fid === undefined || fid === '' || fid === null)
            return res.send({
                status: 500,
                msg: "查无此人",
            });
        // 如果已存在该好友,但是分组不同,就改分组
        if (getByUidAndFid(uid, fid) !== fgroup &&
            // 一条都没有的时候返回为null也会满足前面的判断
            null !== getByUidAndFid(uid, fid) &&
            undefined !== getByUidAndFid(uid, fid) &&
            0 < getByUidAndFid(uid, fid).length
        ) {
            // 改分组
            updataGroupByUidAndFid(uid, fid, fgroup)
            return res.send({
                status: 200,
                data: "修改分组成功",
            });
        }
        //如果已存在,分组也相同
        if (getByUidAndFidAndGroup(uid, fid, fgroup).length > 0) {
            return res.send({
                status: 500,
                msg: `你已添加过该好友`,
            });;
        }
        // 正向好友 -> 添加者 to 被添加者
        await db.query(
            `insert into friends (uid, fid, ${column} )
             values ('${uid}', '${fid}', '${fgroup}')`
        );
        // 反向好友 -> 被添加者 to 添加者
        // 如果对方已经有好友,并且分组不是默认分组,就改分组
        if (getByUidAndFid(fid, uid) !== '默认' &&
            // 一条都没有的时候返回为null也会满足前面的判断
            null !== getByUidAndFid(fid, uid) &&
            undefined !== getByUidAndFid(fid, uid) &&
            0 < getByUidAndFid(fid, uid).length
        ) {
            // 改分组
            updataGroupByUidAndFid(fid, uid, fgroup)
            return res.send({
                status: 200,
                data: "修改分组成功",
            });
        }
        await db.query(
            `insert into friends (uid, fid, ${column} )
             values ('${fid}', '${uid}', '默认')`
        );
        return res.send({
            status: 200,
            data: "添加好友成功",
        });
    } catch {
        return res.send({
            status: 500,
            msg: `添加好友失败`, // ${uid},${fid},${fgroup}
        });
    }
}
