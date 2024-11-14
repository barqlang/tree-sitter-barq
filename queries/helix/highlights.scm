; Types

(type (identifier) @type)
(type (struct_type (identifier) @variable.other.member))

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
] @keyword.control.conditional

"as" @keyword.operator

[
 "extern"
 "var"
 "type"
] @keyword.storage.type

[
 "const"
] @keyword.storage.modifier

[
 "struct"
 "enum"
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
