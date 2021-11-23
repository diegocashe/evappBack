import express from "express";
import cors from 'cors';
import User from "./userModel";
import bcrypt from "bcryptjs";
import Teacher from "./teacherModel";
import Student from "./studentModel";

const profileApi = express.Router();

const setUserType = async (userType: number, data: { userId: string }) => {
    if (userType == 0) return (await Teacher.create(data));
    if (userType == 1) return (await Student.create(data));
    throw new Error("Dont exist that user type");
}

profileApi
    .put('/', async (req: express.Request, res: express.Response) => {
        try {

            // console.log(req.body);

            const user = await User.findOne({ where: { id: req.body.id } })

            if(user){
                await user.update(req.body);
                await user.save();
            }
            
            // console.log(user?.toJSON());
            res.statusCode = 200;
            res.json(user?.toJSON())
 
        } catch (e) {
            if (e instanceof Error) {
                res.statusCode = 400;
                res.send({ error: e.message })
            }
        }
    })
    ;

export default profileApi;