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
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCustodians = exports.incReceiverTotal = exports.incSenderTotal = exports.addCustodiansInteraction = void 0;
const custodians_1 = require("./custodians");
// Fast map of from/to: #
const custodialInteractions = new Map();
function addCustodiansInteraction(fromCustodian, toCustodians) {
    // console.log(fromCustodian, toCustodians)
    toCustodians.forEach((toCustodian) => {
        const key = fromCustodian + '/' + toCustodian;
        custodialInteractions.set(key, custodialInteractions.has(key) ? custodialInteractions.get(key) + 1 : 1);
    });
}
exports.addCustodiansInteraction = addCustodiansInteraction;
// add to totals for Custodians
function incSenderTotal(fromCustodian) {
    const custodian = custodians_1.custodians.find((c) => c.id === fromCustodian);
    if (custodian)
        custodian.senderTotal++;
}
exports.incSenderTotal = incSenderTotal;
function incReceiverTotal(toCustodian) {
    const custodian = custodians_1.custodians.find((c) => c.id === toCustodian);
    if (custodian)
        custodian.receiverTotal++;
}
exports.incReceiverTotal = incReceiverTotal;
// Process list for Custodians and store in db.
function processCustodians(insertCustodians, log) {
    return __awaiter(this, void 0, void 0, function* () {
        if (log)
            log('processCustodians: ' + custodians_1.custodians.length + ' Custodians');
        // console.log(custodialInteractions)
        // split apart fast map into individual custodians
        custodialInteractions.forEach((value, key) => {
            const peeps = key.split('/');
            const custodian = custodians_1.custodians.find((c) => c.id === peeps[0]);
            if (custodian) {
                custodian.toCustodians.push({ custodianId: peeps[1], total: value });
            }
        });
        yield insertCustodians(custodians_1.custodians);
    });
}
exports.processCustodians = processCustodians;
