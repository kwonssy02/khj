var express = require('express');
var router = express.Router();
var cookie = require('cookie-parser');
var mongojs = require('mongojs');
var db = mongojs('memo', ['users']);

// db.test.find({}, {name:1}, function(error, data) {
// 	console.log(error);
// 	console.log(data);
// });

/* GET home page. */
router.get('/', function(req, res, next) {

	//쿠키 있으면 조회
	if(req.cookies.sessionID != undefined) {
		// console.log('쿠키 있다!!!!!!!');
		// console.log(req.cookies.sessionID);
		// console.log(req.sessionID);

		//DB에서 세션아이디로 메모 조회

	//쿠키 없으면 세션ID를 DB에 저장하고 쿠키 저장
	}else {
		// console.log('쿠키 없음!!');
		// console.log(req.cookies.sessionID);
		// console.log(req.sessionID);

		res.cookie('sessionID', req.sessionID);
	}

	var data = {};
	var memos = [];
	var memo1 = {"memoId":1, "title":"타이틀입니다."};
	var memo2 = {"memoId":2, "title":"타이틀입니다.222"};

	memos.push(memo1);
	memos.push(memo2);
	data['memos'] = memos;

	res.render('index', data);
});

router.get('/destroy', function(req, res, next) {
	var sessionId = req.cookies.sessionID;

	//DB 삭제
	

	res.clearCookie('sessionID');
	res.redirect('/');
});

router.get('/memo', function(req, res, next) {
	var sessionId = req.cookies.sessionID;
	var data = {};
	data['newFlag'] = true;

	res.render('memo', data);
});

router.get('/memo/:memoId', function(req, res, next) {
	var sessionId = req.cookies.sessionID;
	var data = {};
	data['newFlag'] = false;
	data['title'] = "타이틀입니다.";
	data['content'] = "내용입니다.";

	res.render('memo', data);
});

router.post('/create', function(req, res, next) {
	var sessionId = req.cookies.sessionID;
	//메모 저장

	res.redirect('/');
});

router.post('/save', function(req, res, next) {
	var sessionId = req.cookies.sessionID;
	//메모 수정

	res.redirect('/');
});

router.post('/delete', function(req, res, next) {
	var sessionId = req.cookies.sessionID;
	//메모 삭제

	res.redirect('/');
});

module.exports = router;
