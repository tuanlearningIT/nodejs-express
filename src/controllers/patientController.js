import patientService from '../services/patientService';

let patientBookAppointment = async (req, res) => {
    try {
        let info = await patientService.patientBookAppointment(req.body)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}

let patientVerifyBookAppointment = async (req, res) => {
    try {
        let info = await patientService.patientVerifyBookAppointment(req.body)
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
    patientBookAppointment,
    patientVerifyBookAppointment
}