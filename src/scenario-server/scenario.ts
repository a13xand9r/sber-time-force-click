import { SmartAppBrainRecognizer } from '@salutejs/recognizer-smartapp-brain'
import { createIntents, createMatchers, createSaluteRequest, createSaluteResponse, createScenarioWalker, createSystemScenario, createUserScenario, NLPRequest, NLPResponse, SaluteRequest } from '@salutejs/scenario'
import { SaluteMemoryStorage } from '@salutejs/storage-adapter-memory'
import { clickHandler, getScoreHandler, getScoreVoiceHandler, getStartSoundHandler, noMatchHandler, runAppHandler, startGameHandler, startNewClickHandler } from './handlers'
import model from '../intents.json'

const intents = createIntents(model.intents)
const storage = new SaluteMemoryStorage()
const { action, intent } = createMatchers<SaluteRequest, typeof intents>()

const userScenario = createUserScenario({
  getClick: {
    match: action('CLICK'),
    handle: clickHandler
  },
  startGame: {
    match: action('START_GAME'),
    handle: startGameHandler
  },
  startNewClick: {
    match: action('START_NEW_CLICK'),
    handle: startNewClickHandler
  },
  getScore: {
    match: action('GET_SCORE'),
    handle: getScoreHandler
  },
  getStartSound: {
    match: action('GET_START_SOUND'),
    handle: getStartSoundHandler
  },
  getScoreVoice: {
    match: intent('/счет', {confidence: 0.2}),
    handle: getScoreVoiceHandler
  }
})

const systemScenario = createSystemScenario({
  RUN_APP: runAppHandler,
  NO_MATCH: noMatchHandler
})

const scenarioWalker = createScenarioWalker({
  recognizer: new SmartAppBrainRecognizer(process.env.NEXT_PUBLIC_SMART_BRAIN),
  intents,
  systemScenario,
  userScenario
})

export const handleNlpRequest = async (request: NLPRequest): Promise<NLPResponse> => {
  const req = createSaluteRequest(request)
  const res = createSaluteResponse(request)
  const sessionId = request.uuid.userId
  const session = await storage.resolve(sessionId)
  await scenarioWalker({ req, res, session })

  await storage.save({ id: sessionId, session})

  return res.message
}