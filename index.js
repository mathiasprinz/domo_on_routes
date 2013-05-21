require('domo').global();

var ROUTE = require('./domo_on_routes')
  , http = require('http')
  , oscarsSentence = 'Oscar Said:, Be,yourself,everyone,else,is,taken,!!!'.split(',')
  , oscarSaid = function() { return H2( oscarsSentence.shift() || 'Oscar is done!' ); }
  , showRoute = function ( route ) { 
    
     return DIV( H2( route ),  P( (route === "123" ? 'A' : 'B') ) );
    };
  
http.createServer(function( req, res ) {
 
  if ( req.url  === '/favicon.ico') res.end('');
  
  console.log( '?', req.url )
  res.writeHead( 200, { "Content-Type": "text/html" })
  res.end( 
    DOCUMENT(
      HTML({ lang: 'en' }
      ,
        HEAD(
          META( { name:"google-site-verification", content: "7aT55AVfOUFHoresHs0hBMTEU7ZPrMNzrX04Duw-J4s" } )
          ,
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
          A( { href: '/123' }, 'numberA' )
          ,
          ' | '
          ,
          A( { href: '/321' }, 'numberB' )
          ,
          ' | '
          ,
          
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

            /[0-9]{3}/g
            ,
              'number: '
              , 
              showRoute 
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
             , 
            /([a-z,A-Z,0-9]*.)/
              ,
              H1( '404 - State doesn\'t exist' )

          )//ROUTE
        )//BODY 
      )//HTML
    ).outerHTML 
  
  );

}).listen( 8080 );

console.log( 'Hello :) Domo is routing now on :8080 !' );