import { Router } from 'express'

import usersRouter from '@modules/users/infra/http/routes/users.routes'
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes'
import passwordRouter from '@modules/users/infra/http/routes/password.routes'
import profileRouter from '@modules/users/infra/http/routes/profile.routes'

import providersRouter from '@modules/appointments/infra/http/routes/providers.routes'
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes'

const routes = Router()

routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/password', passwordRouter)
routes.use('/profile', profileRouter)

routes.use('/providers', providersRouter)
routes.use('/appointments', appointmentsRouter)

export default routes