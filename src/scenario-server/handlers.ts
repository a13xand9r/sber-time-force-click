import { SaluteHandler, SaluteRequestVariable } from '@salutejs/scenario'

const ONE_SECOND = 1000
const HALF_SECOND = 500

const digits = [
  'одну',
  'две'
]
const getRandomArrayItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

export const runAppHandler: SaluteHandler = ({ req, res, session }) => {
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
  const pronounces = ['Начали игру', 'Поехали', 'Начнем', 'Время пошло']
  res.setPronounceText(getRandomArrayItem(pronounces))
  res.appendCommand({
    type: 'CHANGE_PLAY_TAB_TEXT',
    text: `Игра началась! Нажмите на кнопку по истечении ${timePeriod} секунд`
  })
}

export const startNewClickHandler: SaluteHandler = ({ req, res, session }) => {
  const { timestamp } = req.variables
  session.timestampStart = timestamp
}

export const clickHandler: SaluteHandler = ({ req, res, session }) => {
  const { timestamp } = req.variables
  const { timestampStart, timePeriod } = session
  const userClickPeriod = Number(timestamp) - Number(timestampStart)
  const difference = userClickPeriod - Number(timePeriod) * 1000
  if (Math.abs(difference) < HALF_SECOND) {
    const pronounces = ['Отлично! Продолжаем', 'Совершенно верно!', 'Отлично! Дальше', 'Молодец, дальше', 'Молодец, продолжаем']
    res.setPronounceText(getRandomArrayItem(pronounces))
    res.appendCommand({
      type: 'SET_CLICK_DISABLE',
      flag: false
    })
    res.setEmotion('udovolstvie')
  } else if (Math.abs(difference) < ONE_SECOND) {
    const pronounces = ['Почти получилось, но можно закрыть глаза. Продолжаем', 'Чуть-чуть ошибся, но сделаем вид что так и должно быть', 'Буквально на полсекундочки ошибся, ну ничего']
    res.setPronounceText(getRandomArrayItem(pronounces))
    res.appendCommand({
      type: 'SET_CLICK_DISABLE',
      flag: false
    })
  } else {
    const secDifference = Math.round(Math.abs(difference) / 1000)
    if (Math.sign(difference) === -1) {
      const pronounces = [
        `Не получилось, надо было нажать через ${secDifference <= 2 ? digits[secDifference - 1] : secDifference}
      ${secDifference <= 1 ? 'секунду' : secDifference <= 4 ? 'секунды' : 'секунд'}`,
        `Ошбика, на ${secDifference <= 2 ? digits[secDifference - 1] : secDifference}
      ${secDifference <= 1 ? 'секунду' : secDifference <= 4 ? 'секунды' : 'секунд'} раньше`
      ]
      res.setPronounceText(getRandomArrayItem(pronounces))
    } else if (Math.sign(difference) === 1) {
      const pronounces = [
        `Не получилось, надо было нажать ${secDifference <= 2 ? digits[secDifference - 1] : secDifference}
      ${secDifference <= 1 ? 'секунду' : secDifference <= 4 ? 'секунды' : 'секунд'} назад`,
        `Ошбика, на ${secDifference <= 2 ? digits[secDifference - 1] : secDifference}
      ${secDifference <= 1 ? 'секунду' : secDifference <= 4 ? 'секунды' : 'секунд'} позже`
      ]
      res.setPronounceText(getRandomArrayItem(pronounces))
      res.setEmotion('nesoglasie')
    }
    res.appendCommand({
      type: 'SET_PLAY_MODE',
      flag: false
    })
  }
}