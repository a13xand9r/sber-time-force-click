import { SaluteHandler, SaluteRequestVariable } from '@salutejs/scenario'
import { changeScore, getScore, start } from './dataBase'

const ERROR_TIME = 1000
const WARNING_TIME = 600

const digits = [
  'одну',
  'две'
]
const getRandomArrayItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

export const runAppHandler: SaluteHandler = ({ req, res }) => {
  start()
  res.setPronounceText(`${req.request.payload.character.appeal === 'official' ? 'Здравствуйте, я помогу вам' : 'Привет, я помогу тебе'} начать лучше чувствовать время.`)
  res.appendBubble(`Привет, я помогу тебе начать лучше чувствовать время.`)
}

export const getScoreHandler: SaluteHandler = async ({ req, res, session }) => {
  const score = await getScore(req.request.uuid.sub)
  session.globalScore = score
  res.appendCommand({
    type: 'CHANGE_SCORE',
    score
  })
}

export const noMatchHandler: SaluteHandler = ({ req, res }) => {
  res.setPronounceText('Не совсем понимаю сказанное')
  res.appendBubble('Не совсем понимаю сказанное')
}

export const startGameHandler: SaluteHandler = ({ req, res, session }) => {
  const { timestamp, timePeriod } = req.variables
  // session.timestampStart = timestamp
  session.timePeriod = timePeriod
  session.countScore = 0
  const pronounces = ['Начали', 'Поехали', 'Начнем', 'Время пошло\'']
  // const pronounces = ['<speak><audio text="sm-sounds-game-8-bit-coin-1"/></speak>']
  res.setPronounceText(getRandomArrayItem(pronounces), {ssml: true})
  res.appendCommand({type: 'START_GAME'})
}

export const startNewClickHandler: SaluteHandler = ({ req, res, session }) => {
  const { timestamp } = req.variables
  session.timestampStart = timestamp
}

export const getStartSoundHandler: SaluteHandler = ({ req, res, session }) => {
  res.setPronounceText('<speak><audio text="sm-sounds-game-ping-1"/></speak>', {ssml: true})
  res.appendCommand({
    type: 'SET_CLICK_DISABLE',
    flag: false
  })
}

export const clickHandler: SaluteHandler = ({ req, res, session }) => {
  const { timestamp } = req.variables
  const { timestampStart, timePeriod, globalScore, countScore } = session
  const errorTime = ERROR_TIME + Number(timePeriod)*20
  const warningTime = WARNING_TIME + Number(timePeriod)*20
  const userClickPeriod = Number(timestamp) - Number(timestampStart)
  const difference = userClickPeriod - Number(timePeriod) * 1000
  if (Math.abs(difference) < warningTime) {
    const pronounces = ['<speak>Отлично!</speak>', '<speak>Совершенно верно!</speak>', '<speak>Молоде\'ц! дальше</speak>']
    const phrase = getRandomArrayItem(pronounces)
    res.setPronounceText(phrase, {ssml: true})
    res.setEmotion('udovolstvie')
    // res.appendCommand({
    //   type: 'CHANGE_PLAY_TAB_TEXT',
    //   text: phrase
    // })
    res.appendCommand({
      type: 'START_GAME',
    })
    session.countScore = Number(countScore) + 1
  } else if (Math.abs(difference) < errorTime) {
    const pronounces = ['Почти получилось, но можно закрыть глаза. Продолжаем', 'Небольшая ошибка, но сделаем вид что так и должно быть', 'Буквально на полсекундочки ошибся, ну ничего']
    const phrase = getRandomArrayItem(pronounces)
    res.setPronounceText(phrase)
    // res.appendCommand({
    //   type: 'CHANGE_PLAY_TAB_TEXT',
    //   text: phrase
    // })
    res.appendCommand({
      type: 'START_GAME',
    })
    session.countScore = Number(countScore) + 1
  } else {
    const secDifference = Math.round(Math.abs(difference) / 1000)
    if (Math.sign(difference) === -1) {
      const pronounces = [
        `Не получилось, надо было нажать через ${secDifference <= 2 ? digits[secDifference - 1] : secDifference}
      ${secDifference <= 1 ? 'секунду' : secDifference <= 4 ? 'секунды' : 'секунд'}`,
        `Ошибка, на ${secDifference <= 2 ? digits[secDifference - 1] : secDifference}
      ${secDifference <= 1 ? 'секунду' : secDifference <= 4 ? 'секунды' : 'секунд'} раньше`
      ]
      res.setPronounceText(getRandomArrayItem(pronounces))
    } else if (Math.sign(difference) === 1) {
      const pronounces = [
        `Не получилось, надо было нажать ${secDifference <= 2 ? digits[secDifference - 1] : secDifference}
      ${secDifference <= 1 ? 'секунду' : secDifference <= 4 ? 'секунды' : 'секунд'} назад`,
        `Ошибка, на ${secDifference <= 2 ? digits[secDifference - 1] : secDifference}
      ${secDifference <= 1 ? 'секунду' : secDifference <= 4 ? 'секунды' : 'секунд'} позже`
      ]
      res.setPronounceText(getRandomArrayItem(pronounces))
      res.setEmotion('nesoglasie')
    }
    if (Number(globalScore) < Number(countScore)){
      session.globalScore = countScore
      res.appendCommand({
        type: 'CHANGE_SCORE',
        score: Number(countScore)
      })
      changeScore(req.request.uuid.sub, Number(countScore))
    }
    res.appendCommand({
      type: 'SET_PLAY_MODE',
      flag: false
    })
  }
}