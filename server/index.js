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
	.then(json => console.log(json));