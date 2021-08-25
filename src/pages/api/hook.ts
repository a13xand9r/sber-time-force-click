import type { NextApiRequest, NextApiResponse } from 'next'
import { handleNlpRequest } from '../../scenario-server/scenario'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('api/hook method: ', req.method)
  res.status(200).json(await handleNlpRequest(req.body))
}
