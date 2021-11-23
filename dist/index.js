"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./config/server"));
const SyncDatabase_1 = __importDefault(require("./config/SyncDatabase"));
SyncDatabase_1.default().then(() => {
    server_1.default.listen(server_1.default.get('port'), () => {
        console.log('Server on port ', server_1.default.get('port'));
    });
});
