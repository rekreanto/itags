const Context0 = () => Context1( document.body )

// 1-ary Context call
// Context( <node> )
const Context1 = Match
  ( _Node, node => { return { node, layer: Layer( ) } }
  , _ObjLit, ctx => ctx
  , _String, query => {
      const node = Context1( document.querySelector( query ) );
      return Context1( node );
    } 
  )
;

// 2-ary Context call
// Context( <obj props>, <obj context> )
const Context2 = ( props, ctx ) => 
    Object.assign( {}, ctx, props );

// variadic Context call
const Context = CaseArity
  ( 0, Context0
  , 1, Context1
  , 2, Context2
  )
;  
  
