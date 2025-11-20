var express = require('express');
var router = express.Router();
const utils = require('../lib/utils');

// example of a redirect based on an answer to a question
router.post('/questions-flow/original/was-a-repeat-prescription-requested', function(req, res){
  var answer = req.session.data['didYouSendARepeatPrescriptionRequestToYourGpSurgery'];
  if(answer == 'yes') {
    console.log('Redirecting to what-happened-to-your-repeat-rx-request');
    return res.redirect('what-happened-to-your-repeat-rx-request');
  } else {
    console.log('Redirecting to why-no-repeat-prescription-request');
    return res.redirect('why-no-repeat-prescription-request');
  }
});

router.post('/questions-flow/original/what-happened-to-your-repeat-rx-request', function(req, res, next){
  var answer = req.session.data['whatHappenedToYourRepeatPrescriptionRequest'];
  next();
});

module.exports = router;
