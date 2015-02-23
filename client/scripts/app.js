
/*
{
  "createdAt":"2013-10-08T00:31:51.501Z",
  "objectId":"eoR0LBTBmJ",
  "roomname":"",
  "text":"new test",
  "updatedAt":"2013-10-08T00:31:51.501Z",
  "username":"ken"
  }
*/


var app = {};

app.roomsObject = {};

app.friends = {};


var currentRoom = null;

app.init = function(){

  setInterval(app.fetch, 2000);
  app.addFriend("shawndrost");

  $('.submit').on('click', function(){
    app.handleSubmit();
  });
    //checkAndADD
 //   app.addOptions();

 $('.msgSubmit').on('click', function(){
    $('.room').each(function(){
      $(this).parent().show();
    });
 });

  $('#roomSelect').on('change', function(){
    currentRoom = $(this).find('option:selected').text();
    $('.room').each(function(){
      if($(this).text() === currentRoom){
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
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
  }
});
};

app.fetch = function(){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    data: { order: '-createdAt'},
    success: function (data) {
        //console.log(JSON.stringify(data));
        var lastMessage = data.results[0];
        if(mostRecentObjectID = ""){
            mostRecentObjectID = data.results[0].objectID;
        }

        if(lastMessage.objectID !== mostRecentObjectID){
          for(var i = 0; i < data.results.length; i++){
            app.addMessage(data.results[i]);
            if(!app.roomsObject[data.results[i].roomname] && data.results[i].roomname){
              app.roomsObject[data.results[i].roomname] = data.results[i].roomname;
              app.addRoom(data.results[i].roomname);
            }
              //app.checkAndADD(data.results[i].roomname);
          }
          mostRecentObjectID = lastMessage.objectID;
        $('.user').on('click', function(){
          app.addFriend($(this).text());
        });
      }
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
  var objectId = message.objectId;
  var roomName = message.roomname;
  var text = message.text;
  var updatedAt = message.updatedAt;
  var username = message.username;

  var listElement = $('<li></li>').addClass('chat');
  var nameDiv = $('<div></div>').addClass('user').text(username);
  var roomDiv = $('<div></div>').addClass('room').text(roomName);
  var messageDiv = $('<div></div>').addClass('message').text(" Message: " + text);
  listElement.append(nameDiv).append(messageDiv).append(roomDiv);
  if (currentRoom && roomName !== currentRoom) {
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
    if($(this).text() === friend){ // text comparison something wrong
      $(this).css('font-weight', 'bold');
  }});
};

app.handleSubmit = function(){
  var text = $('#message').val();
  var encodedMsg =  encodeURI(text);
  var username = window.location.search;
  var roomname = $('#roomSelect').find('option:selected').text();
  app.send(message);
  //preventDefault();
};





