import jwt from 'jsonwebtoken';

export const createToken = (
  payload: { [key: string]: unknown },
  rememberMe = false
) => {
  const expiresIn = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000;
  const token = jwt.sign(payload, process.env.JWT_SECRET as unknown as string, {
    expiresIn,
  });
  return { token, expiresIn: expiresIn.toString() };
};

export const verifyToken = (token: string) => {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET as unknown as string);
    return {
      isValid: true,
      data,
    };
  } catch (err) {
    return {
      isValid: false,
    };
  }
};
