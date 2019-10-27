module.exports = class Dose {
	// supported doses ['BASAL', 'BOLUS', 'BG', 'CARBS', 'ACT']
	constructor(id, dose, amount, time) {
		this.id = id
		this.dose = dose
		this.amount = amount
		this.time = time
	}
}