import { SaluteHandler, SaluteRequestVariable } from '@salutejs/scenario'

const ONE_SECOND = 1000
const HALF_SECOND = 500

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
  res.setPronounceText('Начали игру')
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
  const difference = userClickPeriod - Number(timePeriod)*1000
  if (Math.abs(difference) < HALF_SECOND) {
    res.setPronounceText('Отлично! Продолжаем')
    res.appendCommand({
      type: 'SET_CLICK_DISABLE',
      flag: false
    })
  } else if (Math.abs(difference) < ONE_SECOND){
    res.setPronounceText('Почти получилось, но можно закрыть глаза. Продолжаем')
    res.appendCommand({
      type: 'SET_CLICK_DISABLE',
      flag: false
    })
  } else {
    const secDifference = Math.round(Math.abs(difference)/1000)
    if (Math.sign(difference) === -1){
      res.setPronounceText(`Не получилось, надо было нажать через ${secDifference} ${secDifference <= 1 ? 'секунду' : secDifference <= 4 ? 'секунды' : 'секунд'}`)
    } else if (Math.sign(difference) === 1){
      res.setPronounceText(`Не получилось, надо было нажать ${secDifference} ${secDifference <= 1 ? 'секунду' : secDifference <= 4 ? 'секунды' : 'секунд'} назад`)
    }
    res.appendCommand({
      type: 'SET_PLAY_MODE',
      flag: false
    })
  }
}