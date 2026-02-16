var express = require('express');
var router = express.Router();
const utils = require('../lib/utils');

const baseAnswers = {
  firstname: 'Firstname',
  lastname: 'Lastname',
  receipt: {
    emailAddress: 'email@nhs.net',
    methods: ['email']
  },
  whenMedsDue: 'less-than-6-hours',
  age: '44',
  pov: 'first-person'
}


// ##################################################################
// verison 1
// ##################################################################

router.post('who-needs-help', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data.answers.whoNeedsHelp;
  if(answer == 'me') {
    console.log('1st person');
    req.session.data.pov = 'first-person';
  } else {
    console.log('3rd person');
    req.session.data.pov = 'third-person';
  }
  next();
});

router.post('/guided-entry/medicines-help', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  if(req.session.data.answers.journey == 'EmergencyPrescription') {
    console.log('Redirecting to EP Start');
    return res.redirect('../ep-start');
  }
  next();
});

router.post('was-a-repeat-prescription-requested', function(req, res){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data.answers.prescriptionRequested;
  console.log(`Answer: ${answer}`);
  if(answer == 'yes') {
    console.log('Redirecting to what-happened-to-repeat-rx-request');
    return res.redirect('what-happened-to-repeat-rx-request');
  } else if (answer == 'no') {
    console.log('Redirecting to why-no-repeat-prescription-request');
    return res.redirect('why-no-repeat-prescription-request');
  } else {
    console.log('Redirecting to when meds due');
    return res.redirect('when-meds-due');
  }
});

router.post('what-happened-to-repeat-rx-request', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data.answers.prescriptionWhathappened;
  console.log(`Answer: ${answer}`);
  if(answer == 'not-sure') {
    console.log('Redirecting to when-meds-due');
    return res.redirect('when-meds-due');
  } else {
    console.log('Redirecting to ep-guidance-interupt');
    return res.redirect('ep-guidance-interupt');
  }
  next();
});

router.post('why-no-repeat-prescription-request', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data.answers.prescriptionReasonNotRequested;
  console.log(`Answer: ${answer}`);
  if(answer == 'other' || answer == 'not-registered-with-a-gp') {
    return res.redirect('when-meds-due');
  }
  next();
});

router.post('check-home-postcode', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data.answers.isHomePostcode;
  console.log(`Answer: ${answer}`);
  if(answer == 'yes') {
    console.log('Redirecting to phone number question');
    return res.redirect('phone-number');
  } else {
    console.log('Redirecting what is your home postcode question');
    return res.redirect('add-home-postcode');
  }
  next();
});

router.post('pharmacy-list', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data.answers.pharmacy;
  console.log(`Answer: ${answer}`);
  if(answer == 'dsp') {
    req.session.data.pharmacyDetails = {
      name: 'DSP Pharmacy',
      type: 'Online Pharmacy'
    }
  } else {
    req.session.data.pharmacyDetails = {
      name: 'Heywood Pharmacy - Heywood',
      addressLine1: '50 Manchester Rd',
      addressLine2: 'Heywood',
      postcode: 'OL10 2AH',
      type: 'Highstreet'
    }
  }
  next();
});

router.post('receipt', function(req, res, next){
  req.session.data.answers = req.session.data.answers || {};
  var answer = req.session.data.answers.receipt;
  console.log(`Answer: ${answer}`);
  if(answer == 'yes') {
    console.log('Redirecting to receipt method question');
    return res.redirect('receipt-method');
  } else {
    console.log('Redirecting ');
    return res.redirect('check-details');
  }
  next();
});

router.get('confirmation-highstreet', function(req, res, next){
  req.session.data.answers = utils.deepMerge(req.session.data.answers || baseAnswers, {
    pharmacy: 'highstreet'
  });
  req.session.data.pov = 'first-person';
  console.log(`Using override highstreet confirmation route`);
  res.redirect('confirmation');
});

router.get('confirmation-dsp', function(req, res, next){
  req.session.data.answers = utils.deepMerge(req.session.data.answers || baseAnswers, {
    pharmacy: 'dsp'
  });
  console.log(`Using override dsp confirmation route`);
  res.redirect('confirmation');
});

module.exports = router;
