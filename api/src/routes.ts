import express from 'express';

import AuthController from './controllers/AuthController';
import PasswordController from './controllers/PasswordController';
import UserController from './controllers/UserController';
import RoleController from './controllers/RoleController';
import JobController from './controllers/JobController';
import ClientController from './controllers/ClientController';
import ServiceItemTemplateController from './controllers/ServiceItemTemplateController';
import VehicleController from './controllers/VehicleController';
import ServiceController from './controllers/ServiceController';
import EntityController from './controllers/EntityController';
import HealthCheckController from './controllers/HealthCheckController';

const router = express.Router();

router.use('/', AuthController);
router.use('/', PasswordController);
router.use('/healthcheck', HealthCheckController);
router.use('/users', UserController);
router.use('/roles', RoleController);
router.use('/clients', ClientController);
router.use('/serviceitemtemplates', ServiceItemTemplateController);
router.use('/vehicles', VehicleController);
router.use('/services', ServiceController);
router.use('/jobs', JobController);
router.use('/entities', EntityController);

export default router;
