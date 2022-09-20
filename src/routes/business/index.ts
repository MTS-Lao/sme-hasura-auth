import { Router } from 'express';

// import { asyncWrapper as aw } from '@/utils';
// import { bodyValidator } from '@/validation';
import { authenticationGate } from '@/middleware/auth';
import { getBusiness } from './business';
import { sendError } from '@/errors';

const router = Router();

router.get('/business', authenticationGate, async (_req, res) => {
  try {
    let whereArg = {};
    let { where } = _req.query;
    if (where) {
      if (typeof where == 'string') {
        whereArg = JSON.parse(where);
      }
    }
    const [error, business] = await getBusiness({ where: whereArg });
    if (error) {
      return sendError(res, 'invalid-request');
    }
    return res.send({
      message: 'success',
      business: business,
    });
  } catch (error) {
    return res.status(500).send({
      message: 'fail',
      business: [],
    });
  }
});

const businessRouter = router;
export { businessRouter };
