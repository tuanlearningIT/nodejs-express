
import { reject } from 'lodash';
import doctorService from '../services/doctorService';

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHome(+limit)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}
let getAllDoctor = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
let postInfoDoctors = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInfoDoctor(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
let getDetailDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getDetailDoctorById(req.query.id)
        return res.status(200).json(info)
    } catch (e) {
        reject(e)
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
let bulkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorService.bulkCreateSchedule(req.body)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
let getScheduleByDate = async (req, res) => {
    try {
        let info = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
let getExtraDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getExtraDoctorById(req.query.doctorId)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
let getProfileDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getProfileDoctorById(req.query.doctorId)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
let getListPatientForDoctor = async (req, res) => {
    try {
        let info = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
let getListDoctorForSpecialty = async (req, res) => {
    try {
        let info = await doctorService.getListDoctorForSpecialty(req.query.doctorId)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
let sendRemedy = async (req, res) => {
    try {
        let info = await doctorService.sendRemedy(req.body)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
module.exports = {
    getTopDoctorHome, getAllDoctor, postInfoDoctors, getDetailDoctorById,
    bulkCreateSchedule, getScheduleByDate, getExtraDoctorById, getProfileDoctorById,
    getListPatientForDoctor, sendRemedy, getListDoctorForSpecialty
}