var mysql = require( "mysql" );

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : ''
});

connection.connect();

connection.query('CREATE DATABASE IF NOT EXISTS chat', function ( err ) {
    if ( err ) throw err;
  
    connection.query('USE chat', function (err) {
        if ( err ) { throw err; }
        connection.query('CREATE TABLE IF NOT EXISTS users('
            + 'id INT NOT NULL AUTO_INCREMENT,'
            + 'PRIMARY KEY(id),'
            + 'name VARCHAR(30)'
            +  ')', 
            function ( err ) {
              if ( err ) { throw err; 
            }
        });
      
        connection.query('CREATE TABLE IF NOT EXISTS log('
            + 'id INT NOT NULL AUTO_INCREMENT,'
            + 'PRIMARY KEY(id),'
            + 'userid INT NULL,'
            + 'message VARCHAR(100) NOT NULL'            
            +  ')', 
            function ( err ) {
              if ( err ) { throw err; 
            }
        });
    });
  
    /*connection.query('INSERT INTO users ( name ) values ( "khurram" ) ', function (err) {
        if ( err ) { throw err; }
        console.log( "inserimento avvenuto" );
    });
    connection.query('INSERT INTO log ( userid, message  ) values ( 1, "testo di prova" ) ', function (err) {
        if ( err ) { throw err; }
        console.log( "inserimento avvenuto" );
    });*/
    
    connection.query('SELECT * FROM users u JOIN log l ON u.id = l.userid', function( err, rows, fields ) {
        if ( err ) { throw err; }
        console.log( rows );
        console.log( fields );
    });
});

//connection.end();