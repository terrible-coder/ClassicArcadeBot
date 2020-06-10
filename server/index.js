const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const TG_TOKEN = process.env.TG_TOKEN;

const app = express();
app.listen(PORT, () => console.log(`Server ready. Listening at port ${PORT}...`));
app.use(express.static("public"));

const tgBase = `https://api.telegram.org/bot${TG_TOKEN}`;

function apiCall(method, options) {
	if(options === undefined) return `${tgBase}/${method}`;
	const params = Object.getOwnPropertyNames(options);
	const query = params.map(p => {
		return {
			param: p,
			value: options[p]
		}
	});
	const query_string = query.map(q => `${q.param}=${q.value}`).join("&");
	return `${tgBase}/${method}?${query_string}`;
}

const url = apiCall("getMe");
fetch(url)
	.then(data => data.json())
	.then(json => {
		if(!json.ok) {
			console.log("Could not connect to the Telegram Bot API. Terminating...");
			process.exit(1);
		} else console.log(`${json.result.username} online.`);
	});

let update_id = -1;
function getUpdates() {
	let url;
	if(update_id == -1) url = apiCall("getUpdates", {limit: 10})
	else url = apiCall("getUpdates", {
		limit: 10,
		offset: update_id
	});
	return fetch(url)
			.then(response => response.json());
}

console.log("Getting updates...");
setInterval(function() {
	if(update_id !== -1)
		console.log(`New id = ${update_id}`);
	getUpdates()
		.then(updates => {
			console.log(updates.result);
			return updates.result;
		})
		.then(result => {
			if(result == undefined || result.length == 0) return;
			update_id = (result[result.length - 1].update_id) + 1;
			result.forEach(update => {
				if(update.message)
					console.log("Got a message.", update);
			});
		});
}, 2000);