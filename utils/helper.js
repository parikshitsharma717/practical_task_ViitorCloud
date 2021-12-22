const fs = require('fs')
const { dirname } = require('path');
const nodemailer = require('nodemailer')
const Hogan = require('hogan.js')

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

exports.sendMail = async (email, name) => {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    })
    let template = fs.readFileSync(dirname(require.main.filename)+process.env.HTML_TEMPLATE,'utf-8')
    let compiledTemplate = await Hogan.compile(template)
    let html = compiledTemplate.render({name: name})
    await transporter.sendMail({
        from: 'Tip Manager <support@tipmanager.com>',
        to: email,
        subject: `Welcome ${name}`,
        text: `Thanks for Joining us on Tip Manager App`,
        html: html
    })
}