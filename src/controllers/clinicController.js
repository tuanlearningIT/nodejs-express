import clinicService from '../services/clinicService'


let postNewClinic = async (req, res) => {
    try {
        let info = await clinicService.postNewClinic(req.body)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
let getAllClinic = async (req, res) => {
    try {
        let info = await clinicService.getAllClinic()
        return res.status(200).json(info)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
let getDetailClinicById = async (req, res) => {
    try {
        let info = await clinicService.getDetailClinicById(req.query.id)
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
    postNewClinic,
    getAllClinic,
    getDetailClinicById
}