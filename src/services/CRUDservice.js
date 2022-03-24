
import bcrypt from 'bcryptjs';

import db from '../models/index';
var salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFormBcrypt = await hashUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashPasswordFormBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender,
                roleId: data.roleId,
            })
            resolve('ok create new user succeed!');
        }
        catch (e) {
            reject(e);
        }
    })

}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        }
        catch (e) {
            reject(e);
        }

    })

}
let getAllUser = () => {
    return new Promise((resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })


}
let getUserInfoById = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            let user = db.User.findOne({
                where: { id: userId }
            })
            if (user) {
                resolve(user)
            } else {
                resolve([])
            }
        } catch (e) {
            reject(e);
        }
    })
}
let upDateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address

                await user.save();
                let allUser = db.User.findAll();
                resolve(allUser);
            } else {
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    })
}
let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (user) {
                await user.destroy();
            }
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createNewUser,
    hashUserPassword,
    getAllUser,
    getUserInfoById,
    upDateUserData,
    deleteUserById

}
