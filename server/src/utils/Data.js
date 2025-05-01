import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
export const DataJson = require('../Models/data.json')