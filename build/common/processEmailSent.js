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
exports.processEmailSentByDay = exports.incEmailSentByDay = exports.emailSentByDay = void 0;
exports.emailSentByDay = new Map();
// Add to emails sent map
function incEmailSentByDay(sent) {
    const day = sent.toISOString().slice(0, 10);
    exports.emailSentByDay.set(day, exports.emailSentByDay.has(day) ? exports.emailSentByDay.get(day) + 1 : 1);
}
exports.incEmailSentByDay = incEmailSentByDay;
// Process list for email sent and store in db.
function processEmailSentByDay(insertEmailSentByDay, log) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = [];
        exports.emailSentByDay.forEach((value, key) => email.push({ sent: key, total: value }));
        email.sort((a, b) => new Date(a.sent).getTime() - new Date(b.sent).getTime());
        if (log)
            log('processEmailSentByDay: ' + email.length + ' records');
        yield insertEmailSentByDay(email);
    });
}
exports.processEmailSentByDay = processEmailSentByDay;
