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

router.post('/questions-flow/version-1/pharmacy-out-of-stock-question', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data['didYourPharmacyTryToFindYourMedicineFromElsewhere'];
  req.session.data.answers.didYourPharmacyTryToFindYourMedicineFromElsewhere = answer;

  if(answer == 'no') {
    return res.redirect('pharmacy-out-of-stock-info');
  } else {
    return res.redirect('when-meds-due');
  }
  next();
});

// ##################################################################
// verison 2
// ##################################################################

router.post('/questions-flow/version-2/was-a-repeat-prescription-requested', function(req, res){
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

router.post('/questions-flow/version-2/what-happened-to-your-repeat-rx-request', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data['whatHappenedToYourRepeatPrescriptionRequest'];
  req.session.data.answers.whatHappenedToYourRepeatPrescriptionRequest = answer;
  if(answer == 'not-sure') {
    return res.redirect('when-meds-due');
  }
  next();
});

router.post('/questions-flow/version-2/why-no-repeat-prescription-request', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data['whyDidYouNotSendARepeatPrescriptionRequest'];
  req.session.data.answers.whyDidYouNotSendARepeatPrescriptionRequest = answer;
  if(answer == 'other') {
    return res.redirect('when-meds-due');
  }
  next();
});

// ##################################################################
// verison 3
// ##################################################################

router.post('/questions-flow/version-3/was-a-repeat-prescription-requested', function(req, res){
  req.session.data.answers = {};
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

router.post('/questions-flow/version-3/what-happened-to-your-repeat-rx-request', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data['whatHappenedToYourRepeatPrescriptionRequest'];
  req.session.data.answers.whatHappenedToYourRepeatPrescriptionRequest = answer;
  if(answer == 'not-sure') {
    return res.redirect('when-meds-due');
  }
  next();
});

router.post('/questions-flow/version-3/why-no-repeat-prescription-request', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data['whyDidYouNotSendARepeatPrescriptionRequest'];
  req.session.data.answers.whyDidYouNotSendARepeatPrescriptionRequest = answer;
  if(answer == 'other') {
    return res.redirect('when-meds-due');
  }
  next();
});

// ##################################################################
// verison 4
// ##################################################################

router.post('/questions-flow/version-4/was-a-repeat-prescription-requested', function(req, res){
  req.session.data.answers = {};
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

router.post('/questions-flow/version-4/what-happened-to-your-repeat-rx-request', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data['whatHappenedToYourRepeatPrescriptionRequest'];
  req.session.data.answers.whatHappenedToYourRepeatPrescriptionRequest = answer;
  if(answer == 'not-sure') {
    return res.redirect('when-meds-due');
  }
  next();
});

router.post('/questions-flow/version-4/why-no-repeat-prescription-request', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data['whyDidYouNotSendARepeatPrescriptionRequest'];
  req.session.data.answers.whyDidYouNotSendARepeatPrescriptionRequest = answer;
  if(answer == 'other' || answer == 'not-registered-with-a-gp') {
    return res.redirect('when-meds-due');
  }
  next();
});

// ##################################################################
// verison 5
// ##################################################################

router.post('/questions-flow/version-5/who-needs-help', function(req, res){
  req.session.data.answers = {};
  var answer = req.session.data['whoNeedsHelp'];
  req.session.data.answers.whoNeedsHelp = answer;
  if(answer == 'me') {
    console.log('1st person');
    return res.redirect('was-a-repeat-prescription-requested');
  } else {
    console.log('3rd person');
    return res.redirect('third-person/was-a-repeat-prescription-requested');
  }
});

// Version 5 - 1st person flow
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

router.post('/questions-flow/version-5/was-a-repeat-prescription-requested', function(req, res){
  req.session.data.answers = {};
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

router.post('/questions-flow/version-5/what-happened-to-your-repeat-rx-request', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data['whatHappenedToYourRepeatPrescriptionRequest'];
  req.session.data.answers.whatHappenedToYourRepeatPrescriptionRequest = answer;
  if(answer == 'not-sure') {
    return res.redirect('when-meds-due');
  }
  next();
});

router.post('/questions-flow/version-5/why-no-repeat-prescription-request', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data['whyDidYouNotSendARepeatPrescriptionRequest'];
  req.session.data.answers.whyDidYouNotSendARepeatPrescriptionRequest = answer;
  if(answer == 'other' || answer == 'not-registered-with-a-gp') {
    return res.redirect('when-meds-due');
  }
  next();
});

// Version 5 - third person flow
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

router.post('/questions-flow/version-5/third-person/was-a-repeat-prescription-requested', function(req, res){
  req.session.data.answers = {};
  var answer = req.session.data['didTheySendARepeatPrescriptionRequestToYourGpSurgery'];
  req.session.data.answers.wasARepeatPrescriptionRequested = answer;
  if(answer == 'yes') {
    console.log('Redirecting to what-happened-to-repeat-rx-request');
    return res.redirect('what-happened-to-repeat-rx-request');
  } else {
    console.log('Redirecting to why-no-repeat-prescription-request');
    return res.redirect('why-no-repeat-prescription-request');
  }
});

router.post('/questions-flow/version-5/third-person/what-happened-to-repeat-rx-request', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data['whatHappenedToTheirRepeatPrescriptionRequest'];
  req.session.data.answers.whatHappenedToTheirRepeatPrescriptionRequest = answer;
  if(answer == 'not-sure') {
    return res.redirect('when-meds-due');
  }
  next();
});

router.post('/questions-flow/version-5/third-person/why-no-repeat-prescription-request', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data['whyDidTheyNotSendARepeatPrescriptionRequest'];
  req.session.data.answers.whyDidTheyNotSendARepeatPrescriptionRequest = answer;
  if(answer == 'other' || answer == 'not-registered-with-a-gp') {
    return res.redirect('when-meds-due');
  }
  next();
});

module.exports = router;
