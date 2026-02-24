import express from 'express';
import doctorschedulesRouter from './doctorschedules.routes.js';
import appointmentsRouter from './appointments.routes.js';
import petvitalsRouter from './petvitals.routes.js';
import petClinicalNotesRouter from './petclinicalnotes.routes.js';
import diagnosisRouter from './diagnosis.routes.js';
import prescriptionsRouter from './prescriptions.routes.js';
import treatmentsRouter from './treatments.routes.js';
import proceduresRouter from './procedures.routes.js';
import vaccinationsRouter from './vaccinations.routes.js';
import followUpsRouter from './followups.routes.js';
import billsRouter from './bills.routes.js';
import groomingRouter from './grooming.routes.js';

const router = express.Router();

router.use('/appointments', doctorschedulesRouter);
router.use('/appointments', appointmentsRouter);
router.use('/appointments', petvitalsRouter);
router.use('/appointments', petClinicalNotesRouter);
router.use('/appointments', diagnosisRouter);
router.use('/appointments', prescriptionsRouter);
router.use('/appointments', treatmentsRouter);
router.use('/appointments', proceduresRouter);
router.use('/appointments', vaccinationsRouter);
router.use('/appointments', followUpsRouter);
router.use('/appointments', billsRouter);
router.use('/appointments', groomingRouter);

export default router;