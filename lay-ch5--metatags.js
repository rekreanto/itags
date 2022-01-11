
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
    console.log( "layer", ctx.layer );
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
  ( ...syntags ) => // syntactic itags
  ctx =>
{
// LOOKUP
  const node = ctx.layer.lookup( noun );
// PROJECT
  const ctx_ = Context( { node }, ctx );
// PROCESS descendants
  for( let syntag of syntags )
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

$1.val =
  ( stx ) => // syntax
  ( ctx ) => 
{

};

$2.bind =
  ( eventname ) =>
  ( trans ) =>
  ( ctx ) =>
{

};

$2.trans = 
  ( key ) =>
  ( def ) =>
  ( ctx ) =>
{

};