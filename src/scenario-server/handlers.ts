import { SaluteHandler, SaluteRequestVariable } from '@salutejs/scenario'

const ERROR_TIME = 1000
const WARNING_TIME = 600

const digits = [
  'одну',
  'две'
]
const getRandomArrayItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

export const runAppHandler: SaluteHandler = ({ req, res, session }) => {
  session.globalScore = 0
  res.setPronounceText('Привет, я помогу тебе начать лучше чувствовать время')
  res.appendBubble('Привет, я помогу тебе начать лучше чувствовать время')
}

export const noMatchHandler: SaluteHandler = ({ req, res }) => {
  res.setPronounceText('Не совсем понимаю сказанное')
  res.appendBubble('Не совсем понимаю сказанное')
}

export const startGameHandler: SaluteHandler = ({ req, res, session }) => {
  const { timestamp, timePeriod } = req.variables
  session.timestampStart = timestamp
  session.timePeriod = timePeriod
  session.countScore = 0
  const pronounces = ['Начали игру', 'Поехали', 'Начнем', 'Время пошло\'']
  res.setPronounceText(getRandomArrayItem(pronounces))
}

export const startNewClickHandler: SaluteHandler = ({ req, res, session }) => {
  const { timestamp } = req.variables
  session.timestampStart = timestamp
}

export const clickHandler: SaluteHandler = ({ req, res, session }) => {
  const { timestamp } = req.variables
  const { timestampStart, timePeriod, globalScore, countScore } = session
  console.log('countScore', countScore)
  const errorTime = ERROR_TIME + Number(timePeriod)*20
  const warningTime = WARNING_TIME + Number(timePeriod)*20
  const userClickPeriod = Number(timestamp) - Number(timestampStart)
  const difference = userClickPeriod - Number(timePeriod) * 1000
  if (Math.abs(difference) < warningTime) {
    const pronounces = ['<speak>Отлично! Продолжаем</speak>', '<speak>Совершенно верно!</speak>', '<speak>Отлично! Дальше</speak>', '<speak>Молоде\'ц, дальше</speak>', '<speak>Молоде\'ц, продолжаем</speak>']
    res.setPronounceText(getRandomArrayItem(pronounces), {ssml: true})
    res.setEmotion('udovolstvie')
    res.appendCommand({
      type: 'SET_CLICK_DISABLE',
      flag: false
    })
    session.countScore = Number(countScore) + 1
  } else if (Math.abs(difference) < errorTime) {
    const pronounces = ['Почти получилось, но можно закрыть глаза. Продолжаем', 'Чуть-чуть ошибся, но сделаем вид что так и должно быть', 'Буквально на полсекундочки ошибся, ну ничего']
    res.setPronounceText(getRandomArrayItem(pronounces))
    res.appendCommand({
      type: 'SET_CLICK_DISABLE',
      flag: false
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
    if (Number(globalScore) < Number(countScore)) session.globalScore = countScore
    res.appendCommand({
      type: 'SET_PLAY_MODE',
      flag: false
    })
    res.appendCommand({
      type: 'CHANGE_SCORE',
      score: Number(countScore)
    })
  }
}