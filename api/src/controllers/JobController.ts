import express, { RequestHandler } from 'express';
import { OK } from 'http-status-codes';

import Logger from '../Logger';
import { Authentication } from '../config/passport';
import * as JobService from '../services/JobService';
import { AccessLevels, Modules } from '../database/models/Permission';
import { createAuthorizer } from '../middleware/createAuthorizer';

const JobController = express.Router();
const LOG = new Logger('JobController.ts');

interface JobQueryParams {
  s: number; // is offset for pagination search
  l?: number; // limit for pagination search
  q?: string; // query for searching
  c?: string; // filter for contract flag (all, active, expiring, expired)
  fb?: string; // filter by for term (termStart, termEnd)
  sd?: string; // start date value
  ed?: string; // end date value
  ci?: number; // client id value
  vi?: number; // vehicle id value
  ei?: number; // service id value
}

const searchJobAuthorizer = createAuthorizer({ module: Modules.JOBS, accessLevel: AccessLevels.VIEW });
console.log('apasiiiii', searchJobAuthorizer);

const searchJobHandler: RequestHandler = async (req, res, next) => {
  try {
    const { s, l, q, c, fb, sd, ed, ci, vi, ei }: JobQueryParams = req.query;

    const { rows, vehicles, employes } = await JobService.searchJobsWithPagination(s, l, q, c, fb, sd, ed, ci, vi, ei);
    console.log('searchJobHandler', searchJobHandler);
    return res.status(OK).json({
      vehicles,
      jobs: rows,
      employes
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const editJobAuthorizer = createAuthorizer({ module: Modules.JOBS, accessLevel: AccessLevels.EDIT });

const deleteJobAuthorizer = createAuthorizer({ module: Modules.JOBS, accessLevel: AccessLevels.DELETE });

// const deleteJobHandler: RequestHandler = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     await JobService.deleteService(id.split(','));

//     return res.sendStatus(NO_CONTENT);
//   } catch (err) {
//     LOG.error(err);
//     return next(err);
//   }
// };

JobController.get('/', Authentication.AUTHENTICATED, searchJobAuthorizer, searchJobHandler);
JobController.put('/:id', Authentication.AUTHENTICATED, editJobAuthorizer);
JobController.delete('/:id', Authentication.AUTHENTICATED, deleteJobAuthorizer);

export default JobController;
