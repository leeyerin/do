var oracledb = require('oracledb');
var dbConfig = require('./config/dbConfig.js');
var static = require('serve-static');
const express = require('express');
const app = express();
var http = require('http');
path = require('path');
static = require('serve-static');
var url = require('url');
var querystring = require('querystring');
var bodyParser = require('body-parser');
var async = require('async');

// //views 폴더와 uploads 폴더 오픈
app.use('/views', static(path.join(__dirname, 'views')));
// app.use('/uploads', static(path.join(__dirname, 'uploads')));
//app.use('/views', static(path.join(__dirname, 'views')));
//app.engine('html', require('ejs').renderFile);
//app.set('views',path.join(__dirname, 'views') )
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.set('views','/views');
var router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

var dbinfo =
{
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString
};

//DB 칼럼 : num title contents priority status deadline

oracledb.autoCommit = true;
//todolist show - home
app.get('/show', function (req, res) {
    var query = "select priority, title, to_char(deadline,'dd-mm-yy'), status "
        + "from todolist "
        + "order by priority asc";
    oracledb.getConnection(dbinfo, function (err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }

        connection.execute(query, function (err, result) {
            if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
            }
            // 결과 쿼리가 존재하지 않을 때
            if (result.rows.length == 0) {
                writeNoExisted();
                console.log('결과쿼리 존재하지 않음');
                return;
            }

            console.log(result.rows[0])
            var content = {
                posts: result.rows
            };
            writeView(content);
        });
    });
    function doRelease(connection, userlist) {
        connection.close(function (err) {
            return;
        });
    };

    function writeNoExisted() {
        console.log("writeNoExisted() is called");
        //res.render("./views/new_todolist.html")
        //res.render('new_todolist.html');
        res.redirect('views/new_todolist.html');

    };

    function writeView(result) {
        console.log("writeView() is called");

        // res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        //res.render("agile_board_test.html")
        req.app.render('new_todolist', result, function (err, html) {
            res.write(html);
        });
        res.end();
    };
})

//todolist show - home
app.get('/edit_priority', function (req, res) {
    console.log("우선순위 수정하기");

    var query = "select priority, title, to_char(deadline,'dd-mm-yy'), status "
        + "from todolist "
        + "order by priority asc";
    console.log(query);
    oracledb.getConnection(dbinfo, function (err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }

        connection.execute(query, function (err, result) {
            if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
            }
            // 결과 쿼리가 존재하지 않을 때
            if (result.rows.length == 0) {
                writeNoExisted();
                console.log('결과쿼리 존재하지 않음');
                return;
            }

            console.log(result.rows[0])
            var content = {
                posts: result.rows
            };
            writeView(content);
        });
    });
    function doRelease(connection, userlist) {
        connection.close(function (err) {
            return;
        });
    };

    function writeNoExisted() {
        console.log("writeNoExisted() is called");
        //res.render("./views/new_todolist.html")
        //res.render('new_todolist.html');
        res.write("입력한 todolist가 없습니다.");

    };

    function writeView(result) {
        console.log("writeView() is called");

        // res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        //res.render("agile_board_test.html")
        req.app.render('edit_priority', result, function (err, html) {
            if (err) {
                console.log(err.message)
            }
            res.write(html);
        });
        res.end();
    };
})



app.get('/detail', function (req, res) {

    res.redirect('validation_test.html')
})
//todolist detail show
app.get('/showdetai_ddddl', function (req, res) {
    console.log("showdetail 경로로 들어옴")
    var parsedUrl = url.parse(req.url);
    var parsedQuery = querystring.parse(parsedUrl.query, '&', '=');
    var pick_title = parsedQuery.title;
    console.log(pick_title);
    var query = "select title, contents, deadline"
        + "from todolist where title='"
        + pick_title + "'";

    console.log(query);

    oracledb.getConnection(dbinfo, function (err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }

        connection.execute(query, function (err, result) {
            if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
            }
            // 결과 쿼리가 존재하지 않을 때
            if (result.rows.length == 0) {
                writeNoExisted();
                console.log('결과쿼리 존재하지 않음');
                return;
            }

            console.log(result.rows[0]);
            var context = {
                result: result.rows[0]
            };
            writeView(context);
        });
    });
    function doRelease(connection, userlist) {
        connection.close(function (err) {
            return;
        });
    };

    function writeNoExisted() {
        console.log("writeNoExisted() is called");

        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('해당사용자가 존재하지 않음');

        res.end();
    };

    function writeView(result) {
        console.log("writeView() is called");

        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        req.app.render('validation_test', result, function (err, html) {
            if (err) {
                console.error(err.message);
                return;
            }
            res.write(html);
        });
        res.end();
    };
})

