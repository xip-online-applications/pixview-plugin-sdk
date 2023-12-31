var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 3000;

var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [],
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});