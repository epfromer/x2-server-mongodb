"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = __importStar(require("mongodb"));
const common_1 = require("./common");
const processSend = (msg) => {
    if (!process || !process.send) {
        console.error('no process object or process.end undefined');
        return;
    }
    process.send(msg);
};
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.MONGODB_HOST) {
            throw 'MONGODB_HOST undefined';
        }
        if (!(0, common_1.getNumPSTs)(process.argv[2])) {
            processSend(`no PSTs found in ${process.argv[2]}`);
            return;
        }
        processSend(`connect to ${process.env.MONGODB_HOST}`);
        const client = yield mongodb.MongoClient.connect(process.env.MONGODB_HOST);
        const db = client.db(common_1.dbName);
        const insertEmails = (email) => __awaiter(this, void 0, void 0, function* () {
            yield db.collection(common_1.emailCollection).insertMany(email);
        });
        const insertWordCloud = (wordCloud) => __awaiter(this, void 0, void 0, function* () {
            yield db.collection(common_1.wordCloudCollection).insertMany(wordCloud);
        });
        const insertEmailSentByDay = (emailSentByDay) => __awaiter(this, void 0, void 0, function* () {
            yield db.collection(common_1.emailSentByDayCollection).insertMany(emailSentByDay);
        });
        const insertCustodians = (Custodians) => __awaiter(this, void 0, void 0, function* () {
            yield db.collection(common_1.custodianCollection).insertMany(Custodians);
        });
        processSend(`drop database`);
        yield db.dropDatabase();
        processSend(`process emails`);
        const numEmails = yield (0, common_1.walkFSfolder)(process.argv[2], insertEmails, (msg) => processSend(msg));
        processSend(`process word cloud`);
        yield (0, common_1.processWordCloud)(insertWordCloud, (msg) => processSend(msg));
        processSend(`process email sent`);
        yield (0, common_1.processEmailSentByDay)(insertEmailSentByDay, (msg) => processSend(msg));
        processSend(`create custodians`);
        yield (0, common_1.processCustodians)(insertCustodians, (msg) => processSend(msg));
        processSend(`create index`);
        yield db.collection(common_1.emailCollection).createIndex({ '$**': 'text' });
        processSend(`completed ${numEmails} emails in ${process.argv[2]}`);
        client.close();
    });
}
run().catch((err) => console.error(err));
