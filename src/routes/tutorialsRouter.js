const express = require('express')
const router = express.Router()
const dbConn = require('../lib/dbconfig')
const statusCodes = require('../constants/statusCodes')

// Get all tutorials
router.route('/tutorials')
  .get(function (req, res, next) {
    const { title } = req.query

    if (title) {
      dbConn.query(`SELECT * FROM tutorials WHERE title LIKE '%${title}%'`, function (err, rows) {
        if (err) {
          return res.status(statusCodes.BAD_REQUEST).send({
            statusCode: statusCodes.BAD_REQUEST,
            success: false,
            errors: {
              message: err.message
            }
          })
        } else {
          return res.status(statusCodes.OK).send({
            statusCode: statusCodes.OK,
            success: true,
            tutorials: rows
          })
        }
      })
    } else {
      dbConn.query('SELECT * FROM tutorials ORDER BY id desc', function (err, rows) {
        if (err) {
          return res.status(statusCodes.BAD_REQUEST).send({
            statusCode: statusCodes.BAD_REQUEST,
            success: false,
            errors: {
              message: err.message
            }
          })
        } else {
          return res.status(statusCodes.OK).send({
            statusCode: statusCodes.OK,
            success: true,
            tutorials: rows
          })
        }
      })
    }
  })
  .post(function (req, res, next) {
    if (Object.keys(req.body).length === 0) {
      return res.status(statusCodes.BAD_REQUEST).send({
        statusCode: statusCodes.BAD_REQUEST,
        success: false,
        errors: {
          message: 'title and description keys are required'
        }
      })
    }
    const title = req.body.title
    const description = req.body.description

    if (title.length === 0 || description.length === 0) {
      return res.status(statusCodes.UNPROCESSABLE_ENTITY).send({
        statusCode: statusCodes.UNPROCESSABLE_ENTITY,
        success: false,
        errors: {
          message: 'Title and description cannot be empty'
        }
      })
    }

    const formData = {
      title,
      description,
      published: true
    }

    // insert query
    dbConn.query('INSERT INTO tutorials SET ?', formData, function (err, result) {
      if (err) {
        return res.status(statusCodes.BAD_REQUEST).send({
          statusCode: statusCodes.BAD_REQUEST,
          success: false,
          errors: {
            message: err.message
          }
        })
      } else {
        return res.status(statusCodes.CREATED).send({
          statusCode: statusCodes.CREATED,
          success: true,
          tutorial: { id: result.insertId, ...formData }
        })
      }
    })
  })

// Get a single tutorial by id
router.route('/tutorials/:id')
  .get(function (req, res, next) {
    const id = req.params.id

    dbConn.query('SELECT * FROM tutorials WHERE id = ' + id, function (err, rows) {
      if (err) {
        return res.status(statusCodes.BAD_REQUEST).send({
          statusCode: statusCodes.BAD_REQUEST,
          success: false,
          errors: {
            message: err.message
          }
        })
      }
      // if tutorial not found
      if (rows.length <= 0) {
        return res.status(statusCodes.NOT_FOUND).send({
          statusCode: statusCodes.NOT_FOUND,
          success: false,
          errors: {
            message: 'Tutorial not found'
          }
        })
      } else {
        return res.status(statusCodes.OK).send({
          statusCode: statusCodes.OK,
          success: true,
          tutorial: {
            id: rows[0].id,
            title: rows[0].title,
            description: rows[0].description,
            published: rows[0].published
          }
        })
      }
    })
  })
  .put(function (req, res, next) {
    const id = req.params.id
    if (Object.keys(req.body).length === 0) {
      return res.status(statusCodes.BAD_REQUEST).send({
        statusCode: statusCodes.BAD_REQUEST,
        success: false,
        errors: {
          message: 'title, description and published keys are required'
        }
      })
    }
    const title = req.body.title
    const description = req.body.description
    const published = req.body.published

    if (title.length === 0 || description.length === 0) {
      return res.status(statusCodes.UNPROCESSABLE_ENTITY).send({
        statusCode: statusCodes.UNPROCESSABLE_ENTITY,
        success: false,
        errors: {
          message: 'Title, description and published cannot be empty'
        }
      })
    }

    const formData = {
      title,
      description,
      published
    }
    // update query
    dbConn.query('UPDATE tutorials SET ? WHERE id = ' + id, formData, function (err, result) {
      if (err) {
        return res.status(statusCodes.BAD_REQUEST).send({
          statusCode: statusCodes.BAD_REQUEST,
          success: false,
          errors: {
            message: err.message
          }
        })
      } else {
        return res.status(statusCodes.OK).send({
          statusCode: statusCodes.OK,
          success: true,
          tutorial: { id, ...formData }
        })
      }
    })
  })
  .delete(function (req, res, next) {
    const id = req.params.id

    dbConn.query('DELETE FROM tutorials WHERE id = ' + id, function (err, result) {
      if (err) {
        return res.status(statusCodes.BAD_REQUEST).send({
          statusCode: statusCodes.BAD_REQUEST,
          success: false,
          errors: {
            message: err.message
          }
        })
      } else {
        return res.status(statusCodes.NO_CONTENT).send(result)
      }
    })
  })

module.exports = router
