
$2.block =  
( blockname )  =>
( ...syntags ) => // syntactic itags
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


$2.tag = 
  ( tagname, ...rolenames )   =>
  ( ...syntags ) => // syntactic itags
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
  for( let syntag of syntags )
    $.syntax.itag( syntag )( ctx_ );
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
// REFLECT BEM rolenames
  for( let rolename of rolenames ){
    const blockname = ctx.layer.lookup( '__block__' );
    const bemclass = `${ blockname }__${ rolename }`;
    $1.class( bemclass )( ctx );
  }
};

$2.the =
  ( noun ) =>
  ( ...syntexps ) => // syntactic tag expressions
  ctx =>
{
  console.log( noun, ctx.layer )
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
    ( () => { node.parentNode.removeChild( node ) } 
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
  ( /^<([^>]+?)>$/, signature => $.value_args( signature )
  , /^one-of\s+/  , argsyntax => $.value_oneof( ...trimsplit( argsyntax ) )
  , /^all-of\s+/  , argsyntax => $.value_allof( ...trimsplit( argsyntax ) )  
  )
;
$.value_args =   
  ( signature ) => // syntax
  () =>
  ( ctx ) => 
{
// EXTEND layer with data structures  
  ctx.layer.embos = [];
  ctx.layer.trans = {};
// EXTEND layer with methods
  ctx.layer.getState = args_getState;
  ctx.layer.embodyState = args_embodyState;
// Log  
  console.log("metatag value_args")
};
$2.bind_event = ( eventname ) => ( trans ) => ( ctx ) =>
{ console.log( 'BIND TAG anon read' )
  const ground = ctx.layer;
  ctx.node.addEventListener
    ( eventname
    , () => {
        console.log( `The event '${ eventname }' was emitted` );
        // PERFORM ground action 
        trans( ground );
      } 
    )
  ;
};

$2.trans = 
  ( key ) =>
  ( def ) =>
  ( ctx ) =>
{

};

$1.embo = ( embo ) => ( ctx ) => 
{ /* STORE embodiment */
  ctx.layer.embos.push( { node: ctx.node, embo } );
};

$2.embo = ( key ) => ( texp ) => ( ctx ) => 
{ /* STORE embodiment */
  ctx.layer.embos.push
    ( { node: ctx.node
      , embo: { key: texp }
      } 
  ); 
};

