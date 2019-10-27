const https = require('https')
const Config = require('../config.js')
const { FHIR_URL } = Config
const MemberManager = require('../member/memberManager.js')

// the intent of this is to grab things via Fhir
module.exports = class AggregatePatientWorkflow {
	constructor(source) {
		this.source = source || (FHIR_URL + "Patient")
		this.memberManager = new MemberManager()
	}

	execute() {
		fetchData(this.memberManager, source)
			.mapPartials(raw)
	}
}

// the role of this is to handle the fetch FHIR-enabled endpoint
function fetchData(memberManager, source) {
	const req = https.request({
		hostname: source,
		port: 443,
		method,
		headers: {
			'Content-Type': 'application/json'
		}
	}, (res) => {
		res.on('data', (data) => {
			mapPartials(data)
				.forEach(memberInfo => {
					memberManager.create(memberInfo.name, memberInfo.email, memberInfo.identifier)
				})
		})
	})
}

function mapPartials(raw) {
	const { name, telecom, identifier } = raw
	const fullName = (name[0] || {}).given + ' ' + (name[0] || {}).family
	return {
		name: fullName,
		email: extractEmailIfPossible(telecom),
		identifier: [(identifier[0] || {}).system, (identifier[0] || {}).value].join('::')
	}
}

function extractEmailIfPossible(telecom) {
	var email = null
	if (telecom == null || !(email = telecom.find(val => val.system === 'email'))) {
		return ''
	}

	return email
}