import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_CLIENT ?? '')
let scheduleDB: any
let homeTasksDB: any
let isMongoConnected = false
export const start = async () => {
  try {
    await client.connect()
    isMongoConnected = true
    console.log('MongoDB connected')
    scheduleDB = client.db().collection('schedule')
    homeTasksDB = client.db().collection('homeTasks')
  } catch (err) {
    console.log(err)
  }
}

// export const getSchedule = async (userId: string): Promise<ScheduleType> => {
//   try {
//     if (!isMongoConnected){
//       await client.connect()
//       scheduleDB = client.db().collection('schedule')
//     }
//     const user = await scheduleDB.findOne({ userId })
//     if (user) {
//       return user.schedule
//     } else {
//       return emptySchedule
//     }
//   } catch (err) {
//     console.log('mongoDB error: ', err)
//     return emptySchedule
//   }
// }

// export const changeSchedule = async (userId: string, newSchedule: ScheduleType): Promise<ScheduleType> => {
//   try {
//     if (!isMongoConnected){
//       await client.connect()
//       scheduleDB = client.db().collection('schedule')
//     }
//     const user = await scheduleDB.findOne({ userId })
//     if (user) {
//       await scheduleDB.updateOne({ userId }, {
//         $set: { userId, schedule: newSchedule }
//       })
//     } else {
//       scheduleDB.insertOne({ userId, schedule: newSchedule })
//     }
//     return newSchedule
//   } catch (err) {
//     console.log('mongoDB error: ', err)
//     return emptySchedule
//   }
// }