module.exports = class Member {
	constructor(uuid, type, name, email, identifier, birthDate, locale, income, gender) {
		this.uuid = uuid
		this.type = type || 'NONE'	// PATIENT | CARE_TAKER | ADMIN | NONE
		this.name = name
		this.email = email // some email,
		this.identifier = identifier
		this.birthDate = birthDate
		this.locale = locale
		this.income = income
		this.gender = gender
	}
}