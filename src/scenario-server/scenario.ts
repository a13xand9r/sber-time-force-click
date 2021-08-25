import { createMatchers, createSaluteRequest, createSaluteResponse, createScenarioWalker, createSystemScenario, createUserScenario, NLPRequest, NLPResponse, SaluteRequest } from '@salutejs/scenario'
import { SaluteMemoryStorage } from '@salutejs/storage-adapter-memory'
import { clickHandler, noMatchHandler, runAppHandler, startGameHandler, startNewClickHandler } from './handlers'

const storage = new SaluteMemoryStorage()
const { action } = createMatchers<SaluteRequest>()

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
  }
})

const systemScenario = createSystemScenario({
  RUN_APP: runAppHandler,
  NO_MATCH: noMatchHandler
})

const scenarioWalker = createScenarioWalker({
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