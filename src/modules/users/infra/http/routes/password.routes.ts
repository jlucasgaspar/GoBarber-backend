import { Router } from 'express'

import ForgotPasswordController from '../controllers/ForgotPasswordController'
import ResetPasswordController from '../controllers/ResetPasswordController'

const passwordRouterRouter = Router()
const forgotPasswordController = new ForgotPasswordController()
const resetPasswordController = new ResetPasswordController()

passwordRouterRouter.post('/forgot', forgotPasswordController.create)
passwordRouterRouter.post('/reset', resetPasswordController.create)

export default passwordRouterRouter