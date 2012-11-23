require('domo').global();

var ROUTE = require('./domo_on_routes')
  , http = require('http')
  ;

http.createServer(function(req, res) {
  
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
            STYLE.on( 'h1', { backgroundColor: 'yellow' } )
            ,
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
              H1( 'Yellow' )
              ,
            /blue/
            ,
              H1( 'Blue' )
              ,
              A( { href: 'blue/light' }, 'Light Blue' )
              ,
              ' | '
              ,
              A({ href: 'blue/dark' }, 'Dark Blue' )
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
            H1( 'Pink' )
          )//ROUTE
        )//BODY 
      )//HTML
    ).outerHTML 
  );

}).listen( 8080 );

console.log( 'Hello :) Domo is routing now!' );