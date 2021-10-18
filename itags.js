// PRELUDE

// prelude -- predicates

// prelude -- patterns

// prelude -- adapters
let Case;  // Case( ( <pred>, <fn> )+ | <fn> )
let Match; // Match( ( <pattern>, <fn> )+ | <fn> )




// TAGS

// tags -- h_ build
let Mk;         // [ Mk( <tag>, <role>? ), <itag>* ] 
let The;        // [ The( <role> ), <itag>* ] 

// tags -- h_ modify
let Attr;       // [ Attr, <str key>, <str val>  ]
let Class;      // [ Class, <str>+ ]
let Style;      // [ Style, <str key>, <val> ]

// tags -- hv bind
let Bind;       // [ Bind( <str event> ), <transition> ]
let BindClick;  // [ BindClick, <transition>, <arg>* ]
let BindInput;  // [ BindInput, <transition>, <arg>* ]
let BindFocus;  // [ BindInput, <transition>, <arg>* ]


// tags -- _v build
let Layer;      // [ Layer, ( <val> → <itag> ) ]     -- can have multiple features?
                // [ Layer, { <val> : <itag> } ]


// tags -- _v modify
let Val;        // [ Val, <atom> | <> → <atom> ]     -- constructor (arity 0)
                // [ <cand> → <bool> ]               -- typechecker (arity 1)

let Fn;         // [  ]

// tags -- _v split
let Slot;