app.post('/edit_priority_complete', function (req, res) {
    // 디비 연결
    console.log('우선 순위 확인 페이지로 이동');
    var parsedUrl = url.parse(req.url);
    var parsedQuery = querystring.parse(parsedUrl.query, '&', '=');
    var listsize = parsedQuery.listsize;

    var priarray = new Array();
    var titlearray = new Array();
    for (var i = 0; i < listsize; i++) {
        priarray[i] = req.param('priority/' + i);
        titlearray[i] = req.param('title/'+i)
    }

    //var paramet = "priority/"+"1";

    //console.log("파라미터:"+req.param('priority/1'));
    //console.log(req.body);

    oracledb.getConnection(dbinfo,
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }

            console.log('==> todolist 테이블 edit query');

            //var priority = req.body.priority;
            //var status = req.body.status;

            for (var i = 0; i < priarray.length; i++) {
                var beforenum = i+1;

                var query = "update todolist "
                    + "set "
                    + "priority = '" + priarray[i] + "' "
                    + "where priority= '" + beforenum + "' and title='"+titlearray[i]+"'";
                console.log(query);
                connection.execute(query, function (err, result) {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }

                    console.log('Rows Insert: ' + result.rowsAffected);

                    doRelease(connection, result.rowsAffected);
                });
            }

            res.redirect('/show');


        });

    function doRelease(connection, result) {
        connection.close(function (err) {
            if (err) {
                console.error(err.message);
            }
        });
    };
});

//insert
app.post('/insert', function (req, res) {
    var arr = new Array();
    var title = req.param('title');
    var contents = req.param('contents');
    var deadline = req.param('deadline');
    oracledb.getConnection(dbinfo,
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }



            var doconnect = function (cb) {
                oracledb.getConnection({
                    user: dbConfig.user,
                    password: dbConfig.password,
                    connectString: dbConfig.connectString
                }, cb);

                console.log("do connect!!!");
            }
            async.waterfall([doconnect,
                function (conn, cb) {

                    var query = "select count(*) from todolist";
                    conn.execute(query,
                        function (err, result1) {
                            if (err) {
                                console.error(err.message);
                                doRelease(conn);
                                return;
                            }
                            console.log('개수 세는 거 끝');
                            console.log("???" + result1.rows[0]);
                            arr = result1.rows[0];
                            return cb(err, conn);
                        });

                }, function (conn, cb) {
                    // t_order_detail  테이블의 out_yn  값이 N인값의 수
                    console.log("countnum:"+arr[0]);
                    arr[0]++;
                    var query2 = "insert into todolist (num, title, contents, deadline, priority, status) " +
                        "values ('"+arr[0] + "', '" + title + "', '" + contents + "', to_date('" + deadline + "','dd-mm-yy') ,'" +arr[0]+"','N')";

                    conn.execute(query2,
                        function (err2, result2) {
                            if (err2) {
                                console.error(err2.message);
                                doRelease(conn);
                                return;
                            }
                            console.log('Rows Insert: ' + result2.rowsAffected);
                            
                            res.redirect('/show');
                            doRelease(connection, result2.rowsAffected);
                            return cb(err, conn);
                        });

                }], function (err, conn) {
                    if (err) { console.log("In waterfall error : " + err); }
                    
                    if (conn) { doRelease };
                });





            function writeNoExisted() {
                console.log("writeNoExisted() is called");

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                //req.app.render('producer_noexist', function(err, html) {
                //res.write(html);
                res.write('해당사용자가 존재하지 않음');
                //});
                res.end();
            };
        });
})

