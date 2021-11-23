import express from "express";
import cors from 'cors';
import User from "../people/userModel";
import bcrypt from "bcryptjs";

const logInApi = express.Router();

logInApi
    .post('/', async (req: express.Request, res: express.Response) => {
        try {
            const user = await User.findOne({
                where: {
                    email: req.body.email
                }
            })
            // if(user) console.log(bcrypt.compareSync(req.body.password, user.password));
            if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
                throw new Error("Usuario no existe");
            }
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(user.toJSON())
        } catch (e) {
            if (e instanceof Error) {
                res.statusCode = 400;
                res.send({ error: e.message })
            }
         }
    })
    ;

export default logInApi;