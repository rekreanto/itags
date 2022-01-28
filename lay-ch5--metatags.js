
$2.block =  
( blockname )  =>
( ...syntags ) => // syntactic tag expressions
( ctx )      => 
{
// STORE block name and syntags
  ctx.layer.env[ '__block__' ] = blockname;
  ctx.layer.env[ '__frag__' ] = syntags;
// REFLECT BEM block name as CSS class
  $1.class( blockname )( ctx );
// PROCESS descendants
for( let syntag of syntags )
  $.syntax.itag( syntag )( ctx );
};

$2.layer =  
(  ) =>
( ...syntexps ) => // syntactic tag expressions
ctx  => 
{
// PROCESS descendants
for( let syntexp of syntexps )
  $.syntax.itag( syntexp )( ctx );
};

$2.tag = 
  ( tagname, ...rolenames )   =>
  ( ...syntexps ) => // syntactic tag expressions
  ( ctx )      => 
{
// CREATE tag
  const node = document.createElement( tagname );
  ctx.node.appendChild( node );
// PROJECT context for descendants
  const ctx_ = Context( { node }, ctx );
// PROCESS roles
  $1.role( ...rolenames )( ctx_  );
// PROCESS descendants
  for( let syntexp of syntexps )
    $.syntax.itag( syntexp )( ctx_ );
// STORE exit action
  ctx.layer.exits.push
    ( () => { node.parentNode.removeChild( node ) } 
    );
};

$1.role = 
  ( ...rolenames ) =>
  ctx => 
{
// STORE ref to node
  for( let rolename of rolenames ){
    ctx.layer.env[ rolename ] = ctx.node;
    
  }
// REFLECT plain rolenames

// REFLECT BEM rolenames
  for( let rolename of rolenames ){
    const blockname = ctx.layer.lookup( '__block__' );
    const bemclass = `${ blockname }__${ rolename }`;
    $1.class( bemclass )( ctx );
    $1.class( rolename )( ctx );

  }
};

$2.the =
  ( noun ) =>
  ( ...syntexps ) => // syntactic tag expressions
  ctx =>
{
// LOOKUP
  const node = ctx.layer.lookup( noun );
// PROJECT
  const ctx_ = Context( { node }, ctx );
// PROCESS descendants
  for( let syntag of syntexps )
    $.syntax.itag( syntag )( ctx_ ); 
}


$1.textnode = 
  ( ...strs ) =>
  ( ctx ) => {
// ENTRY
  const node = document.createTextNode( strs.join( '' ) );
  ctx.node.appendChild( node );
// EXIT
  ctx.layer.exits.push
    ( () => { ctx.node.removeChild( node ) } 
    );
};


$2.style =
  ( k )    =>
  ( v )    =>
  ( ctx )  => 
{
// ENTRY
  ctx.node.style[ k ] = v;
// EXIT
  ctx.layer.exits.push
    ( () => { ctx.node.style.removeProperty( k ); } 
    )
  ;
};

$2.attr =
  ( k )    =>
  ( v )    =>
  ( ctx )  => 
{
// ENTRY
  const had_v = ctx.node.hasAttribute( k );
  const old_v = ctx.node[ k ];
  ctx.node[ k ] = v;
// EXIT
  ctx.layer.exits.push
    ( () => { 
        if( !had_v ) ctx.node.removeAttribute( k );
        else ctx.node[ k ] = old_v;
      } 
    )
  ;
};

$1.class = 
  ( classname ) =>
  ( ctx ) => 
{
// WARN if not monotonous
  if( ctx.node.classList.contains( classname ) ) console.warn( `adding the class ${ classname } is not monotonous.` )
// SET class
  ctx.node.classList.add( classname );
// STORE exit action
  ctx.layer.exits.push
    ( () => { ctx.node.classList.remove( classname ) }
    )
  ; 
};

$2.value = Match
  ( /^<([^>]+?)>/, signature => $2.value_x( 'args', signature )
  , /^(\S+)\s+/  , ( type, argstx ) => $2.value_x( type, ...trimsplit( argstx ) )
 )
;
$2.value_x =   
  ( type, ...signature ) => // syntax
  ( state ) =>
  ( ctx ) => 
{

// EXTEND layer with data structures  
  ctx.layer.embos = [];
  ctx.layer.trans = {};
  ctx.layer.signature = signature;
  if( state ) 
    $2.trans( 'INIT' )( state )( ctx );
// EXTEND layer with methods
  Object.assign( ctx.layer, $.mixin[ type ] );
};


$2.bind_event = 
  eventname =>
  gact => 
  ctx => {
  const ground = ctx.layer;
// DEFINE handler
  const handler = () => {
    // PERFORM ground action 
    gact( ground );
  };
  ctx.node.addEventListener
    ( eventname
    , handler
    );
  // PUSH disembodimet
  ctx.layer.exits.push
    ( () => { ctx.node.removeEventListener( eventname, handler ) } 
    );
// REFLECT ACTIVATION
  $1.class( '__bound__' )( ctx );
};

$2.bind_state = 
  eventname =>
  xgact => // ground action
  ctx => {
  const ground = ctx.layer;
// DEFINE handler
  const handler = e => {
    const gact = xgact( e );
    // PERFORM ground action 
    gact( ground );
  };
// BIND handler
  ctx.node.addEventListener
    ( eventname
    , handler
    );
// PUSH disembodimet
  ctx.layer.exits.push
    ( () => { ctx.node.removeEventListener( eventname, handler ) } 
    );
// REFLECT ACTIVATION
  $1.class( '__bound__' )( ctx );
};

$2.trans = 
  ( key ) => ( def ) => ( ctx ) => 
  ctx.layer.trans[ key ] = def;

$1.embo = ( embo ) => ( ctx ) => 
{ /* STORE embodiment */
  ctx.layer.embos.push({ ctx, embo } );
};

$2.embo = ( key ) => ( texp ) => ( ctx ) => 
{ /* STORE embodiment */
  ctx.layer.embos.push({ ctx,  embo: [ key, texp ] }); 
};

// time
$2.after = 
  ms   =>
  gact =>
  ctx  => 
{
  const ref = setTimeout
    ( () => { gact( ctx.layer ) }
    , ms 
    );
  ctx.layer.exits.push
    ( () => { clearTimeout( ref ) }
    );
};


$1.node = () => f => ctx => f( ctx.node )