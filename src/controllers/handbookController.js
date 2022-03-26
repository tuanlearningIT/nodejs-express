import handbookService from '../services/handbookService'

let postNewHandBook = async (req, res) => {
    try {
        let info = await handbookService.postNewHandBook(req.body)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
let getAllHandBook = async (req, res) => {
    try {
        let info = await handbookService.getAllHandBook()
        return res.status(200).json(info)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}
let getDetailHandBookById = async (req, res) => {
    try {
        let info = await handbookService.getDetailHandBookById(req.query.id)
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
    postNewHandBook,
    getAllHandBook,
    getDetailHandBookById
}