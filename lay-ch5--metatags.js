// the `tag` metatag

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
  ctx.exits.push
    ( () => { node.parentNode.removeChild( node ) } 
    );
};

$1.role = 
  ( ...rolenames ) =>
  ctx => 
{
// STORE ref to node
// for( let rolename of rolenames )
//   ctx.layer.env[ rolename ] = ctx.node;
};

$2.the =
  ( noun ) =>
  ( ...syntags ) => // syntactic itags
  ctx =>
{
// LOOKUP
  const node = ctx.lookup( noun );
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
  ctx.exits.push
    ( () => { node.parentNode.removeChild( node ) } 
    );
};


$2.style =
  ( k )    =>
  ( v )    =>
  ( ctx ) => {
// ENTRY
  ctx.node.style[ k ] = v;
// EXIT
  if( !ctx.leeways ) 
    ctx.exits.push
      ( () => { ctx.node.style.removeProperty( k ); } 
      );
};