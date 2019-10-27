const MemberManager = require('./memberManager.js')

module.exports = class MemberController {
	constructor(app) {
		this.app = app
		this.memberManager = new MemberManager()
	}

	getUser() {
		this.app.get('/api/member', (req, res) => {
			const user = this.memberManager.getUser('fake')
			res.send(JSON.stringify(user));
		});
	}

	getUserDashboard() {
		this.app.get('/api/member/:userId/dashboard', (req, res) => {
			const params = req.params
			const { userId } = params

			const card = this.memberManager.getUserDashboard(userId)

			res.send(JSON.stringify(card));
		})
	}

	getTimeline() {
		this.app.get('/api/member/:userId/timeline', (req, res) => {
			const params = req.params
			const { userId } = params

			const timeline = this.memberManager.getTimeline(userId)

			res.send(JSON.stringify(timeline));
		})
	}

	getDoses() {
		this.app.get('/api/member/:userId/dose', (req, res) => {
			const { userId } = req.params
			const doses = this.memberManager.getDoses(userId)

			res.send(JSON.stringify(doses));
		})
	}

	addDose() {
		this.app.post('/api/member/:userId/dose', (req, res) => {
			const params = req.params
			const { userId } = params
			const { dose, amount } = req.body

			console.log(dose, amount)

			try {
				this.memberManager.addDose(userId, dose, amount)
			} catch (exception) {
				res.status(404).end()
				return
			}

			res.sendStatus(200)
		})
	}

	updateDose() {
		this.app.put('/api/member/:userId/dose/:doseId/amount', (req, res) => {
			const params = req.params
			const { userId, doseId } = params
			const { amount } = req.body

			try {
				this.memberManager.updateDose(userId, doseId, amount)
			} catch (exception) {
				res.status(404).end()
				return
			}

			res.sendStatus(200)
		})
	}

	removeDose() {
		this.app.delete('/api/member/:userId/dose/:doseId', (req, res) => {
			const params = req.params
			const { userId, doseId } = params

			try {
				this.memberManager.removeDose(userId, doseId)
			} catch (exception) {
				res.status(404).end()
				return
			}

			res.sendStatus(200)
		})
	}
}