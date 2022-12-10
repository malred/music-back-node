/** 返回结果类 */
/** 正常返回 */
export function OK(data, res) {
    res.send({ status: 200, data })
    return res.end()
}
/** 错误返回 */
export function ERR(msg, res) {
    res.send({ status: 500, msg })
    return res.end()
}
export default {
    OK, ERR
}

