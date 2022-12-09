import db from "../db/db";
import { getMuserIdByUname } from "../user/info";
// 如果直接在语句用group会报错(因为是关键词)
// 但是在``里又不能加``来区别关键字
// 所有用变量来规避关键字
export var column = '`group`'
// 根据uid和fid查询分组信息
export async function getByUidAndFid(uid, fid, res) {
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
export async function updataGroupByUidAndFid(uid, fid, fgroup, res) {
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
export async function getByUidAndFidAndGroup(uid, fid, fgroup, res) {
    try {
        return db.query(
            `select *
            from music.friends
            where uid = '${uid}'
              and fid = '${fid}'
              and ${column} = '${fgroup}'`
        )
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
        let ogroup = await getByUidAndFid(uid, fid, res)
        if (ogroup !== fgroup &&
            // 一条都没有的时候返回为null也会满足前面的判断
            null !== ogroup &&
            undefined !== ogroup &&
            0 < ogroup.length
        ) {
            // 改分组
            await updataGroupByUidAndFid(uid, fid, fgroup, res)
            return res.send({
                status: 200,
                data: "修改分组成功",
            });
        }
        //如果已存在,分组也相同
        if (await getByUidAndFidAndGroup(uid, fid, fgroup, res).length > 0) {
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
        let group = await getByUidAndFid(fid, uid, res)
        if (group !== '默认' &&
            // 一条都没有的时候返回为null也会满足前面的判断
            null !== group &&
            undefined !== group &&
            0 < group.length
        ) {
            // 改分组
            await updataGroupByUidAndFid(fid, uid, fgroup, res)
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
