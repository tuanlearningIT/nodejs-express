
import _ from 'lodash';
import db from '../models/index';
require('dotenv').config();
import emailService from './emailService'
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEN', 'valueVI'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEN', 'valueVI'] }
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            console.log(e)
        }
    })
}
let checkRequiredFields = (inputData) => {
    let arr = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'selectedPrice', 'selectedPayment', 'selectedProvince', 'nameClinic', 'addressClinic', 'note', 'specialtyId', 'clinicId']

    let isValid = true;
    let element = '';
    for (let i = 0; i < arr.length; i++) {
        if (!inputData[arr[i]]) {
            isValid = false;
            element = arr[i];
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}
let saveDetailInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData);
            if (checkObj.isValid === false) {

                resolve({
                    errCode: 1,
                    errMesage: `Missing parameters: ${checkObj.element}`
                })
            } else {
                //upsert to Markdown
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        description: inputData.description,
                        contentMarkdown: inputData.contentMarkdown,
                        doctorId: inputData.doctorId,
                        specialtyId: inputData.specialtyId
                    })
                } else if (inputData.action === 'EDIT') {
                    let MarkdownDoctor = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (MarkdownDoctor) {
                        MarkdownDoctor.contentHTML = inputData.contentHTML;
                        MarkdownDoctor.description = inputData.description;
                        MarkdownDoctor.contentMarkdown = inputData.contentMarkdown;
                        MarkdownDoctor.specialtyId = inputData.specialtyId;
                        MarkdownDoctor.createdAt = new Date()
                        await MarkdownDoctor.save()
                    }

                }
                //upsert to Doctor_infor table
                let doctorInfo = await db.Doctor_info.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false
                })
                if (doctorInfo) {
                    //update
                    doctorInfo.doctorId = inputData.doctorId;
                    doctorInfo.priceId = inputData.selectedPrice;
                    doctorInfo.paymentId = inputData.selectedPayment;
                    doctorInfo.provinceId = inputData.selectedProvince;
                    doctorInfo.addressClinic = inputData.addressClinic;
                    doctorInfo.nameClinic = inputData.nameClinic;
                    doctorInfo.note = inputData.note;
                    doctorInfo.specialtyId = inputData.specialtyId;
                    doctorInfo.clinicId = inputData.clinicId;
                    await doctorInfo.save()
                } else {
                    //create 
                    await db.Doctor_info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        addressClinic: inputData.addressClinic,

                        nameClinic: inputData.nameClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
                    })
                }
                resolve({
                    errCode: 0,
                    errMesage: 'Save info doctor success'
                })

            }

        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}
let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMesage: "Missing parameters"
                })
            }
            else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentMarkdown', 'contentHTML']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEN', 'valueVI'] },
                        {
                            model: db.Doctor_info,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEN', 'valueVI'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEN', 'valueVI'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEN', 'valueVI'] }
                            ]
                        },

                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary')

                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMesage: "Missing required parameters"
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item
                    })
                }
                // get all existing date
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: '' + data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                });
                console.log('check time type', existing)
                // convert date
                // if (existing && existing.length > 0) {
                //     existing = existing.map(item => {
                //         item.date = new Date(item.date).getTime()
                //         return item;
                //     })

                // }
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date
                })
                // create data 
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }
                resolve({
                    errCode: 0,
                    errMesage: 'OKK'
                })
            }


        } catch (e) {
            reject(e)
        }
    })

}
let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMesage: "Missing required parameters"
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    }, include: [

                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEN', 'valueVI'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },


                    ],
                    raw: false,
                    nest: true
                })
                if (!dataSchedule) dataSchedule = [];
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getExtraDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMesage: "Missing parameters"
                })
            }
            else {
                let data = await db.Doctor_info.findOne({
                    where: { doctorId: inputId },
                    attributes: {
                        exclude: ['id', 'doctorId'],
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEN', 'valueVI'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEN', 'valueVI'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEN', 'valueVI'] }
                    ],

                    raw: false,
                    nest: true
                })
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}
let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMesage: "Missing parameters"
                })
            }
            else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentMarkdown', 'contentHTML']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEN', 'valueVI'] },
                        {
                            model: db.Doctor_info,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEN', 'valueVI'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEN', 'valueVI'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEN', 'valueVI'] }
                            ]
                        },

                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary')

                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}
let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMesage: "Missing parameters"
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender',],
                            include: [
                                {
                                    model: db.Allcode, as: 'genderData', attributes: ['valueEN', 'valueVI']
                                }
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEN', 'valueVI']
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    errMesage: 'OK',
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getListDoctorForSpecialty = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData) {
                resolve({
                    errCode: 1,
                    errMesage: "Missing parameters"
                })
            }
            else {
                let data = await db.Doctor_info.findOne({
                    where: { doctorId: inputData },
                    attributes: {
                        include: ['doctorId', 'id']
                    },
                    include: [

                        { model: db.Specialty, as: 'nameData', attributes: ['name'] },

                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}
let checkRequired = (inputData) => {
    let arr = ['doctorId', 'email', 'patientId', 'timeType', 'imgBase64']

    let isValid = true;
    let element = '';
    for (let i = 0; i < arr.length; i++) {
        if (!inputData[arr[i]]) {
            isValid = false;
            element = arr[i];
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}
let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequired(data);
            if (checkObj.isValid === false) {

                resolve({
                    errCode: 1,
                    errMesage: `Missing parameters: ${checkObj.element}`
                })
            } else {
                //update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        statusId: 'S2',
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType

                    },
                    raw: false,

                })
                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save()
                }
                // send email remedy
                await emailService.sendAttachment(data)
                resolve({
                    errCode: 0,
                    errMesage: 'OK',
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    getTopDoctorHome, getAllDoctors, saveDetailInfoDoctor, getDetailDoctorById,
    bulkCreateSchedule, getScheduleByDate, getExtraDoctorById, getProfileDoctorById,
    getListPatientForDoctor, sendRemedy, getListDoctorForSpecialty
}