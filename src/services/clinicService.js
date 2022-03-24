import db from '../models/index';

let postNewClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameterssss"
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: "OK"
                })
            }

        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({})
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    data
                })
            }

        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}
let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameterssss"
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: { id: inputId },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown']
                })
                if (data) {
                    let doctorClinic = [];

                    doctorClinic = await db.Doctor_info.findAll({
                        where: {
                            clinicId: inputId,

                        },
                        attributes: ['doctorId', 'provinceId']
                    })

                    data.doctorClinic = doctorClinic
                } else {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data
                })

            }

        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}
module.exports = {
    postNewClinic,
    getAllClinic,
    getDetailClinicById
}