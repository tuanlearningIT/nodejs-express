import db from '../models/index';


let postNewHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameterssss"
                })
            } else {
                await db.HandBook.create({
                    name: data.name,
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
let getAllHandBook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.HandBook.findAll({})
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
let getDetailHandBookById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameterssss"
                })
            } else {
                let data = await db.HandBook.findOne({
                    where: { id: inputId },
                    attributes: ['name', 'descriptionHTML', 'descriptionMarkdown']
                })
                // if (data) {
                //     let doctorSpecialty = [];
                //     if (location === 'ALL') {
                //         doctorSpecialty = await db.Doctor_info.findAll({
                //             where: {
                //                 specialtyId: inputId,
                //             },

                //         })
                //     } else {
                //         doctorSpecialty = await db.Doctor_info.findAll({
                //             where: {
                //                 specialtyId: inputId,
                //                 provinceId: location
                //             },
                //             attributes: ['doctorId', 'provinceId']
                //         })
                //     }
                //     data.doctorSpecialty = doctorSpecialty
                // } else {
                //     data = {};
                // }
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
    postNewHandBook,
    getAllHandBook,
    getDetailHandBookById
}