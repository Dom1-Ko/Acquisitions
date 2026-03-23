import jwt from 'jsonwebtoken';
import logger from '#config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-secret-key-please-change-in-production';   // since it needs to be coming over form environment variables
const JWT_EXPIRES_IN = '1d';

// jwt to ensure users are signed in and are who they claim to be
export const jwttoken = {
    // accepts a paylload and returns a signed jwt token
    sign: (payload) => {
        try {
            return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        } catch (e) {
            logger.error('Failed to authenticate token', error);
            throw new Error('Failed ot authenticate token')
        }
    },

    verify: (token) => {
        try {
            return jwt.verify(token, JWT_SECRET)
        }
        catch (e) {
            logger.error('Failed to authenticate token', error);
            throw new Error('Failed ot authenticate token')
        }
    }
};

