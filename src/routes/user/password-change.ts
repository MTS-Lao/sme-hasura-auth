import { RequestHandler } from 'express';
// import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { ReasonPhrases } from 'http-status-codes';

import {
  // gqlSdk,
  getUser, getUserByEmail, gqlSdk, hashPassword,
} from '@/utils';
import { sendError } from '@/errors';
import { Joi } from '@/validation';


export const userPasswordChangeSchema = Joi.object({
  currentPassword: Joi.required(),
  newPassword: Joi.required(),
}).meta({ className: 'UserPasswordChangeSchema' });

export const userPasswordChangeHandler: RequestHandler<
  {},
  {},
  {
    currentPassword: string;
    newPassword: string;
  }
> = async (req, res) => {
  const {
    currentPassword,
    newPassword
  } = req.body;

  const { userId } = req.auth as RequestAuth;
  const user = await getUser({ userId });
  const userEmail = await getUserByEmail(user.email);
  // console.log(user)

  const isPasswordCorrect = await bcrypt.compare(currentPassword, `${userEmail?.passwordHash}`);

  if (!isPasswordCorrect) {
    return sendError(res, 'invalid-email-password');
  }
  // update password
  const passwordHash = await hashPassword(newPassword);

  await gqlSdk.updateUser({
    id: user.id,
    user: {
      passwordHash,
    },
  });


  return res.json(ReasonPhrases.OK);
};
