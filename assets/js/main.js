(function() {

  // Socket.IOに接続
  var socket = window.io.connect();
  var currentThread;

  socket.on('connect', function() {
    // 以下の処理はSocket.IOのconnectメッセージ受信後(接続確立後)
    // に行わないと失敗する

    socket.on('thread', function(thread) {
      if (thread.verb == "updated" && thread.data.model == 'message') {

        $("#chat-timeline").append('<li>' + thread.data.body.text + '</li>');
      }
    });
  });

  $('#chat-send-button').on('click', function() {
    if (!currentThread) return;

    var $text = $('#chat-textarea');

    var msg = $text.val();

    socket.post("/message", {
      text: msg,
      thread_id: currentThread.id
    }, function(res) {
      $text.val('');
    });
  });

  $('#thread-create-button').on('click', function() {
    var $text = $('#thread-form');

    var title = $text.val();

    socket.post("/thread", {
      title: title
    }, function(res) {
      $('#current-thread').text("in " + res.title);
      getMessages(res.id);
      currentThread = res;
      $text.val('');
    });
  });

  var getMessages = function(threadId) {
    socket.get("/message", {thread_id: threadId}, function(messages) {
      for (var i = 0; i < messages.length; i++) {
        $("#chat-timeline").append('<li>' + messages[i].text + '</li>');
      }
    });
  }
})();
