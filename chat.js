var socket = io.connect( location.protocol + "//" + location.host + "/chat" );

socket.on( 'connect', function( message ) {
  console.log( "connection" );
  var randomN = parseInt( Math.random() * 100 );
  nickname = "Guest" + randomN;
  socket.emit( 'join' , { nickname: nickname, name: "", surname: "" });
  console.log( 'Guest ' + randomN );
});

socket.on( 'message', function ( data ) {
  
  var date = new Date( data.date );
  
  var chat = $( "#chat" );
	
  // # create elem
  var messageBox = $( "<div>", { class: "message-box clear"} );
  var messageEl = $( "<div>", { class: "message", html: data.message } );
  var dateEl = $( "<div>", { class: "date", html: date.toUTCString() } );
  var senderEl = $( "<div>", { class: "utente", html: data.user.nickname } );

  messageBox.append( senderEl, messageEl, dateEl );
  chat.append( messageBox );

});

socket.on( 'update-people', function( people ) {
  
  var onlineuserEl = $( "#onlineusers" );
  onlineuserEl.empty();
  $.each( people, function( id, user ) {
    var statusEl = $( "<div>", { class: "status", html: user.nickname, "data-id": id } );
    onlineuserEl.append( statusEl );
  });
});

	
var message = "";
function sendMessage() {  //da lanciare al click sul bottone di invio messaggio
  message = $( "#testo" ).val();
  // # not send when message is empty 
  if( message == "" ) {
    return false;
  }
  
	socket.emit( 'message', { message: message });  //prelevare il messaggio dalla textarea e passarlo alla funzione
  message.value = "";
  
  $( "#testo" ).val( "" );
}