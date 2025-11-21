var express = require('express');
var router = express.Router();
const utils = require('../lib/utils');

// ##################################################################
// original flow (compressed version)
// ##################################################################

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

// ##################################################################
// verison 1
// ##################################################################

router.post('/questions-flow/version-1/was-a-repeat-prescription-requested', function(req, res){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data['didYouSendARepeatPrescriptionRequestToYourGpSurgery'];
  req.session.data.answers.wasARepeatPrescriptionRequested = answer;
  if(answer == 'yes') {
    console.log('Redirecting to what-happened-to-your-repeat-rx-request');
    return res.redirect('what-happened-to-your-repeat-rx-request');
  } else {
    console.log('Redirecting to why-no-repeat-prescription-request');
    return res.redirect('why-no-repeat-prescription-request');
  }
});

router.post('/questions-flow/version-1/what-happened-to-your-repeat-rx-request', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data['whatHappenedToYourRepeatPrescriptionRequest'];
  req.session.data.answers.whatHappenedToYourRepeatPrescriptionRequest = answer;

  if(answer == 'not-available-at-pharmacy') {
    return res.redirect('pharmacy-out-of-stock-question');
  }

  next();
});


module.exports = router;
