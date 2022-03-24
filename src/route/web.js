import express from "express";
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';
import patientController from '../controllers/patientController';
import specialtyController from '../controllers/specialtyController';
import clinicController from '../controllers/clinicController';
let router = express.Router();
let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCRUD);

    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.dislayGetCRUD)
    router.get('/edit-crud', homeController.getEditCRUD)
    router.post('/put-crud', homeController.putEditCRUD)
    router.get('/delete-crud', homeController.deleteCRUD)

    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-user', userController.handleGetAllUser)
    router.post('/api/create-new-user', userController.handleCrearteNewUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.get('/allcode', userController.getAllCode)

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctors', doctorController.getAllDoctor)
    router.post('/api/save-info-doctors', doctorController.postInfoDoctors)
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate)
    router.get('/api/get-extra-info-doctor-by-id', doctorController.getExtraDoctorById)
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)

    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)
    router.get('/api/get-list-doctor-for-specialty', doctorController.getListDoctorForSpecialty)
    router.post('/api/send-remedy', doctorController.sendRemedy)

    router.post('/api/patient-book-appointment', patientController.patientBookAppointment)
    router.post('/api/verify-book-appointment', patientController.patientVerifyBookAppointment)

    router.post('/api/create-new-specialty', specialtyController.postNewSpecialty)
    router.get('/api/get-specialty', specialtyController.getAllspecialty)
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)

    router.post('/api/create-new-clinic', clinicController.postNewClinic)
    router.get('/api/get-clinic', clinicController.getAllClinic)
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)

    return app.use('/', router);
}


module.exports = initWebRoutes;