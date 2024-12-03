; Types

(type (identifier) @type)
(type (struct_type (struct_type_fields (identifier) @variable.other.member)))

; Function and Method calls

(call (member key: (identifier) @function.method))

(call (identifier) @function)
(function (identifier) @function)
(extern_function (identifier) @function)

; Parameters

(parameters (identifier) @variable.parameter)

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
 (break)
 (continue)
] @keyword.control

[
 "if"
 "else"
 "switch"
] @keyword.control.conditional

"as" @keyword.operator

[
 "type"
 "struct"
 "enum"
] @keyword.storage.type

[
 "extern"
 "const"
 "var"
] @keyword.storage.modifier

[
 "asm"
] @keyword


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
  "=="
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
