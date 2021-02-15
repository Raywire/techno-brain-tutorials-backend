var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/dbconfig');
const statusCodes = require('../constants/statusCodes')

// Get all tutorials
router.route('/tutorials')
  .get(function(req, res, next) {
      
    dbConn.query('SELECT * FROM tutorials ORDER BY id desc',function(err, rows) {

        if(err) {
          return res.status(statusCodes.BAD_REQUEST).send({
            statusCode: statusCodes.BAD_REQUEST,
            success: false,
            errors: {
              message: err.message
            }
          }); 
        } else {
          return res.status(statusCodes.OK).send({
            statusCode: statusCodes.OK,
            success: true,
            tutorials: rows
          });
        }
    });
  })
  .post(function(req, res, next) {    
    if(Object.keys(req.body).length === 0) {
      return res.status(statusCodes.BAD_REQUEST).send({
        statusCode: statusCodes.BAD_REQUEST,
        success: false,
        errors: {
          message: 'title and description keys are required'
        }
      });
    }
    let title = req.body.title;
    let description = req.body.description;

    if(title.length === 0 || description.length === 0) {
      return res.status(statusCodes.UNPROCESSABLE_ENTITY).send({
        statusCode: statusCodes.UNPROCESSABLE_ENTITY,
        success: false,
        errors: {
          message: 'Title and description cannot be empty'
        }
      });
    }

    const form_data = {
        title,
        description,
        published: true
    }
    
    // insert query
    dbConn.query('INSERT INTO tutorials SET ?', form_data, function(err, result) {
      if (err) {
        return res.status(statusCodes.BAD_REQUEST).send({
          statusCode: statusCodes.BAD_REQUEST,
          success: false,
          errors: {
            message: err.message
          }
        });
      } else {                
        return res.status(statusCodes.CREATED).send({
          statusCode: statusCodes.CREATED,
          success: true,
          tutorial: result
        });
      }
    })
  })

// Get a single tutorial by id
router.route('/tutorials/:id')
  .get(function(req, res, next) {
    let id = req.params.id;

    dbConn.query('SELECT * FROM tutorials WHERE id = ' + id, function(err, rows) {
      if(err) {
        return res.status(statusCodes.BAD_REQUEST).send({
          statusCode: statusCodes.BAD_REQUEST,
          success: false,
          errors: {
            message: err.message
          }
        });
      }
      // if tutorial not found
      if (rows.length <= 0) {
        return res.status(statusCodes.NOT_FOUND).send({
          statusCode: statusCodes.NOT_FOUND,
          success: false,
          errors: {
            message: 'Tutorial not found'
          }
        });
      }
      // if tutorial found
      else {
        return res.status(statusCodes.OK).send({
          statusCode: statusCodes.OK,
          success: true,
          tutorial: {
            id: rows[0].id,
            title: rows[0].title,
            description: rows[0].description,
            published: rows[0].published
          }
        });
      }
    })
  })
  .put(function(req, res, next) {
    let id = req.params.id;
    if(Object.keys(req.body).length === 0) {
      return res.status(statusCodes.BAD_REQUEST).send({
        statusCode: statusCodes.BAD_REQUEST,
        success: false,
        errors: {
          message: 'title, description and published keys are required'
        }
      });
    }
    let title = req.body.title;
    let description = req.body.description;
    let published = req.body.published;

    if(title.length === 0 || description.length === 0) {
      return res.status(statusCodes.UNPROCESSABLE_ENTITY).send({
        statusCode: statusCodes.UNPROCESSABLE_ENTITY,
        success: false,
        errors: {
          message: 'Title, description and published cannot be empty'
        }
      });
    }  

    var form_data = {
        title,
        description,
        published
    }
    // update query
    dbConn.query('UPDATE tutorials SET ? WHERE id = ' + id, form_data, function(err, result) {
      if (err) {
        return res.status(statusCodes.BAD_REQUEST).send({
          statusCode: statusCodes.BAD_REQUEST,
          success: false,
          errors: {
            message: err.message
          }
        });
      } else {
        return res.status(statusCodes.OK).send({
          statusCode: statusCodes.OK,
          success: true,
          tutorial: result
        });
      }
    })
  })
  .delete(function(req, res, next) {
      let id = req.params.id;

      dbConn.query('DELETE FROM tutorials WHERE id = ' + id, function(err, result) {
        if (err) {
          return res.status(statusCodes.BAD_REQUEST).send({
            statusCode: statusCodes.BAD_REQUEST,
            success: false,
            errors: {
              message: err.message
            }
          });
        } else {
          return res.status(statusCodes.NO_CONTENT).send(result);
        }
      })
  })

module.exports = router;
