const fs = require('fs')
const { dirname } = require('path');

exports.isBase64 = (str) => {
    if (Buffer.from(str, 'base64').toString('base64') == str) {
        return true
    }
    return false
}

exports.convertImageToBinary = async (str, userId) => {
    let buff = Buffer.from(str, 'base64')
    try {
        const pub_dir = process.env.PUBLIC_DIR || "\\public\\user\\"
        const dir = dirname(require.main.filename) + pub_dir + userId + ".jpg"
        await fs.writeFileSync(dir, buff)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

exports.calculateTip = (total, percent) => {
    return (total * percent) / 100
}

exports.formatDate = (date) => {
    let arr = date.split('-')
    date = arr[2] + "-" + arr[1] + "-" + arr[0]
    return date
}