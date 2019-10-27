const Member = require('./member.js')
const Dose = require('./dose.js')
const FhirAdapter = require('../fhir/fhirAdapter.js')
const https = require('https')
const Config = require('../config.js')
const { FHIR_URL } = Config

module.exports = class MemberManager {
	constructor() {
		// some initial data, for production this should be moved to a more permanent store
		this.doses = {
			'fake': {
				'69547604-8fba-4130-a6c8-81edbe5053ea': new Dose('69547604-8fba-4130-a6c8-81edbe5053ea', 'BOLUS', '10', '1572048000'),
				'9dccc31b-b7d2-4d53-a2c9-dead88bab929': new Dose('9dccc31b-b7d2-4d53-a2c9-dead88bab929', 'BG', '126' ,'1572048014400'),
				'f1f97af3-64c3-41c6-ba65-eea924f99dc2': new Dose('f1f97af3-64c3-41c6-ba65-eea924f99dc2', 'BOLUS', '19', '1572048028800'),
				'3c86b7e4-8d96-45b9-ae8d-d50d1eac6e65': new Dose('3c86b7e4-8d96-45b9-ae8d-d50d1eac6e65', 'BG', '242', '1572048028800'),
				'0e754072-905d-4fd3-88f5-60215b7de1b8': new Dose('0e754072-905d-4fd3-88f5-60215b7de1b8', 'CARBS', '60', '1572048028800'),
				'1b338bc0-3299-45b1-9c64-e02f309e7da4': new Dose('1b338bc0-3299-45b1-9c64-e02f309e7da4', 'BG', '317', '1572048032400'),
				'9b3aed09-fbba-4332-a65b-6846b8359691': new Dose('9b3aed09-fbba-4332-a65b-6846b8359691', 'BG', '134', '1572048046800'),
				'0f77984b-0ecd-46d6-9cea-c7d436d6ab63': new Dose('0f77984b-0ecd-46d6-9cea-c7d436d6ab63', 'CARBS', '5', '1572048046800'),


				'1f91f11a-6731-4a59-96d2-7c2af1890ea4': new Dose('1f91f11a-6731-4a59-96d2-7c2af1890ea4', 'BG', '138', '1572048050400'),
				'410e02ee-72cd-45f0-a5be-eceb0917542e': new Dose('410e02ee-72cd-45f0-a5be-eceb0917542e', 'BASAL', '15', '1572048050400'),
				'b1e9cce2-be40-4015-9e77-48e1e9c7360f': new Dose('b1e9cce2-be40-4015-9e77-48e1e9c7360f', 'BOLUS', '18', '1572048050400'),
				'66b31f17-4c5b-45f2-9b24-a170918a3b9e': new Dose('66b31f17-4c5b-45f2-9b24-a170918a3b9e', 'CARBS', '70', '1572048050400'),

				'27a3e7a3-a8a6-4db7-a9bc-81feb32ad9fa': new Dose('27a3e7a3-a8a6-4db7-a9bc-81feb32ad9fa', 'BG', '149', '1572048064800'),

				'59fc4c86-9cd3-447f-b12d-ae28fe16b2e1': new Dose('59fc4c86-9cd3-447f-b12d-ae28fe16b2e1', 'BG', '216', '1572048068400'),
				'7fab5560-63a7-40e8-a24c-6755b87ff5e2': new Dose('7fab5560-63a7-40e8-a24c-6755b87ff5e2', 'BASAL', '18', '1572048068400'),
				'827b1cf3-f75b-447d-9b67-edae6cf5ff3f': new Dose('827b1cf3-f75b-447d-9b67-edae6cf5ff3f', 'CARBS', '20', '1572048068400'),

				'03ae4f96-18c0-411b-a01c-7d95c1fda483': new Dose('03ae4f96-18c0-411b-a01c-7d95c1fda483', 'BG', '233', '1572048072000'),

				'ae25c3ad-6b9c-4ff4-86e7-53058639aee4': new Dose('ae25c3ad-6b9c-4ff4-86e7-53058639aee4', 'BG', '133', '1572048075600'),
			}
		}

		this.patients = {
			'fake': new Member('fake', 'PATIENT', 'Neil Gandhi', 'super-amazing-person@test.com')
		}

		this.externalIdentifiers = {

		}

		this.dashboard = {
			'fake': {
				'hba1c': 8.1,
				'glucose_average': 186,
				'glucose_deviation': 71,
				'hypos': '4%',
				'hypers': '51%',
				'hypo': '80',
				'hyper': '180'
			}
		}

		this.glucose = {
			'fake': {

			}
		}

		this.timeline = {
			'fake': [{
				id: 5,
				name: 'Doctor Appointment',
				time: 1572150138,
				likes: {}
			}, {
				id: 1,
				name: 'Like Honey Badger Badge',
				time: 1571545338,
				likes: {}
			}]
		}
	}

	createPatient(name, email, identifier) {
		const userId = uuidv4()
		const user = new Member(userId, 'PATIENT', name, email || '', identifier)
		this.patients[userId] = user

		if (identifier != null) {
			this.externalIdentifiers[identifier] = user
		}
	}

	getPatientByIdentifier(identifier) {
		return this.externalIdentifiers[identifier]
	}

	getUser(userId) {
		return this.patients[userId]
	}

	getUserDashboard(userId) {
		return this.dashboard[userId]
	}

	getTimeline(userId) {
		return this.timeline[userId]
	}

	addEvent(userId, name, time) {
		const timeline = this.timeline[userId]

		if (timeline == null) {
			throw new Exception("Timeline for user " + userId + " not found")
		}

		timeline.push({
			id: uuidv4(),
			name,
			time,
			likes: {}
		})
	}

	likeEvent(fromUserId, forUserId, eventId) {
		const userTimeline = this.timeline[forUserId]
		if (userTimeline == null) {
			throw new Exception("User " + forUserId + " not found")
		}

		const event = userTimeline[eventId]

		if (event == null) {
			throw new Exception("Event " + eventId + " not found")
		}

		event.likes[fromUserId] = true
	}

	getDoses(userId) {
		return this.doses[userId]
	}

	addDose(userId, dose, amount) {
		if (!['BASAL', 'BOLUS', 'BG', 'CARBS', 'ACT'].includes(dose)) {
			throw new Exception("Dose " + dose + " not supported")
		}

		const id = uuidv4()
		const dose = this.doses[userId][id] = new Dose(id, dose, amount, Date.now()/1000)

		const payload = getDoseFhir()
		handleFhir('POST', 'MedicationAdministration', payload)
	}

	updateDose(userId, doseId, amount) {
		const userDoses = this.doses[userId]
		if (userDoses == null) {
			throw new Exception("Dose " + doseId + " not found")
		}

		if (userDoses[doseId].amount == null) {
			return
		}

		userDoses[doseId].amount = amount
	}

	removeDose(userId, doseId) {
		const userDoses = this.doses[userId]
		if (userDoses == null) {
			throw new Exception("Dose " + doseId + " not found")
		}

		delete this.doses[userId][doseId]
	}

	addGlucoseReading(userId, amount, low, high, interpretation, time) {
		this.glucose[userId] = {
			id: uuidv4(),
			amount, low, high, interpretation, time
		}
	}
}

function getDoseFhir() {
	if (dose === 'BASAL') {
		return FhirAdapter.createBasalEntry(patient, uuidv4(), dose)
	} else if (dose === 'BOLUS') {
		return FhirAdapter.createBolusEntry(patient, uuidv4(), dose)
	} else {
		return null
	}
}

// TODO(fully test this against real data)
function handleFhir(method, path, payload) {
	const req = https.request({
		hostname: FHIR_URL + path,
		port: 443,
		method,
		headers: {
			'Content-Type': 'application/json'
		}
	})

	req.on('error', console.error)
	payload && req.write(payload)
	req.end()
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}