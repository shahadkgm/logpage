var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.isAuthenticated){
     res.redirect("/home")
  }else{
    res.redirect('/login')
  }
});

module.exports = router;
