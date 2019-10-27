const Dao = require('./dao.js')

module.exports = class DoseDao extends Dao {
	constructor(client, url) {
		super(client, url)
	}
}