require('dotenv').config();
import nodemailer from 'nodemailer';

let simpleSendEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"ABC 👻" <nvt1307@gmail.com>', // sender address
        to: dataSend.receiversEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
        // text: "Hello world?", // plain text body
        html: getBodyHTMLEmail(dataSend),
    });
}
let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhạn được email này vì đã đặt lịch khám bệnh online trên trang Abc.com</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div>Thời gian: ${dataSend.time}
        <div>Bác sĩ: ${dataSend.doctorName}</div>

        <p>Nếu thông tin trên là đúng sự thật, xin vui lòng vào đường link bên dưới để xác nhận đặt lịch khám bệnh</p>
        <div>
        <a href=${dataSend.redirectLink} target="blank" >Click here</a>
        </div>
        <div>Xin trân thành cảm ơn!</div>
        ` // html body
    };
    if (dataSend.language === 'en') {
        result = `
        <h3>Hello ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on the site Abc.com</p>
        <p>Information to schedule an appointment:</p>
        <div>Time: ${dataSend.time}
        <div>Doctor: ${dataSend.doctorName}</div>

        <p>If the above information is true, please click on the link below to confirm your appointment.</p>
        <div>
        <a href=${dataSend.redirectLink} target="blank" >Click here</a>
        </div>
        <div>Thanks so much!</div>
        `// html body
    }
    return result;
}
let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhạn được email này vì đã đặt lịch khám bệnh online trên trang Abc.com</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi theo file đính kèm.</p>

        <div>Xin trân thành cảm ơn!</div>
        ` // html body
    };
    if (dataSend.language === 'en') {
        result = `
        <h3>Hello ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on the site Abc.com</p>
        <p>Prescription/invoice information is sent in the attached file.</p>

        <div>Thanks so much!</div>
        `// html body
    }
    return result;
}
let sendAttachment = (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP, // generated ethereal user
                    pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"ABC 👻" <nvt1307@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Kết quả đặt lịch khám bệnh ✔", // Subject line
                // text: "Hello world?", // plain text body
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split('base64,')[1],
                        encoding: 'base64'
                    }
                ]
            });
            resolve(true)
        } catch (e) {
            reject(e)
        }
    })

}
module.exports = {
    simpleSendEmail, sendAttachment
}