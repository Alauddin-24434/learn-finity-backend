import jwt, { type JwtPayload } from "jsonwebtoken"
import { envVariable } from "../config"

export const createAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, envVariable.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: envVariable.JWT_ACCESS_TOKEN_EXPIRES_IN,
  })
}

export const createRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, envVariable.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: envVariable.JWT_REFRESH_TOKEN_EXPIRES_IN,
  })
}

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, envVariable.JWT_ACCESS_TOKEN_SECRET) as JwtPayload
}

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, envVariable.JWT_REFRESH_TOKEN_SECRET) as JwtPayload
}
