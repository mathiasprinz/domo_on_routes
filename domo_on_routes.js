// domoOnRoutes.js 0.1.0
// (c) 2012  M.( Mathias Prinz )
// is distributed under the MIT license.

  ! function () {

    typeof module == "object"
         ? module.exports = Route
         : window.ROUTE = Route
         ; 

    function Route () {

      var args = copy( arguments )
        , attributes = args.shift()
        , lookup
        ;

      function findState ( childs, state, followers, actions ) {

        var child = childs.shift();
        var isRegEx = child instanceof RegExp;
        var match = matches( child );
        // if state can't be found

        if ( ! child && ! state ) {
          manageLookup( [ '','' ], [], [] );
          return stateIntoDom();
        }

        // if state has collected all
        // childNodes create an entry in
        // the lookup to cache the result
        // and change the current state

        if ( state && isRegEx || ! child ) {
          manageLookup( state, followers, actions ); 
          return stateIntoDom();
        }

        // every argument that follows
        // the namespace is part of the
        // matched state.
        
        // if argument is an function
        // remember it's position and body in actions
        
        if ( state && ! isRegEx ) pushFollower( child, followers, actions );

        // every reqular expression in
        // the arguments is a state
        // namespace if namespace could
        // be found in url state will be
        // defined to collect the following
        // arguments until a new reqular
        // expression follows

        if ( ! state && isRegEx && match ) {
          state = [ child, match ];
          followers = [];
          actions = [];
        }

        return arguments.callee( childs, state, followers, actions );
      } // find state

      function pushFollower ( arg, followers, actions, nameSpace ) {
        if ( arg.apply ) actions.push( { func: arg, index: followers.length } );
        followers.push( arg );
      }

      // insert state as object
      // to the lookup table or
      // updates if sate already 
      // exist

      function manageLookup ( route, children, actions ) {
        var name = route.join( '-' );
        var match = route[ 1 ];
        
        children = copy( children );

        if ( ! lookup ) lookup = {};
        if ( lookup.current ) lookup.previous = lookup.current;
        if ( lookup && lookup[ name ] ) { 

          refreshActions( lookup[ name ], match );

          lookup.current = lookup[ name ]; 
        }
        else {

          initActions( actions, children, match );

          lookup.current = lookup[ name ] = { 
            frag: domo.FRAGMENT.apply( null, children )
          , actions: actions 
          , route: route
          };
        }
      }

      function stateIntoDom () { 
        return ( ! lookup.DOMFrame ? DOMFrame() : switchInDom() ); 
      }

      function DOMFrame () {
        var domFrame = attributes.frame || domo.SECTION;
        return lookup.DOMFrame = domFrame.apply( null, copy( lookup.current.frag.childNodes ) );
      }

      // take a look on a string ( url ) if a regular expression is part of it 
      function matches ( regEx ) {
        if ( regEx instanceof RegExp === false ) return null;
        var match = getUrl().match( regEx );
        
        if ( match ) match = match[ 0 ];
        return match;
      }

      // make copy of an array
      // concat = Array.prototype.concat and
      // concat.apply( [], element.childNodes )
      // made problems with android native 
      // browser "internet"

      function copy ( arr ) {
        var deep = [], l = arr.length, i = 0;
        
        for ( ; i < l; i = i + 1 ) { deep[ i ] = arr[ i ]; }
        return deep;
      }

      // url can be set in attributes obj
      // as { url: string } or instead of 
      // the attributes obj.

      function getUrl () {
        var url = typeof attributes === 'string' ? attributes : attributes.url;
        return ( url.apply ? url() : url );
      }

      // run actions ( functions ) in single 
      // domoFRAGMENTS before they where put to 
      // the other children of the current 
      // lookup obj ( sate ) to be added 
      // together to objects fragment. This 
      // happend to bind the results of the triggert 
      // function ( childNodes of the single frag ) 
      // to the action to update the results on a later 
      // reload of this state in realtime 

      function initActions ( actions, children, match ) {
        if ( ! actions.length ) return;
        var i = 0, l = actions.length;
        var action = actions[ i ].func;
        var actionFrag;

        for ( ; i < l; i = i + 1 ) {
          actionFrag = domo.FRAGMENT( action( match ) );
          children[ actions[ i ].index ] = actionFrag;
          actions[ i ].index = copy( actionFrag.childNodes );
        }
      }

      // replaces former generated results ( childNodes )
      // of an action, owned by an state already existing

      function refreshActions ( obj, match ) {
        if ( ! obj.actions.length || ! obj.frag.childNodes.length ) return;
        var actions = obj.actions;
        var i = 0, l = actions.length;
        var frag = obj.frag;
        var actionFrag;
        var index;
        
        function trigger ( action ) {
          index = action.index;
          actionFrag = domo.FRAGMENT.call( domo, action.func( match ) )
          var i = 0, l = index.length;
          
          for ( ; i < l; i++ ) updateChildren( i );
        }

        function updateChildren () {
          var previous = index[ i ];
          var following = actionFrag.childNodes[ i ];
          
          index[ i ] = following;
          frag.replaceChild( following, previous );
        }

        for ( ; i < l; i++ ) trigger( actions[ i ] );
      }

      // Bring state changes into DOM 
      // by copying the previous childs into lookup 
      // and following childs from lookup

      function switchInDom () {
        var previousChildren = copy( lookup.DOMFrame.childNodes );
        var previous = lookup.previous;
        var following = lookup.current;

        if ( following.frag.childNodes.length && following.route ) {
          add( lookup.DOMFrame, following.frag );
          add( previous.frag, previousChildren );
        }

        if ( ! following.route[ 0 ] ) {
          add( previous.frag, previousChildren );
        }

        return lookup.DOMFrame;
      }

      // add child

      function add ( dom, frag ) { 
        dom.appendChild( frag instanceof Array ? domo.FRAGMENT.apply( domo, frag ) : frag );
      }
      
      // trigger callback
      
      if ( attributes.change ) {
        attributes.change( function () { return findState.call( null, args.slice() ); } );
      }

      return findState.call( null, args.slice() );

  }

}()