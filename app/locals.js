/**
 * @param {typeof config} config
 */
module.exports =
  (config) =>
  /**
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  (req, res, next) => {
    res.locals.serviceName = config.serviceName
    res.locals.debug = config.debug
    res.locals.componentDoc = config.displayComponentPath
    res.locals.codeBlock = config.codeBlockPath
    next()
  }

/**
 * @import { NextFunction, Request, Response } from 'express'
 * @import config from './config.js'
 */
