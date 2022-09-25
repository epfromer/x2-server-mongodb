import * as mongodb from 'mongodb'
import {
  Custodian,
  custodianCollection,
  dbName,
  Email,
  emailCollection,
  EmailSentByDay,
  emailSentByDayCollection,
  getNumPSTs,
  processCustodians,
  processEmailSentByDay,
  processWordCloud,
  walkFSfolder,
  wordCloudCollection,
  WordCloudTag,
} from './common'

const processSend = (msg: string) => {
  if (!process || !process.send) {
    console.error('no process object or process.end undefined')
    return
  }
  process.send(msg)
}

async function run() {
  if (!getNumPSTs(process.argv[2])) {
    processSend(`no PSTs found in ${process.argv[2]}`)
    return
  }

  processSend(`connect to ${process.env.MONGODB_HOST}`)
  const client = await mongodb.MongoClient.connect(process.env.MONGODB_HOST!)
  const db = client.db(dbName)

  const insertEmails = async (email: Email[]): Promise<void> => {
    await db.collection(emailCollection).insertMany(email)
  }

  const insertWordCloud = async (wordCloud: WordCloudTag[]): Promise<void> => {
    await db.collection(wordCloudCollection).insertMany(wordCloud)
  }

  const insertEmailSentByDay = async (
    emailSentByDay: EmailSentByDay[]
  ): Promise<void> => {
    await db.collection(emailSentByDayCollection).insertMany(emailSentByDay)
  }

  const insertCustodians = async (Custodians: Custodian[]): Promise<void> => {
    await db.collection(custodianCollection).insertMany(Custodians)
  }

  processSend(`drop database`)
  await db.dropDatabase()

  processSend(`process emails`)
  const numEmails = await walkFSfolder(process.argv[2], insertEmails, (msg) =>
    processSend(msg)
  )

  processSend(`process word cloud`)
  await processWordCloud(insertWordCloud, (msg) => processSend(msg))

  processSend(`process email sent`)
  await processEmailSentByDay(insertEmailSentByDay, (msg) => processSend(msg))

  processSend(`create custodians`)
  await processCustodians(insertCustodians, (msg) => processSend(msg))

  processSend(`create index`)
  await db.collection(emailCollection).createIndex({ '$**': 'text' })

  processSend(`completed ${numEmails} emails in ${process.argv[2]}`)
  client.close()
}

run().catch((err) => console.error(err))
