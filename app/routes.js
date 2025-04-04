// External dependencies
const express = require('express')

const router = express.Router()

// Add your routes here - above the module.exports line

// if edge page requested anywhere in this app render the edge.html page
router.get(/(^|\/)_edge(\/|$)/, (req, res) => {
  res.render('edge.html')
})

module.exports = router
