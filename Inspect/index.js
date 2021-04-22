module.exports = function Inspect(mod) {
	mod.hook('S_ANSWER_INTERACTIVE', 2, (event) => {
		mod.send('C_REQUEST_USER_PAPERDOLL_INFO', 3, {
			zoom: false,
			name: event.name
		})
	})
}
