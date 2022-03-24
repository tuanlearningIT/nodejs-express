import userService from '../services/userService';


let handleLogin = async (req, res) => {
    let email = req.body.email;

    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errcode: 1,
            Message: 'Missing input parameter!'
        })
    }
    let userData = await userService.handleUserlogin(email, password)
    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
let handleGetAllUser = async (req, res) => {
    let id = req.query.id; //ALL, id
    let users = await userService.GetAllUsers(id)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OKKK',
        users
    })
}
let handleCrearteNewUser = async (req, res) => {
    let message = await userService.createNewuser(req.body);
    return res.status(200).json(message)
}
let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.upDateUserData(data)
    return res.status(200).json(message)
}
let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errcode: 1,
            errMessage: "Missing required parameter!"
        })
    }
    let message = await userService.deleteuser(req.body.id);
    return res.status(200).json(message)
}

let getAllCode = async (req, res) => {
    try {

        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data)

    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    handleLogin,
    handleGetAllUser,
    handleCrearteNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode
}