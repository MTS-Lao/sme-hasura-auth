import { authenticationGate } from '@/middleware/auth';
import logger from '@/utils/logger';
import { Router } from 'express';

const router = Router();

router.post('/logging', authenticationGate, (req, res) => {
  const { level, error } = req.body;
  logger.info(error || null, {
    level: level || 'error',
    x: 'x'
  });
  res.status(201).send({ message: 'ok' });
});

const loggingRouter = router;
export { loggingRouter };
