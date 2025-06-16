import { Router } from 'express'
import { AnalyzeController } from '../controllers/AnalyzeController'

const router = Router()

router.post('/', AnalyzeController.getAnalyzer)
export default router
