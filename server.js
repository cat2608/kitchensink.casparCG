const fs = require('fs')
const http = require('http')
const path = require('path')
const port = 4000

const { CasparCG } = require('casparcg-connection');
var connection = new CasparCG();


const requestHandler = (request, response) => {
	let body = '';

	request.on('data', (chunk) => {
		body += chunk;
	});

	request.on('end', () => {

		let data = body.toString('base64');

		if (request.url.match(/update/)) {
			connection.cgUpdate(1, 20, 1, data);
			response.end(JSON.stringify({ msg: 'ok' }));

		} else if (request.url.match(/start/)) {
			connection.play(1, 10, data.title, true, 'SLIDE', 50, 'EaseInOutQuad', 'RIGHT');

		} else {
			response.writeHead(200, { 'Content-Type': 'text/html' });
			fs.createReadStream('index.html').pipe(response);
		}
	});
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('Error:', err)
  }
  console.log(`Server ${port}`)
})
