module.exports = class Member {
	constructor(uuid, type, name, email, identifier) {
		this.uuid = uuid
		this.type = type || 'NONE'	// PATIENT | CARE_TAKER | ADMIN | NONE
		this.name = name
		this.email = email // some email,
		this.identifier = identifier
	}
}