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
exports.root = void 0;
const common_1 = require("./common");
const mongodb = __importStar(require("mongodb"));
const getEmail_1 = require("./getEmail");
const importPST_1 = require("./importPST");
const searchHistory_1 = require("./searchHistory");
const getWordCloud = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.MONGODB_HOST) {
        throw 'MONGODB_HOST undefined';
    }
    const client = yield mongodb.MongoClient.connect(process.env.MONGODB_HOST);
    const db = client.db(common_1.dbName);
    const wordCloud = yield db.collection(common_1.wordCloudCollection).find().toArray();
    return wordCloud.map((word) => ({ tag: word.tag, weight: word.weight }));
});
const getEmailSentByDay = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.MONGODB_HOST) {
        throw 'MONGODB_HOST undefined';
    }
    const client = yield mongodb.MongoClient.connect(process.env.MONGODB_HOST);
    const db = client.db(common_1.dbName);
    const emailSentByDay = yield db
        .collection(common_1.emailSentByDayCollection)
        .find()
        .sort({ sent: 1 })
        .toArray();
    return emailSentByDay.map((day) => ({ sent: day.sent, total: day.total }));
});
const getCustodians = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.MONGODB_HOST) {
        throw 'MONGODB_HOST undefined';
    }
    const client = yield mongodb.MongoClient.connect(process.env.MONGODB_HOST);
    const db = client.db(common_1.dbName);
    const custodians = yield db.collection(common_1.custodianCollection).find().toArray();
    return custodians.map((custodian) => ({
        id: custodian.id,
        name: custodian.name,
        aliases: [],
        title: custodian.title,
        color: custodian.color,
        senderTotal: custodian.senderTotal,
        receiverTotal: custodian.receiverTotal,
        toCustodians: custodian.toCustodians,
    }));
});
const setCustodianColor = (httpQuery) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.MONGODB_HOST) {
        throw 'MONGODB_HOST undefined';
    }
    const client = yield mongodb.MongoClient.connect(process.env.MONGODB_HOST);
    const db = client.db(common_1.dbName);
    yield db
        .collection(common_1.custodianCollection)
        .findOneAndUpdate({ id: httpQuery.id }, { $set: { color: httpQuery.color } });
    const custodians = yield db.collection(common_1.custodianCollection).find().toArray();
    return custodians.map((custodian) => ({
        id: custodian.id,
        name: custodian.name,
        aliases: [],
        title: custodian.title,
        color: custodian.color,
        senderTotal: custodian.senderTotal,
        receiverTotal: custodian.receiverTotal,
        toCustodians: custodian.toCustodians,
    }));
});
exports.root = {
    clearSearchHistory: () => (0, searchHistory_1.clearSearchHistory)(),
    getCustodians: () => getCustodians(),
    getEmail: (httpQuery) => (0, getEmail_1.getEmail)(httpQuery),
    getEmailSentByDay: () => getEmailSentByDay(),
    getImportStatus: () => (0, importPST_1.getImportStatus)(),
    getSearchHistory: () => (0, searchHistory_1.getSearchHistory)(),
    getWordCloud: () => getWordCloud(),
    importPST: (httpQuery) => (0, importPST_1.importPST)(httpQuery),
    setCustodianColor: (httpQuery) => setCustodianColor(httpQuery),
};
exports.default = exports.root;
