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
        , nodeType = attributes.nodeType || domo.SECTION
        , routeDom 
        , lookup 
        ;
      
      
      function matches ( regEx ) { 
      
        var url = typeof attributes === 'string' ? attributes : attributes.url;
        return ( url.apply ? url() : url ).search( regEx ) > -1;
      
      }
      
        
      function routeObj ( route, children, actions ) {
        
       
        if ( ! lookup ) lookup = {};
        if ( lookup.current ) lookup.last = lookup.current;
        
        if ( lookup && lookup[ route ] ) { 
          triggerActionAgain(  lookup[ route ] )
          lookup.current = lookup[ route ]; 
        }
        
        else {
          bindActions( actions, children );
          lookup.current = lookup[ route ] = { route: route, frag: domo.FRAGMENT.apply( domo, children ), actions: actions };
        }
      }
      
      
      function bindActions ( actions, children ) {
        if ( ! actions.length ) return; 
        for ( var i in  actions ) {
          var actionFrag = domo.FRAGMENT.call( domo,  actions[ i ].func )
          children[ actions[ i ].index ] = actionFrag
          actions[ i ].index = concat.apply( [], actionFrag.childNodes )
        }
      }
      
      function triggerActionAgain ( obj ) {
          
          if ( ! obj.actions.length || ! obj.frag.childNodes.length ) return;
          
          var actions = obj.actions;
          var orginFrag = obj.frag
          
          
          for ( var i in actions ) { 
            
            var actionFrag = domo.FRAGMENT.call( domo,  actions[ i ].func );
            var index = actions[ i ].index 
            
            for ( var x in index ) {
              
              var aa =  index[ x ]
              index[ x ] = actionFrag.childNodes[ x ]
              orginFrag.replaceChild( actionFrag.childNodes[ x ] , aa )
            
            }
           
          }
      }
       
      function domSwitch () {
        
        var previousChildren = concat.apply( [], routeDom.childNodes );
        var previous = lookup.last;
        var following = lookup.current; 
        
        if ( following.frag.childNodes.length && following.route ) {
        
          add( routeDom, following.frag );
          add( previous.frag, previousChildren );
        
        }
        
        if ( ! following.route ) add( previous.frag, previousChildren );
        return routeDom;
          
      
      }
      
      function add ( dom, frag ) { 
        
        dom.appendChild( frag instanceof Array ? domo.FRAGMENT.apply( domo, frag ) : frag ); 
      
      }
      
      
      function change () { 
        return ( ! routeDom ? routeDom = nodeType.apply( null, lookup.current.frag.childNodes ) : domSwitch() ); 
      }

            
      function newRoute ( childs, matched ) {
         
         var child = childs.shift();
         var isRegEx = ! child ? true : child instanceof RegExp;
         
         /* fill route object with domo childs*/
        
         
         if ( matched && isRegEx ) {
            
            routeObj.apply( null,  matched ? [ matched.route, matched.childNodes, matched.actions ] : [] ); 
            return change();
            
         }
         
         if ( matched && ! isRegEx && child.apply ) {
           matched.actions.push( { func: child, index: matched.childNodes.length  } )
         }
         
         if ( matched && ! isRegEx ) matched.childNodes.push( child );
         
         if ( isRegEx && matches( child ) && ! matched ) matched = { route: child, childNodes: [], actions: [] };
         
         return arguments.callee( childs, matched );
      
      }//routeing
      
      
      
      // callback
      if ( attributes.routing ) { 
         attributes.routing( function () { return newRoute.call( null, childNodes.slice()); } ); 
      }
      
      return newRoute.call( null, childNodes.slice() );
      

   }
}()
