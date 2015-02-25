

/*var message = {
  "createdAt":"2013-10-08T00:31:51.501Z",
  "objectId":"eoR0LBTBmJ",
  "roomname":"",
  "text":"new test",
  "updatedAt":"2013-10-08T00:31:51.501Z",
  "username":"ken"
  };*/


var app = {};
app.roomsObject = {};
app.friends = {};
app.OID = {};
app.currentRoom = null;

app.init = function(){

  setInterval(app.fetch, 2000);
  //app.send(message);
  //app.addFriend("shawndrost");
  //app.send(app.test);
  $('.submit').on('click', function(){
    app.handleSubmit();
  });

 $('.msgSubmit').on('click', function(){
    $('.room').each(function(){
      $(this).parent().show();
    });
 });

  $('#roomSelect').on('change', function(){
    app.currentRoom = $(this).find('option:selected').text();
    $('.room').each(function(){
      if($(this).text() === app.currentRoom){
        $(this).parent().show();
      }else{
        $(this).parent().hide();
      }
    });
  });

};

app.send = function(message){
  $.ajax({
  // always use this url
  url: 'http://127.0.0.1:3000/classes',
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
  },
  error: function (data) {
    console.error('chatterbox: Failed to send message');
  }
});
};

app.fetch = function(){
  $.ajax({
    url: 'http://127.0.0.1:3000/classes',
    type: 'GET',
    contentType: 'application/json',
    //data: { order: '-createdAt'},
    success: function (data) {
      for(var i = 0; i < data.results.length; i++){
        if(!app.OID[data.results[i].objectID]){
          app.OID[data.results[i].objectID] = data.results[i].objectID;
          app.addMessage(data.results[i]);
          if(!app.roomsObject[data.results[i].roomname] && data.results[i].roomname){
            app.roomsObject[data.results[i].roomname] = data.results[i].roomname;
            app.addRoom(data.results[i].roomname);
          }
        }
      }
      $('.user').on('click', function(){
        app.addFriend($(this).text());
      });
    },
    error: function(){('chatterbox: Failed to fetch message');
    }
  });
};

app.clearMessages = function(){
  $('#chats').empty();
};

app.addMessage = function(message){
  var createdAt = message.createdAt;
  var objectID = message.objectID;
  var roomName = message.roomname;
  var text = message.text;
  var updatedAt = message.updatedAt;
  var username = message.username;

  var listElement = $('<li></li>').addClass('chat');
  var nameDiv = $('<div></div>').addClass('user').text(username);
  var roomDiv = $('<div></div>').addClass('room').text(roomName);
  var messageDiv = $('<div></div>').addClass('message').text(" Message: " + text);
  listElement.append(nameDiv).append(messageDiv).append(roomDiv);
  if (app.currentRoom && (roomName !== app.currentRoom)) {
    listElement.hide();
  }

  if(app.friends[username]){
    nameDiv.css('font-weight', 'bold');
  }

  $("#chats").append(listElement);
 };

app.addRoom = function(checkRoom){
    var option = $('<option></option>').text(checkRoom);
    $('#roomSelect').append(option);
 };

app.addFriend = function(friend){
  app.friends[friend] = friend;
  $('.user').each(function(){
    if($(this).text() === friend){ 
      $(this).css('font-weight', 'bold');
  }});
};

app.handleSubmit = function(){
  var t = new Date();
  var message = {};
  message.createdAt = t.getFullYear() + '-' + (t.getMonth()+1) + '-' + t.getDate() + 'T' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds() + '.' + t.getMilliseconds() + 'z';
  message.text = $('#message').val();
  message.username = window.location.search.substr(10);
  message.roomname = $('#roomSelect').find('option:selected').text();
  app.send(message);
};





