import specialtyService from '../services/specialtyService'

let postNewSpecialty = async (req, res) => {
    try {
        let info = await specialtyService.postNewSpecialty(req.body)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
let getAllspecialty = async (req, res) => {
    try {
        let info = await specialtyService.getAllspecialty()
        return res.status(200).json(info)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
let getDetailSpecialtyById = async (req, res) => {
    try {
        let info = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location)
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
    postNewSpecialty, getAllspecialty, getDetailSpecialtyById
}