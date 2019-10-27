module.exports = class MemberController {
	constructor(app, memberManager) {
		this.app = app
		this.memberManager = memberManager
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

	addEvent() {
		this.app.put('/api/member/:userId/timeline', (req, res) => {
			const params = req.params
			const { userId } = params
			const { name, time } = req.body		

			try {
				this.memberManager.addEvent(userId, name, time)
			} catch (exception) {
				res.status(404).end()
				return
			}

			res.sendStatus(200)
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

	likeEvent() {
		this.app.put('/api/member/:userId/like', (req, res) => {
			const params = req.params
			const { userId } = params

			const { forUserId, eventId } = req.body			

			try {
				this.memberManager.likeEvent(userId, forUserId, event)
			} catch (exception) {
				res.status(404).end()
				return
			}

			res.sendStatus(200)
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

	updateIncome() {
		this.app.put('/api/member/:userId/income', (req, res) => {
			const params = req.params
			const { userId } = params
			const { amount } = req.body

			this.memberManager.updateIncome(userId, amount)
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

	getPeerMetrics() {
		this.app.get('/api/member/:userId/peers', (req, res) => {
			const params = req.params
			const { userId } = params

			const metrics = this.memberManager.getPeerMetrics(userId)
			res.send(JSON.stringify(metrics));
		})
	}
}