import jwt, { type SignOptions } from 'jsonwebtoken'

interface TokenPayload {
  userId: string
  email: string
  role: string
}

interface DecodedToken extends TokenPayload {
  iat: number
  exp: number
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'fallback-access-secret'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'fallback-refresh-secret'

const accessOptions: SignOptions = { expiresIn: '15m' }
const refreshOptions: SignOptions = { expiresIn: '7d' }

if (process.env.JWT_ACCESS_EXPIRES_IN) {
  accessOptions.expiresIn = process.env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn']
}
if (process.env.JWT_REFRESH_EXPIRES_IN) {
  refreshOptions.expiresIn = process.env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn']
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, accessOptions)
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, refreshOptions)
}

export function verifyAccessToken(token: string): DecodedToken {
  return jwt.verify(token, ACCESS_SECRET) as DecodedToken
}

export function verifyRefreshToken(token: string): DecodedToken {
  return jwt.verify(token, REFRESH_SECRET) as DecodedToken
}

export function signTokenPair(payload: TokenPayload): {
  accessToken: string
  refreshToken: string
} {
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  }
}
