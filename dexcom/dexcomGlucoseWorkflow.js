const https = require('https')

// TODO(actually have member permission to support OAuth properly)
// going to not commit my token...
const STUB_TOKEN = ''

module.exports = class DexcomGlucoseWorkflow {
	constructor(memberManager) {
		this.memberManager = memberManager
	}

	execute(userId, startDate, endDate) {
		fetchData(this.memberManager, startDate, endDate)
			.mapPartials(raw)
			.then(glucoseReadings => {
				const { amount, low, high, interpretation, time } = glucoseReadings
				memberManager.addGlucoseReading(userId, amount, low, high, interpretation, time)
			})
	}
}

function fetchData(memberManager, startDate, endDate) {
	return new Promise((resolve, reject) => {
		var options = {
		  "method": "GET",
		  "hostname": "api.dexcom.com",
		  "port": null,
		  "path": `/v2/users/self/devices?startDate=${startDate}&endDate=${endDate}`,
		  "headers": {
		    "authorization": `Bearer ${STUB_TOKEN}`,
		  }
		};

		var req = http.request(options, function (res) {
		  var chunks = [];

		  res.on("data", function (chunk) {
		    chunks.push(chunk);
		  });

		  res.on("end", function () {
		    var devices = Buffer.concat(chunks);
		    resolve(devices.devices)
		  });
		});

		req.end();
	})
}

function mapPartials(memberManager, devices) {
	const { alertScheduleList } = devices

	alertScheduleList
		.filter(a => a.value)
		.filter(b => !['outOfRange', 'noReadings'].includes(b.alertName))
		.map(glucoseReading => ({
			amount: glucoseReading.value,
			interpretation: glucoseReading.alertName,
			time: glucoseReading.systemTime,
			low: amount,
			high: amount
		}))
}


