import { expressjwt } from "express-jwt"
import { SECRET } from "../jwt/config.js"

const expressJwtConfig = {
  secret: SECRET,
  algorithms: ["HS256"],
  credentialsRequired: false
}

/* Returns a function that returns the middleware returned by [expressjwt] */
export const validateJwtIfExists = () => expressjwt(expressJwtConfig)