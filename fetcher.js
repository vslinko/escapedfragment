var phantomProxy = require('phantom-proxy'),
    express = require('express'),
    util = require('util'),
    app = express();

var page;
var project = __dirname + "/../barbudos/dist";

app.get('/', function (req, res) {
    var escapedFragment = req.query['_escaped_fragment_'];

    if (escapedFragment) {
        var url = "http://static.rithis.com/index.html#!" + escapedFragment;

        page.open(url);

        page.on('callback', function (data) {
            var status = 500;
            var content = null;

            if (data.event) {
                switch (data.event) {
                    case 'status':
                        if (data.code) {
                            status = data.code;
                        }
                        break;
                    case 'loaded':
                        status = 200;
                        break;
                }

                if (data.content) {
                    content = data.content;
                }
            }

            res.status(status).send(content);
        });

        page.on('error', function (err) {
            res.status(500);
        });
    } else {
        res.status(404);//.sendfile(project + "/index.html");
    }
});

//app.use(express.static(project));

phantomProxy.create({loadImages: false, debug: true}, function (proxy) {
    page = proxy.page;

    app.listen(3000);
});
