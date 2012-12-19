// domoOnRoutes.js 0.1.0
// (c) 2012 Mathias Prinz
// is distributed under the MIT license.

  ! function () {

    typeof module == "object"
         ? module.exports = Route
         : window.ROUTE = Route
         ; 

      function Route () {
        
        var childNodes = copy( arguments )
          , attributes = childNodes.shift()
          , nodeType = attributes.nodeType || domo.SECTION
          , match = null
          , DOMstate 
          , lookup 
          ;
          
      // helps to make a copy
      // concat = Array.prototype.concat
      // concat.apply( [], element.childNodes ) made problems with adroid native browser
      function copy ( arr ) {
        
        var first = []
          , l = arr.length
          , i = 0
          ;
      
        for ( ; i < l; i++ ) { first[ i ] = arr[ i ]; }
        
        return first;
      
      }
      
      // url can be set in attributes obj as { url: string } or instead of the attributes obj. 
      function getUrl () {
        
        var url = typeof attributes === 'string' ? attributes : attributes.url;
        return ( url.apply ? url() : url );
      
      } 
      
      // take a look on a string ( url ) if a regular expression is part of it 
      function matches ( regEx ) { 
      
        match = getUrl().match( regEx );
        
        // norm match output
        if ( match ) match = match[ 0 ];
        
        return typeof match === 'string';
      
      }
      
      // insert state as object to the lookup table 
      function manageLookup ( route, children, actions ) {
        
        var nameSpace = route.join( '-' );
        
        if ( ! lookup ) lookup = {};
        if ( lookup.current ) lookup.previous = lookup.current;
        
        // state is already in in the lookup table 
        if ( lookup && lookup[ nameSpace ] ) { 
          
          triggerActionAgain( lookup[ nameSpace ] );
          lookup.current = lookup[ nameSpace ]; 
        
        }
        
        // new state
        else {
        
          bindActions( actions, children );
          lookup.current = lookup[ nameSpace ] = { route: route, frag: domo.FRAGMENT.apply( domo, children ), actions: actions };
        
        }
      }
      
      function bindActions ( actions, children ) {
      
        if ( ! actions.length ) return; 
      
        for ( var i in  actions ) {
          var actionFrag = domo.FRAGMENT.call( domo,  actions[ i ].func( match ) )
          children[ actions[ i ].index ] = actionFrag
          actions[ i ].index = copy(actionFrag.childNodes) 
        }
      
      }
      
      function triggerActionAgain ( obj ) {
        
        if ( ! obj.actions.length || ! obj.frag.childNodes.length ) return;
          
        var actions = obj.actions;
        var i = 0;
        var l = actions.length;
       
        for ( ; i < l; i++ ) { refreshAction(  actions[ i ], obj.frag ); }
      
      }
      
      function refreshAction ( actions, orginFrag ) {
        
        var actionFrag = domo.FRAGMENT.call( domo,  actions.func( match ) );
        var index = actions.index;
        var i = 0;
        var l = index.length;
        var refresh = function ( i ) {
          var child =  index[ i ];
          index[ i ] = actionFrag.childNodes[ i ];
          orginFrag.replaceChild( actionFrag.childNodes[ i ], child );
        }
        
        for ( ; i < l; i++ ) { refresh( i ); }  

      }      
       
      function switchInDom () {
        
        var previousChildren = copy( DOMstate.childNodes ) ;
        var previous = lookup.previous;
        var following = lookup.current; 
        
        if ( following.frag.childNodes.length && following.route ) {
          
          add( DOMstate, following.frag );
          add( previous.frag, previousChildren );
        
        }
      
        if ( ! following.route[ 0 ] ) {
          add( previous.frag, previousChildren );
        }
      
        return DOMstate;
      
      }
      
      function add ( dom, frag ) { 
        dom.appendChild( frag instanceof Array ? domo.FRAGMENT.apply( domo, frag ) : frag ); 
      }
      
      function changeState () { 
        return ( ! DOMstate ? DOMstate = nodeType.apply( null, copy( lookup.current.frag.childNodes ) ) : switchInDom() ); 
      }

      // loops trough arguments passed to ROUTE()        
      function findState ( childs, state ) {
         
         var child = childs.shift();
         var isRegEx = ! child ? true : child instanceof RegExp;
         
         // if state has collected all childNodes create an entry in the lookup to cache the result
         // and change the current state
         if ( state && isRegEx ) {
            
            manageLookup.apply( null, state ? [ state.route, copy( state.childNodes ), state.actions ] : [] ); 
            return changeState();
            
         }
         
         // if argument is an function remember it's position and code   
         if ( state && ! isRegEx && child.apply ) {
         
           state.actions.push( { func: child, index: state.childNodes.length } );
         
         }
         
         // every argument that follows the namespace is part of the matched state.      
         if ( state && ! isRegEx ) state.childNodes.push( child );
         
         // every reqular expression in the arguments is a state namespace
         // if namespace could be found in url state will be defined to collect the following arguments until a new reqular expression follows
         if ( isRegEx && matches( child ) && ! state ) {
         
           state = { route: [ child, match ], childNodes: [], actions: [] };
         
         }
         
         return arguments.callee( childs, state );
      
      }//routeing
      
      
      // trigger callback
      if ( attributes.routing ) { 
         
         attributes.routing( function () { return findState.call( null, childNodes.slice() ); } ); 
      
      }
      
      
      return findState.call( null, childNodes.slice() );
      
    }
  
  }()