function doRelease(connection, userlist) {
    connection.close(function(err) {
        if(err) {
            console.error(err.message);
        }
    });
};

//delete
app.get('/delete', function (req, res) {
    var parsedUrl = url.parse(req.url);
    var parsedQuery = querystring.parse(parsedUrl.query, '&', '=');
    var pickpri = parsedQuery.priority;
    
    oracledb.getConnection(dbinfo,
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }

            var doconnect = function (cb) {
                oracledb.getConnection({
                    user: dbConfig.user,
                    password: dbConfig.password,
                    connectString: dbConfig.connectString
                }, cb);

                console.log("do connect!!!");
            }
            async.waterfall([doconnect,
                function (conn, cb) {

                    var query = "delete from todolist where priority='"+pickpri+"'";
                    conn.execute(query,
                        function (err, result1) {
                            if (err) {
                                console.error(err.message);
                                doRelease(conn);
                                return;
                            }
                            console.log('해당 우선순위 삭제하기');
                            return cb(err, conn);
                        });

                }, function (conn, cb) {
                    // t_order_detail  테이블의 out_yn  값이 N인값의 수
                   
                    var query2 = "update todolist "
                    + "set "
                    + "priority = priority-1"
                    + "where priority > '" + pickpri + "'";
                    conn.execute(query2,
                        function (err2, result2) {
                            if (err2) {
                                console.error(err2.message);
                                doRelease(conn);
                                return;
                            }
                            console.log('Rows Update: ' + result2.rowsAffected);

                            res.redirect('/show');
                            doRelease(connection, result2.rowsAffected);
                            return cb(err, conn);
                        });

                }], function (err, conn) {
                    if (err) { console.log("In waterfall error : " + err); }
                    
                    if (conn) { doRelease };
                });





            function writeNoExisted() {
                console.log("writeNoExisted() is called");

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                //req.app.render('producer_noexist', function(err, html) {
                //res.write(html);
                res.write('해당사용자가 존재하지 않음');
                //});
                res.end();
            };
        });
})


app.post('/insert2', function (req, res) {
    // 디비 연결
    var title = req.param('title');
    var contents = req.param('contents');
    var deadline = req.param('deadline');
    //console.log(req.body);

    var arr = new Array();
    oracledb.getConnection(dbinfo,
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }

            var query = "select count(*) from todolist";
            console.log(query)
            connection.execute(query, function (err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }
                console.log('개수 세는 거 끝');
                console.log("???" + result.rows[0]);
                console.log('Rows Insert: ' + result.rowsAffected);
                arr = result.rows[0];
            });
        });

    console.log("countnum :" + arr[0]);


    oracledb.getConnection(dbinfo,
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }

            console.log('==> todolist 테이블 insert query');
            console.log(title + "/" + contents + "/" + deadline)

            //var priority = req.body.priority;
            //var status = req.body.status;

            function today() {

                var date = new Date();

                var year = date.getFullYear();
                var month = date.getMonth() + 1; // 0부터 시작하므로 1더함 더함
                var day = date.getDate();
                var hour = date.getHours();
                var min = date.getMinutes();
                var sec = date.getSeconds();

                month = (("" + month).length == 1) ? ("0" + month) : month;
                day = (("" + day).length == 1) ? ("0" + day) : day;
                hour = (("" + hour).length == 1) ? ("0" + hour) : hour;
                min = (("" + min).length == 1) ? ("0" + min) : min;
                sec = (("" + sec).length == 1) ? ("0" + sec) : sec;
                console.log("date is >> " + year + month + day + hour + min + sec);

                return "" + year + month + day + hour + min + sec;

            }

            var query = "insert into todolist (num, title, contents, deadline, priority, status) " +
                "values (sequence.NEXTVAL" + ", '" + title + "', '" + contents + "', to_date('" + deadline + "','dd-mm-yy') , sequence.NEXTVAL" + ",'N')";

            console.log(query);
            connection.execute(query, function (err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }
                console.log('Rows Insert: ' + result.rowsAffected);

                res.redirect('/show');
                doRelease(connection, result.rowsAffected);
            });
        });

    function doRelease(connection, result) {
        connection.close(function (err) {
            if (err) {
                console.error(err.message);
            }
        });
    };
});

