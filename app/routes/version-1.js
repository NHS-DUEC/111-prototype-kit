var express = require('express');
var router = express.Router();
const utils = require('../lib/utils');

// example of a redirect based on an answer to a question
router.post('/age', function(req, res, next){
  var age = req.session.data['age'];
  if(age >= 5) {
    console.log('older than 5')
    return res.redirect('sex');
  } else if (age <= 1) {
    console.log('Less than 1 year')
    return res.redirect('under-1-notice')
  } else {
    console.log('Under 5')
    return res.redirect('check-symptoms-under-5');
  }
});

module.exports = router;
