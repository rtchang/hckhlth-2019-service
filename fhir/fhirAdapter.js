module.exports = {
	createBasalEntry,
	createBosalEntry
}

function createBasalEntry(patient, uuid, dose) {
	return createDose(patient, "Lantus", uuid, dose)
}

function createBosalEntry(patient, uuid, dose) {
	return createDose(patient, "Humalog", uuid, dose)
}

// example from https://www.hl7.org/fhir/medicationadministration0312.json.html
function createDose(patient, name, uuid, dose) {
	return {
		"resourceType": "MedicationAdministration",
		"id": "medicationadministration0312",
		"identifier": [
			{
			  "use": "casual",
			  "system": "https://hlth.azurewebsites.net/",
			  "value": uuid
			}
		],
		"status": "completed",
		"medicationCodeableConcept": {
		"coding": [
		  {
		    "system": "https://hlth.azurewebsites.net/",
		    "code": uuid,
		    "display": name
		  }
		]
		},
		"subject": {
			"reference": patient.uuid,
			"display": patient.name
		},
		"effectivePeriod": {
			"start": new Date(time)+'',
			"end": new Date(time)+''
		},
		"performer": [
			{
			  "actor": {
			    "reference": patient.uuid,
			    "display": patient.name
			  }
			}
		],
		"request": {
			"reference": "MedicationRequest/" + uuid
		},
		"dosage": {
			"text": "",
			"dose": {
			  "value": dose.amount,
			  "unit": "mL"
			}
		}
}
}