module.exports = function notifTest(dispatch) {
	const notifier = dispatch.require ? dispatch.require.notifier : require('tera-notifier')
	
	notifier.notify({
		title: 'Tera Notification',
		message: 'Test Message \r\n Test 2',
		wait:false, 
		sound:'Notification.IM', 
	})
	
}