/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
//

/**
 * @param {Rule} rule
 *
 * @return {Rule}
 */
function commaSeparated(rule) {
    return seq(rule, repeat(seq(",", rule)));
}

module.exports = grammar({
    name: "cerium",

    extras: ($) => [$.comment, /\s/],

    precedences: (_) => [
        [
            "subscript",
            "call",
            "prefix",
            "cast",
            "shift",
            "bit_and",
            "bit_xor",
            "bit_or",
            "product",
            "sum",
            "comparison",
            "assign",
        ],
    ],

    word: ($) => $.identifier,

    rules: {
        module: ($) => repeat($._top_level),

        _top_level: ($) =>
            choice(
                $.variable,
                seq($.type_alias, ";"),
                $.function,
                seq($.extern_function, ";"),
            ),

        _statement: ($) =>
            choice(
                $.variable,
                $.if,
                $.while,
                seq($.break, ";"),
                seq($.continue, ";"),
                $.return,
                seq($._expression, ";"),
            ),

        variable: ($) =>
            seq(
                optional("extern"),
                choice("var", "const"),
                $.identifier,
                optional($.type),
                choice(";", seq("=", $._expression, ";")),
            ),

        type_alias: ($) => seq("type", $.identifier, "=", $.type),

        function: ($) =>
            seq(
                "fn",
                $.identifier,
                $.parameters,
                optional(field("return_type", $.type)),
                $.body,
            ),

        extern_function: ($) =>
            seq(
                "extern",
                "fn",
                $.identifier,
                $.parameters,
                optional(field("return_type", $.type)),
            ),

        parameters: ($) =>
            seq(
                "(",
                optional(commaSeparated(seq($.identifier, $.type))),
                optional(","),
                optional("..."),
                ")",
            ),

        body: ($) => seq("{", repeat($._statement), "}"),

        if: ($) =>
            seq(
                "if",
                field("condition", $._expression),
                $.body,
                field("fallback", optional(seq("else", choice($.if, $.body)))),
            ),

        while: ($) => seq("while", field("condition", $._expression), $.body),
        break: (_) => "break",
        continue: (_) => "continue",

        return: ($) => seq("return", choice(seq($._expression, ";"), ";")),

        _expression: ($) => choice($._unary_expression, $._binary_expression),

        _unary_expression: ($) =>
            choice(
                $.identifier,
                $.string,
                $.character,
                $.int,
                $.float,
                $.inline_assembly,
                $.parentheses_expression,
                $.unary_operation,
            ),

        identifier: (_) => token(/[_a-zA-Z][:_a-zA-Z0-9]*/),

        type: ($) =>
            choice(
                $.identifier,
                $.array_type,
                $.struct_type,
                $.enum_type,
                $.pointer_type,
            ),

        array_type: ($) =>
            seq("[*]", optional("const"), field("child_type", $.type)),

        struct_type: ($) =>
            seq(
                "struct",
                "{",
                optional(
                    commaSeparated(seq(field("key", $.identifier), $.type)),
                ),
                optional(","),
                "}",
            ),

        enum_type: ($) =>
            seq(
                "enum",
                optional($.type),
                "{",
                optional(
                    commaSeparated(
                        seq(
                            field("key", $.identifier),
                            optional(seq("=", $.int)),
                        ),
                    ),
                ),
                optional(","),
                "}",
            ),

        pointer_type: ($) => seq("*", $.type),

        string: (_) =>
            seq('"', field("content", /[^"\\]*(?:\\.[^"\\]*)*/), '"'),

        character: (_) =>
            seq("'", field("content", /[^'\\]*(?:\\.[^'\\]*)*/), "'"),

        int: (_) => token(/[0-9][_a-zA-Z0-9]*/),

        float: (_) => token(/[0-9]\.[0-9]*/),

        inline_assembly: ($) =>
            seq(
                "asm",
                "{",
                repeat($.string),
                optional(
                    seq(
                        ":",
                        optional(seq($.string, "(", $.type, ")")),
                        optional(
                            seq(
                                ":",
                                optional(
                                    commaSeparated(
                                        seq($.string, "(", $._expression, ")"),
                                    ),
                                ),
                                optional(","),
                            ),
                        ),
                        optional(
                            seq(
                                ":",
                                optional(commaSeparated($.string)),
                                optional(","),
                            ),
                        ),
                    ),
                ),
                "}",
            ),

        parentheses_expression: ($) => seq("(", $._expression, ")"),

        unary_operation: ($) =>
            prec.left(
                "prefix",
                seq(
                    field("operator", choice("-", "!", "~", "&")),
                    field("lhs", $._expression),
                ),
            ),

        _binary_expression: ($) =>
            choice(
                $.call,
                $.assign,
                $.subscript,
                $.member,
                $.cast,
                $.binary_operation,
            ),

        call: ($) => prec.left("call", seq($._expression, $.arguments)),

        arguments: ($) =>
            seq(
                "(",
                optional(commaSeparated($._expression)),
                optional(","),
                ")",
            ),

        assign: ($) =>
            prec.left(
                "assign",
                seq(
                    field("target", $._expression),
                    field("operator", "="),
                    field("value", $._expression),
                ),
            ),

        subscript: ($) =>
            prec.left(
                "subscript",
                seq(
                    field("target", $._expression),
                    "[",
                    field("index", $._expression),
                    "]",
                ),
            ),

        member: ($) =>
            prec.left(
                "subscript",
                seq(
                    field("target", $._expression),
                    ".",
                    field("key", choice($.identifier, "*")),
                ),
            ),

        cast: ($) => prec.left("cast", seq($._expression, "as", $.type)),

        binary_operation: ($) =>
            choice(
                ...[
                    ["+", "sum"],
                    ["-", "sum"],
                    ["*", "product"],
                    ["/", "product"],
                    ["%", "product"],
                    ["<<", "shift"],
                    [">>", "shift"],
                    ["&", "bit_and"],
                    ["^", "bit_xor"],
                    ["|", "bit_or"],
                    ["<", "comparison"],
                    [">", "comparison"],
                    ["==", "comparison"],
                    ["!=", "comparison"],
                ].map(([operator, precedence, associativity]) =>
                    (associativity === "right" ? prec.right : prec.left)(
                        precedence,
                        seq(
                            field("lhs", $._expression),
                            field("operator", operator),
                            field("rhs", $._expression),
                        ),
                    ),
                ),
            ),

        comment: (_) => token(seq("//", field("content", /[^\n]*/))),
    },
});
