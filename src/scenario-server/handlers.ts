import { SaluteHandler, SaluteRequestVariable } from '@salutejs/scenario'
import { changeScore, getScore, start } from './dataBase'

const ERROR_TIME = 1000
const WARNING_TIME = 600

const digits = [
  'одну',
  'две'
]
const getRandomArrayItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]
const clearText = (str: string) => str.split('').filter(l => l !== '`' && l !== '\\').join('')

export const runAppHandler: SaluteHandler = ({ req, res }) => {
  start()
  res.setPronounceText(`${req.request.payload.character.appeal === 'official' ? 'Здравствуйте, я помогу вам' : 'Привет, я помогу тебе'} начать лучше чувствовать время.`)
  res.appendBubble(`${req.request.payload.character.appeal === 'official' ? 'Здравствуйте, я помогу вам' : 'Привет, я помогу тебе'} начать лучше чувствовать время.`)
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

export const startGameHandler: SaluteHandler = async ({ req, res, session }, dispatch) => {
  const { timePeriod } = req.variables
  session.timePeriod = timePeriod
  session.countScore = 0
  session.isGameStart = true
  const pronounces = ['Начали', 'Поехали', 'Начнем', 'Время пошло\'']
  // const pronounces = ['<speak><audio text="sm-sounds-game-8-bit-coin-1"/></speak>']
  await res.setPronounceText(getRandomArrayItem(pronounces), { ssml: true })
  // res.appendCommand({type: 'START_GAME'})
  if (dispatch) {
    dispatch(['getStartSound'])
    console.log('dispatch')
  }
}

export const startNewClickHandler: SaluteHandler = ({ req, res, session }) => {
  const { timestamp } = req.variables
  session.timestampStart = timestamp
}

export const getStartSoundHandler: SaluteHandler = ({ req, res, session }) => {
  const { isGameStart } = session
  res.setPronounceText('<speak><audio text="sm-sounds-game-ping-1"/></speak>', { ssml: true })
  res.appendCommand({
    type: 'SET_CLICK_DISABLE',
    flag: false
  })
  if (isGameStart) {
    res.appendCommand({
      type: 'CHANGE_PLAY_TAB_TEXT',
      text: `Игра началась! ${req.request.payload.character.appeal === 'official' ? 'Нажмите' : 'Нажми'} на кнопку по истечении ${session.timePeriod} секунд`
    })
    session.isGameStart = false
  }
}

export const clickHandler: SaluteHandler = async ({ req, res, session }, dispatch) => {
  const { timestamp } = req.variables
  const { timestampStart, timePeriod, globalScore, countScore } = session
  const errorTime = ERROR_TIME + Number(timePeriod) * 20
  const warningTime = WARNING_TIME + Number(timePeriod) * 20
  const userClickPeriod = Number(timestamp) - Number(timestampStart)
  const difference = userClickPeriod - Number(timePeriod) * 1000
  if (Math.abs(difference) < warningTime) {
    const pronounces = ['Отлично! Продолжаем.', 'Совершенно верно! Продолжаем.', 'Отлично! Дальше.', 'Молоде\'ц! дальше.']
    const phrase = getRandomArrayItem(pronounces)
    await res.setPronounceText(phrase, { ssml: true })
    res.setEmotion('udovolstvie')
    res.appendCommand({
      type: 'CHANGE_PLAY_TAB_TEXT',
      text: clearText(phrase)
    })
    if (dispatch) dispatch(['getStartSound'])
    session.countScore = Number(countScore) + 1
  } else if (Math.abs(difference) < errorTime) {
    const pronounces = ['Почти получилось, но можно закрыть глаза. Продолжаем', 'Небольшая ошибка, но сделаем вид что так и должно быть', 'Буквально на полсекундочки ошибся, ну ничего']
    const phrase = getRandomArrayItem(pronounces)
    await res.setPronounceText(phrase)
    res.appendCommand({
      type: 'CHANGE_PLAY_TAB_TEXT',
      text: clearText(phrase)
    })
    if (dispatch) {
      dispatch(['getStartSound'])
      console.log('dispatch')
    }
    session.countScore = Number(countScore) + 1
  } else {
    const secDifference = Math.round(Math.abs(difference) / 1000)
    if (Math.sign(difference) === -1) {
      const pronounces = [
        `Не получилось, надо было нажать через ${secDifference <= 2 ? digits[secDifference - 1] : secDifference}
      ${secDifference <= 1 ? 'секунду' : secDifference <= 4 ? 'секунды' : 'секунд'}.`,
        `Ошибка, на ${secDifference <= 2 ? digits[secDifference - 1] : secDifference}
      ${secDifference <= 1 ? 'секунду' : secDifference <= 4 ? 'секунды' : 'секунд'} раньше.`
      ]
      const selectedPronounce = getRandomArrayItem(pronounces)
      res.setPronounceText(selectedPronounce)
      res.appendCommand({
        type: 'CHANGE_PLAY_TAB_TEXT',
        text: `${selectedPronounce} Попробуем еще раз? Отсчет времени начнется после звукового сигнала.`
      })
    } else if (Math.sign(difference) === 1) {
      const pronounces = [
        `Не получилось, надо было нажать ${secDifference <= 2 ? digits[secDifference - 1] : secDifference}
      ${secDifference <= 1 ? 'секунду' : secDifference <= 4 ? 'секунды' : 'секунд'} назад.`,
        `Ошибка, на ${secDifference <= 2 ? digits[secDifference - 1] : secDifference}
      ${secDifference <= 1 ? 'секунду' : secDifference <= 4 ? 'секунды' : 'секунд'} позже.`
      ]
      const selectedPronounce = getRandomArrayItem(pronounces)
      res.setPronounceText(selectedPronounce)
      res.appendCommand({
        type: 'CHANGE_PLAY_TAB_TEXT',
        text: `${selectedPronounce} Попробуем еще раз? Отсчет времени начнется после звукового сигнала.`
      })
      res.setEmotion('nesoglasie')
    }
    if (Number(globalScore) < Number(countScore)) {
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