// domoOnRoutes.js 0.1.0
// (c) 2012 Mathias Prinz
// is distributed under the MIT license.

!function() {

   typeof module == "object"
       ? module.exports = Route 
       : window.ROUTE = Route 
       ;

   function Route () {
   
      var concat = Array.prototype.concat
        , childNodes = concat.apply( [], arguments )
        , attributes = childNodes.shift()
        , section = domo.SECTION()
        , routeObjects = initRouteObjs()
        ;
      
      function initRouteObjs ( routeObjs ) {
         
         routeObjs = routeObjs || [ { frag:[], dom: section } ]
         
         var obj = routeObjs[ routeObjs.length - 1 ]
           , child = childNodes.shift()
           , isRoute = child instanceof RegExp
           ;
         
         if ( isRoute ) { routeObjs.push( { route: child, dom: section, frag: [] } ); }
         
         else { obj.frag.push( child ); }
         
         if ( ! childNodes.length ) { return routeObjs; } 
         
         return arguments.callee.call( null, routeObjs );
         
      }
      
      function routing ( routeObjs, before, path  ) {
      
         if ( ! routeObjs.length ) {
         
            if ( section.childNodes.length ) { section.innerHTML = ''; }
            section.appendChild( domo.FRAGMENT.apply( domo, concat.apply( before, path ) ) );
            return section;
         }
   
         before = before || []; path = path || [];
   
         var url = typeof attributes === 'string' ?  attributes : attributes.url
           , obj = routeObjs.shift()
           ;
         
         if ( url.apply ) url = url();
         
         if ( ! obj.route ) { before = obj.frag; }
   
         if (  url.search( obj.route ) > -1 ) { path = obj.frag; }
   
         return arguments.callee.call( null, routeObjs, before, path );
   
      }
   
      if ( attributes.routing ) { 
         attributes.routing( function () { return routing.call( null, routeObjects.slice() ); } ); 
      }
   
      return routing.call( null, routeObjects.slice() );
   }
}()
