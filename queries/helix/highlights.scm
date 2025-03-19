; Types

(type (member key: (identifier) @type))
(type (identifier) @type)
(type (struct_type (struct_type_fields (identifier) @variable.other.member)))
(type_right (member key: (identifier) @type))
(type_right (identifier) @type)
(type_right (struct_type (struct_type_fields (identifier) @variable.other.member)))

; Function and Method calls

(call (special_identifier) @function.builtin)
(call (member key: (identifier) @function.method))
(call (identifier) @function)

; Parameters

(parameters (identifier) @variable.parameter)

; Attributes

(attribute (special_identifier) @attribute)

; Variables

(member key: (identifier) @variable.other.member)
(identifier) @variable

; Literals

(int) @constant.numeric.integer
(float) @constant.numeric.float

(string) @string
(character) @constant.character

; Comments

(comment) @comment

; Keywords

"fn" @keyword.function

"while" @keyword.control.repeat

"return" @keyword.control.return

[
 "if"
 "else"
 "switch"
  "then"
] @keyword.control.conditional

[
 (break)
 (continue)
 "defer"
] @keyword.control

"as" @keyword.operator

[
 "struct"
 "enum"
] @keyword.storage.type

"const" @keyword.storage.modifier

"asm" @keyword

; Operators

[
  "&"
  "~"
  "+"
  "-"
  "/"
  "*"
  "%"
  "<<"
  ">>"
  "&"
  "^"
  "|"
  "<"
  ">"
  "<="
  ">="
  "=="
  "!="
  "+="
  "-="
  "*="
  "/="
  "%="
  "<<="
  ">>="
  "&="
  "^="
  "|="
  "="
] @operator


; Punctuation

[
  ","
  "."
  ";"
] @punctuation.delimiter

[
 "("
 ")"
 "["
 "]"
 "{"
 "}"
] @punctuation.bracket