//todolist detail show
app.get('/showdetail', function (req, res) {
    console.log("showdetail 경로로 들어옴")
    var parsedUrl = url.parse(req.url);
    var parsedQuery = querystring.parse(parsedUrl.query, '&', '=');
    var pick_title = parsedQuery.title;
    console.log(pick_title);
    var query = "select title, contents, to_char(deadline,'dd-mm-yy') , status "
        + "from todolist where title='"
        + pick_title + "'";

    console.log("쿼리문 :"+query);

    oracledb.getConnection(dbinfo, function (err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }

        connection.execute(query, function (err, result) {
            if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
            }
            // 결과 쿼리가 존재하지 않을 때
            if (result.rows.length == 0) {
                writeNoExisted();
                console.log('결과쿼리 존재하지 않음');
                return;
            }

            console.log(result.rows[0]);
            var context = {
                result: result.rows[0]
            };
            writeView(context);
        });
    });
    function doRelease(connection, userlist) {
        connection.close(function (err) {
            return;
        });
    };

    function writeNoExisted() {
        console.log("writeNoExisted() is called");

        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('해당사용자가 존재하지 않음');

        res.end();
    };

    function writeView(result) {
        console.log("writeView() is called");

        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        req.app.render('validation_test', result, function (err, html) {
            if (err) {
                console.error(err.message);
                return;
            }
            res.write(html);
        });
        res.end();
    };
})


//todolist detail
app.post('/edit_complete', function (req, res, next) {

    console.log("수정하기");
    //console.log(req);
    var parsedUrl = url.parse(req.url);
    var parsedQuery = querystring.parse(parsedUrl.query, '&', '=');
    var pick_title = parsedQuery.title;
    console.log(pick_title);

    var title = req.body.title;
    var contents = req.body.contents;
    var deadline = req.body.deadline;
    //var status = req.body.status;
    var status = req.body.optionsRadios;

    // 디비 연결
    oracledb.getConnection(dbinfo,
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }

            console.log('==> todolist 테이블 update query');
            var query = "update todolist "
                + "set "
                + "title = '" + title + "', "
                + "contents = '" + contents + "', "
                + "deadline = to_date('" + deadline + "','dd-mm-yy'),"
                + "status ='"+status+"' where title='"+pick_title+"'";
        
            connection.execute(query, function (err, result) {

                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }
                console.log('Rows Update: ' + result.rowsAffected);
                res.redirect('/show');
                doRelease(connection, result.rowsAffected);
            });


        });

    function doRelease(connection, result) {
        connection.close(function (err) {
            if (err) {
                console.error(err.message);
            }

        });
    };
});

//todolist delete
app.post('/delete_complete', function (req, res, next) {

    console.log("삭제하기");
    var title = req.body.title;
    var contents = req.body.contents;
    var deadline = req.body.deadline;
    var status = req.body.status;

    // 디비 연결
    oracledb.getConnection(dbinfo,
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }

            console.log('==> todolist 테이블 delete query');
            var query = "delete from todolist where title ='" + title + "' and contents='" + contents + "' and deadline='" + deadline + "' and priority='" + priority + "' and status ='" + status + "'";

            connection.execute(query, function (err, result) {

                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }
                console.log('Rows Update: ' + result.rowsAffected);

                doRelease(connection, result.rowsAffected);
            });


        });

    function doRelease(connection, result) {
        connection.close(function (err) {
            if (err) {
                console.error(err.message);
            }

        });
    };
});

app.listen(3000, function () {
    console.log("Example app listening on port 3000!");
})

