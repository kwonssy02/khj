var express = require('express');
var router = express.Router();
var cookie = require('cookie-parser');
var mongojs = require('mongojs');
var db = mongojs('memodb', ['users', 'memos']);

/* GET home page. */
router.get('/', function(req, res, next) {

	var data = {};

	//쿠키 있으면 조회
	if(req.cookies.sessionID != undefined) {
		// console.log('쿠키 있다!!!!!!!');
		// console.log(req.cookies.sessionID);
		// console.log(req.sessionID);

		//DB에서 세션아이디로 메모 조회
		db.memos.find({sessionId: req.cookies.sessionID}, function(err, docs) {
			console.log(docs);
			data['memos'] = docs;

			res.render('index', data);
		});
	//쿠키 없으면 세션ID를 DB에 저장하고 쿠키 저장
	}else {
		// console.log('쿠키 없음!!');
		// console.log(req.cookies.sessionID);
		// console.log(req.sessionID);

		db.users.insert({sessionId: req.sessionID});
		res.cookie('sessionID', req.sessionID);

		res.render('index', data);
	}

	
	// var memos = [];
	// var memo1 = {"memoId":1, "title":"타이틀입니다."};
	// var memo2 = {"memoId":2, "title":"타이틀입니다.222"};

	// memos.push(memo1);
	// memos.push(memo2);

});

router.get('/destroy', function(req, res, next) {
    var sessionId = req.cookies.sessionID;

    //DB 삭제
    db.memos.find({sessionId: sessionId}).remove();
    db.users.find({sessionId: sessionId}).remove();

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
	var _id = req.params.memoId;
	var data = {};
	
	db.memos.findOne({
	    _id: _id/*mongojs.ObjectId('523209c4561c640000000001')*/
	}, function(err, doc) {
		console.log('aaaaa')
		console.log(doc);
		data['newFlag'] = false;
		data['memoId'] = doc._id;
		data['title'] = doc.title;
		data['content'] = doc.content;    
	    res.render('memo', data);
	})	
});

router.post('/create', function(req, res, next) {
	var sessionId = req.cookies.sessionID;
	var title = req.body.title;
	var content = req.body.content;
	//메모 저장

	db.memos.insert({sessionId: sessionId, title: title, content: content});
	res.redirect('/');
});

router.post('/save', function(req, res, next) {
    var sessionId = req.cookies.sessionID;
    var _id = req.body.memoId;
    var title = req.body.title;
    var content = req.body.content;
    //메모 수정

    db.memos.find({_id: _id}).update({$title: title, $content: content})
    res.redirect('/');
});

router.post('/delete', function(req, res, next) {
    var sessionId = req.cookies.sessionID;
    //메모 삭제

    db.memos.find({_id: _id}).removeOne();
    res.redirect('/');
});

module.exports = router;