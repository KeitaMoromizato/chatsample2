/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	find: function(req, res) {
		console.log("GET /message");

		var threadId = req.param('thread_id');
		console.log(threadId);

		Message.find({thread: threadId}).exec(function(err, messages) {
			res.json(messages);
		});
	},

	create: function(req, res){
		console.log("POST /message");

		var text = req.param('text');
		var threadId = req.param('thread_id');

		Message.create({thread: threadId, text: text}).exec(function(err, message) {
			Thread.publishUpdate(message.thread, {
				model: 'message',
				body: message
			});
			res.json(message);
		});
	}
};
