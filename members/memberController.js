module.exports = class MemberController {
	constructor(app) {
		this.app = app
	}

	getUser() {
		this.app.get(`api/member`, (req, res) => {
			res.send(JSON.stringify(new Member('fake', 'PATIENT', 'Neil Gandhi', 'super-amazing-person@test.com')));
		});
	}

	getUserDashboard() {
		this.app.get(`api/member/:userId/dashboard`, (req, res) => {
			res.send(JSON.stringify({}));
		})
	}
}