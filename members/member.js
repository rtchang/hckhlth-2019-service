module.exports = class Member {
	constructor(id, type, name, email, identifier, birthDate, locale, income, gender) {
		this.id = id
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