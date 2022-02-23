var express = require('express');
var router = express.Router();
 
router.use('/user', require('./user'));
router.use('/role', require('./role'));
router.use('/menu', require('./menu'))
 
// router.get('/', function(req, res){
//     res.render('index');
// });
 
module.exports = router;