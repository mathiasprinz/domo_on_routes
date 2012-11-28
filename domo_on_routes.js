// domoOnRoutes.js 0.1.0
// (c) 2012 Mathias Prinz
// is distributed under the MIT license.



! function () {

   typeof module == "object"
        ? module.exports = Route 
        : window.ROUTE = Route 
        ;

   function Route () {
   
      var concat = Array.prototype.concat
        , childNodes = concat.apply( [], arguments )
        , attributes = childNodes.shift()
        , lookup 
        ;
      
      function matches ( regEx ) { 
         var url = typeof attributes === 'string' ?  attributes : attributes.url;
         if ( url.apply ) { url = url(); }
         return url.search( regEx ) > -1;
      }
      
      function routing ( childs, matched ) {
         
         if ( ! childs.length ) {
            matched = matched || { frag:[ domo.TEXT('') ] };
         }
         
         var child = childs.shift()
           , isRegEx = ! child ? true : child instanceof RegExp
           ;
         
         if ( matched && ! isRegEx ) {
            matched.frag.push( child );
         } 
         
         if ( matched && isRegEx || matched && ! childs.length  ) {
            
            
            if ( ! lookup ) {
              
             var frag = domo.FRAGMENT.apply( domo, concat.apply( [], matched.frag ) ) 
              lookup = {}
              lookup[ matched.route ] = {  route: matched.route, children: concat.apply( [], frag.childNodes ), frag: frag  }; 
              lookup.current = lookup[ matched.route ] 
              return lookup[ matched.route ].frag;
               
            } 
            else  {
               if ( matched.route ===  lookup.current.route  ) return;
               
               var frag = lookup[ matched.route ] && lookup[ matched.route ].frag ? lookup[ matched.route ].frag : domo.FRAGMENT.apply( domo, concat.apply( [], matched.frag ) );
               var parent = lookup.current.children[ 0 ].parentNode; 
               var first = lookup.current.children[ 0 ]
               
               lookup[ matched.route ] = { route: matched.route, children: concat.apply( [], frag.childNodes ) , frag: frag }; 
               
               parent.insertBefore( frag, first )
               
               lookup.current.frag = domo.FRAGMENT.apply( domo, lookup.current.children  );
                 
               lookup.current = lookup[ matched.route ] 
              
            }
            
            return;
  
         }
          
        
         
         if ( isRegEx && matches( child ) && ! matched ) {
            matched = { route: child, frag: [] }
         }
         
     
         
         return arguments.callee( childs, matched );
         
      
      }
      
      if ( attributes.routing ) { 
         attributes.routing( function () { return routing.call( null, childNodes.slice()); } ); 
      }
      
      return routing.call( null, childNodes.slice() );
      

   }
}()
