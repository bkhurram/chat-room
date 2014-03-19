var http = require('http');
var port = process.env.PORT || 3000;
var host = process.env.HOST || '0.0.0.0';
var url = require("url");
var path = require("path");

var app = http.createServer( handler );
var io = require( "socket.io" ).listen( app );
var fs = require( "fs" );
var mime = require( "mime" );

var people = {}; //[];
var user = {};
var messageObj = {};

// # use database 
//require( "./database" );

app.listen( port, host );

function handler(req, res) {
  
  var uri = url.parse( req.url, true );
  var filename = path.join( ".", uri.pathname );
  
  fs.readFile( filename, function ( err, data ) {
    
    if( err ) {
      res.writeHead( 500 );
      console.log( err );
      return res.end( "Error loading file " + filename );
    }
    
    res.writeHead( 200, "Content-Type: " + mime.lookup( filename ) );
    res.end( data );
    
  })
}

var chat = io.of( "/chat" );

chat.on( 'connection', function ( client ) {
  
  //  reset
  user = {};
  messageObj = {};
  
  // # ON SEND MESSAGE
  client.on( 'message', function ( data ) {
    
    // reset
    messageObj = {};
    
    // # send data to client
    //client.send( data );
    console.log( "MESSAGE" );
    console.log( data );
    
    user = people[ client.id ];
    messageObj = {
        user: user,
        message: data.message,
        date: new Date()
    };
    
    chat.emit( 'message', messageObj );

    // # server log
    console.log( data );
  });
  
  // # UPDATE PEOPLE
  client.on( 'people', function( data ) {
    chat.emit( "message", messageObj );
  });
  
  // # ON JOIN ROOM
  client.on( 'join', function( data ) {
      // set user info
      user.name = data.name;
      user.surname = data.surname;
      user.nickname = data.nickname;
      
      // add user
      people[ client.id ] = user;
      messageObj = {
        user: user,
        message: "",
        date: new Date()
      };
      
      messageObj.message = data.nickname + " has joined the server."
      client.broadcast.emit( "message", messageObj );
      
      messageObj.message = "You have connected to the server.";
      client.emit( "message", messageObj );
    
      // # update user list
      chat.emit( "update-people", people );
    
      console.log( "utente connesso" );
  });
  
  // # ON DISCONNECT
  client.on( 'disconnect', function() {
    
    user = people[ client.id ];
    
    messageObj = {
        user: user,
        message: user.nickname + " has left the chat room.",
        date: new Date()
    };
    
    client.broadcast.emit( "message", messageObj );
    
    // # remove user
    delete people[ client.id ];
    
    // # update user list
    chat.emit( "update-people", people );
    
    console.log( "utente disconnesso" );
    
  });

});

console.log( "Server running at " + host + ":" + port );
