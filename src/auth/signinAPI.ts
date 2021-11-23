import express from "express";
import cors from 'cors';
import User from "../people/userModel";
import bcrypt from "bcryptjs";
import Teacher from "../people/teacherModel";
import Student from "../people/studentModel";

const singInApi = express.Router();

const setUserType = async (userType: number, data: { userId: string }) => {
    if (userType == 0) return (await Teacher.create(data));
    if (userType == 1) return (await Student.create(data));
    throw new Error("Dont exist that user type");
}

singInApi
    .post('/', async (req: express.Request, res: express.Response) => {
        try {
            const { firstName, lastName, email, password, userType } = req.body;
            if (!firstName || !lastName || !email || !password) throw new Error('Faltan datos importantes');
            if (isNaN(userType) || userType === undefined) throw new Error('No selecciono su tipo de usuario')

            console.log(req.body);

            const user = await User.create({
                ...req.body,
                state: true,
                lastAccess: new Date(),
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
            })

            const type = await setUserType(user.userType, { userId: user.id })
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json({
                user: { ...user.toJSON() },
                type: { ...type.toJSON() },


                message: 'Usuario registrado exitosamente'
            })
        } catch (e) {
            if (e instanceof Error) {
                res.statusCode = 400;
                res.send({ error: e.message })
            }
        }
    })
    ;

export default singInApi;