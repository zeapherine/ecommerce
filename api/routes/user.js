const router = require('express').Router();

router.get('/test', (req, res) => {
	res.send('test');
});

router.post('/userposttest', (req, res) => {
	const username = req.body.username;
	console.log(username);
	res.send('Your username is ' + username);
});

module.exports = router;
