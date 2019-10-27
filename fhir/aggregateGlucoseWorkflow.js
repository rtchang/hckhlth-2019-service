const https = require('https')
const Config = require('../config.js')
const { FHIR_URL } = Config
const MemberManager = require('../members/memberManager.js')

// the intent of this is to grab things via Fhir
module.exports = class AggregateObservationWorkflow {
	constructor(source) {
		this.source = source || (FHIR_URL + "Observation")
		this.memberManager = new MemberManager()
	}

	execute() {
		fetchData(this.memberManager, source)
			.mapPartials(raw)
	}
}

// example glucose level via https://www.hl7.org/fhir/observation-example-f001-glucose.json.html
/*
{
  "resourceType": "Observation",
  "id": "f001",
  "text": {
    "status": "generated",
    "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: f001</p><p><b>identifier</b>: 6323 (OFFICIAL)</p><p><b>status</b>: final</p><p><b>code</b>: Glucose [Moles/volume] in Blood <span>(Details : {LOINC code '15074-8' = 'Glucose [Moles/volume] in Blood', given as 'Glucose [Moles/volume] in Blood'})</span></p><p><b>subject</b>: <a>P. van de Heuvel</a></p><p><b>effective</b>: 02/04/2013 9:30:10 AM --&gt; (ongoing)</p><p><b>issued</b>: 03/04/2013 3:30:10 PM</p><p><b>performer</b>: <a>A. Langeveld</a></p><p><b>value</b>: 6.3 mmol/l<span> (Details: UCUM code mmol/L = 'mmol/L')</span></p><p><b>interpretation</b>: High <span>(Details : {http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation code 'H' = 'High', given as 'High'})</span></p><h3>ReferenceRanges</h3><table><tr><td>-</td><td><b>Low</b></td><td><b>High</b></td></tr><tr><td>*</td><td>3.1 mmol/l<span> (Details: UCUM code mmol/L = 'mmol/L')</span></td><td>6.2 mmol/l<span> (Details: UCUM code mmol/L = 'mmol/L')</span></td></tr></table></div>"
  },
  "identifier": [
    {
      "use": "official",
      "system": "http://www.bmc.nl/zorgportal/identifiers/observations",
      "value": "6323"
    }
  ],
  "status": "final",
  "code": {
    "coding": [
      {
        "system": "http://loinc.org",
        "code": "15074-8",
        "display": "Glucose [Moles/volume] in Blood"
      }
    ]
  },
  "subject": {
    "reference": "Patient/f001",
    "display": "P. van de Heuvel"
  },
  "effectivePeriod": {
    "start": "2013-04-02T09:30:10+01:00"
  },
  "issued": "2013-04-03T15:30:10+01:00",
  "performer": [
    {
      "reference": "Practitioner/f005",
      "display": "A. Langeveld"
    }
  ],
  "valueQuantity": {
    "value": 6.3,
    "unit": "mmol/l",
    "system": "http://unitsofmeasure.org",
    "code": "mmol/L"
  },
  "interpretation": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
          "code": "H",
          "display": "High"
        }
      ]
    }
  ],
  "referenceRange": [
    {
      "low": {
        "value": 3.1,
        "unit": "mmol/l",
        "system": "http://unitsofmeasure.org",
        "code": "mmol/L"
      },
      "high": {
        "value": 6.2,
        "unit": "mmol/l",
        "system": "http://unitsofmeasure.org",
        "code": "mmol/L"
      }
    }
  ]
}
*/

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
			const userId = (memberManager.getPatientByIdentifier((data.subject || {}).identifier) || {}).userId

			mapPartials(data)
				.forEach(glucoseLevel => {
					const { amount, low, high, interpretation, time } = glucoseLevel
					memberManager.addGlucoseReading(userId, amount, low, high, interpretation, time) 
				})
		})
	})
}

function mapPartials(raw) {
	const time = Math.ceil(new Date(raw.effectivePeriod.start)/1000)+''
	const amount = raw.valueQuantity.value
	const low = ((referenceRange[0] || {}).low || {}).value
	const high = ((referenceRange[0] || {}).high || {}).value
	return {
		amount, time, low, high, interpretation
	}
}