// lookup method
function lookup( noun )
{
// SUCCESSFUL lookup
  if( Object.hasOwn( this.env, noun ) ) return this.env[ noun ];
// DETECT FAILURE
  if( this.lower ) throw `No entry for the noun ${ noun }'}`
// LOOKUP in lower layer
  return this.lower.lookup( noun );
}

// Layer constructor
const Layer = ( lower ) => {
  const lay = 
    { lower         // ref to lower layer
    , env: {}       // mapping from keys to nodes; used to let the layer stack behave as one object statically; the layered nature is used only for change
    , exits: []     // representation of the current embodiment
    , lookup        // the loopup method
    }
  ;
  return lay;
};

// A layer for us as the lowest layer of the document


// ground actions
const Trans = 
  ( fn ) =>
  ( ground ) => 
{

};

const State = 
  ( ...vals ) =>
  ( ground ) => 
{

};