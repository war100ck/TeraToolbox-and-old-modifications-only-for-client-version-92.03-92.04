module.exports = function(u, cb, managercb) {
	u.get(`/manager/*`, managercb)
	u.get(`/api/*`, cb)
}
