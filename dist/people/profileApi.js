"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userModel_1 = __importDefault(require("./userModel"));
const teacherModel_1 = __importDefault(require("./teacherModel"));
const studentModel_1 = __importDefault(require("./studentModel"));
const profileApi = express_1.default.Router();
const setUserType = (userType, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (userType == 0)
        return (yield teacherModel_1.default.create(data));
    if (userType == 1)
        return (yield studentModel_1.default.create(data));
    throw new Error("Dont exist that user type");
});
profileApi
    .put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body);
        const user = yield userModel_1.default.findOne({ where: { id: req.body.id } });
        if (user) {
            yield user.update(req.body);
            yield user.save();
        }
        // console.log(user?.toJSON());
        res.statusCode = 200;
        res.json(user === null || user === void 0 ? void 0 : user.toJSON());
    }
    catch (e) {
        if (e instanceof Error) {
            res.statusCode = 400;
            res.send({ error: e.message });
        }
    }
}));
exports.default = profileApi;
