import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_CLIENT ?? '')
let scoreDB: any
let isMongoConnected = false
export const start = async () => {
  console.log('MongoDB trying connect')
  try {
    await client.connect()
    isMongoConnected = true
    console.log('MongoDB connected')
    scoreDB = client.db().collection('score')
  } catch (err) {
    console.log(err)
  }
}

export const getScore = async (userId: string): Promise<number> => {
  try {
    if (!isMongoConnected){
      await client.connect()
      scoreDB = client.db().collection('score')
    }
    // console.log(scoreDB)
    const user = await scoreDB.findOne({ userId })
    return user.score
  } catch (err) {
    console.log('mongoDB get score error: ', err)
    return 0
  }
}

export const changeScore = async (userId: string, newScore: number) => {
  try {
    if (!isMongoConnected){
      await client.connect()
      scoreDB = client.db().collection('score')
    }
    const user = await scoreDB.findOne({ userId })
    if (user) {
      await scoreDB.updateOne({ userId }, {
        $set: { userId, score: newScore }
      })
    } else {
      scoreDB.insertOne({ userId, score: newScore })
    }
  } catch (err) {
    console.log('mongoDB error: ', err)
  }
}