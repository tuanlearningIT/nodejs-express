

import CRUDservice from '../services/CRUDservice'
let getHomePage = async (req, res) => {
    try {
        // let data = await db.User.findAll();
        return res.render('homePage.ejs', {
            data: JSON.stringify({})
        });
    }
    catch (e) {
        console.log(e)
    }
}
let getCRUD = (req, res) => {

    return res.render('crud.ejs')
}
let postCRUD = async (req, res) => {
    let message = await CRUDservice.createNewUser(req.body)
    return res.send('post crud')
}
let dislayGetCRUD = async (req, res) => {
    let data = await CRUDservice.getAllUser();
    return res.render('dislayCRUD.ejs', {
        dataTable: data
    })
}
let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDservice.getUserInfoById(userId)
        return res.render('editCRUD.ejs', {
            user: userData
        })
    } else {
        return res.send('users not found!')
    }

}

let putEditCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDservice.upDateUserData(data)
    return res.render('dislayCRUD.ejs', {
        dataTable: allUser
    })
}
let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDservice.deleteUserById(id);
        return res.send('delete user succced!')
    }
    else {
        return res.send('delete not found')
    }


}
module.exports = {
    getHomePage, getCRUD, postCRUD, dislayGetCRUD, getEditCRUD, putEditCRUD, deleteCRUD
}