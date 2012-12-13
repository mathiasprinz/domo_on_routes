require('domo').global();

var ROUTE = require('./domo_on_routes')
  , http = require('http')
  , oscarsSentence = 'Oscar Said:, Be,yourself,everyone,else,is,taken,!!!'.split(',')
  , oscarSaid = function() { return H2( oscarsSentence.shift() || 'Oscar is done!' ); }
  ;
  
http.createServer(function( req, res ) {
 console.log( req.url  )
  if ( req.url  === '/favicon.ico') res.end('');
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end( 
    DOCUMENT(
      HTML({ lang: 'en' }
      ,
        HEAD(
          TITLE( 'domo on routes' )
          ,
          STYLE( { type: 'text/css' }
          ,  
            STYLE.on( 'body', { textAlign: "center", fontSize: 24 } )
            ,
            /*ROUTE( req.url
            ,
              /yellow/
              ,
              STYLE.on( 'h1', { backgroundColor: 'yellow' } )
              ,
              /blue/
              ,
              STYLE.on( 'h1', { backgroundColor: 'blue' } )
              ,
              /pink/
              ,
              STYLE.on( 'h1', { backgroundColor: 'pink' } )
              
          )
            ,*/
            
            STYLE.on( 'h2', { backgroundColor: 'grey' } )
          )//STYLE
          )//HEAD
        ,
        BODY(
          A( { href: '/yellow' }, 'Yellow' )
          ,
          ' | '
          ,
          A({ href: '/blue' }, 'Blue' )
          ,
          ' | '
          ,
          A({ href: '/pink' }, 'Pink' )
          ,
          ROUTE( req.url
          ,
            /yellow/
            , 
              oscarSaid
              ,
              H1( 'Yellow' )
              ,
            /blue/
            ,
              oscarSaid
              ,
              H1( 'Blue' ) 
              ,
              A( { href: '/blue/light' }, 'Light Blue' )
              ,
              ' | '
              ,
              A({ href: '/blue/dark' }, 'Dark Blue' )
              ,
              ROUTE( req.url
              ,
                /light/
                ,
                P( 'Light' )
                ,
                /dark/
                ,
                P( 'Dark' )
              )
              ,
            /pink/
            ,
              oscarSaid
              ,
              H1( 'Pink' )
          )//ROUTE
        )//BODY 
      )//HTML
    ).outerHTML 
  
  );

}).listen( 8080 );

console.log( 'Hello :) Domo is routing now on :8080 !' );