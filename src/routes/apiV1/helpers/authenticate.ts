// David Beath, https://davidbeath.com/posts/expressjs-40-basicauth.html

import * as basicAuth from 'basic-auth';
import { password, username } from '../../../config/config';

export const auth = (req, res, next) => {
  const unauthorized = (nonAuthRes) => {
    nonAuthRes.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return nonAuthRes.status(403).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Not authorized to perform this action',
      },
    });
  };

  const user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  if (user.name === username && user.pass === password) {
    return next();
  } else {
    return unauthorized(res);
  }
};
