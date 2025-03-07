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
    name: "barq",

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
            choice($.global_assembly, seq($.constant, ";"), $.variable),

        _statement: ($) =>
            choice(
                seq($.constant, ";"),
                $.variable,
                $.switch,
                $.if,
                $.while,
                seq($.break, ";"),
                seq($.continue, ";"),
                $.defer,
                $.return,
                seq($._expression, ";"),
            ),

        constant: ($) => seq($.identifier, "::", $._expression),

        variable: ($) =>
            seq(
                $.identifier,
                choice(
                    seq(":", $.type, ";"),
                    seq(":", $.type, "=", $._expression, ";"),
                    seq(":=", $._expression, ";"),
                ),
            ),

        body: ($) => seq("{", repeat($._statement), "}"),

        switch: ($) => seq("switch", $._expression, $.switch_cases),

        switch_cases: ($) =>
            seq(
                "{",
                commaSeparated(
                    seq(
                        choice(
                            "else",
                            seq(commaSeparated($._expression), optional(",")),
                        ),
                        "=>",
                        choice($.body, $._statement),
                    ),
                ),
                optional(","),
                "}",
            ),

        if: ($) =>
            seq(
                "if",
                $._expression,
                $.body,
                field("fallback", optional(seq("else", choice($.if, $.body)))),
            ),

        while: ($) => seq("while", $._expression, $.body),
        break: (_) => "break",
        continue: (_) => "continue",

        defer: ($) => seq("defer", choice(seq($._statement, ";"), $.body)),

        return: ($) => seq("return", choice(seq($._expression, ";"), ";")),

        type: ($) => prec.left($._expression),
        type_right: ($) => prec.right($._expression),

        _expression: ($) => choice($._unary_expression, $._binary_expression),

        _unary_expression: ($) =>
            choice(
                $.identifier,
                $.special_identifier,
                $.string,
                $.character,
                $.int,
                $.float,
                $.struct_type,
                $.enum_type,
                $.array_type,
                $.slice_type,
                $.pointer_type,
                $.function,
                $.inline_assembly,
                $.parentheses_expression,
                $.unary_operation,
            ),

        identifier: (_) => token(/[_a-zA-Z][_a-zA-Z0-9]*/),

        special_identifier: (_) => token(/@[_a-zA-Z][_a-zA-Z0-9]*/),

        struct_type: ($) => seq("struct", $.struct_type_fields),

        struct_type_fields: ($) =>
            seq(
                "{",
                optional(
                    commaSeparated(
                        seq(field("key", $.identifier), ":", $.type),
                    ),
                ),
                optional(","),
                "}",
            ),

        enum_type: ($) => seq("enum", optional($.type), $.enum_type_fields),

        enum_type_fields: ($) =>
            seq(
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

        array_type: ($) => seq("[", $._expression, "]", $.type_right),

        slice_type: ($) =>
            seq(choice("[]"), optional("const"), $.type_right),

        pointer_type: ($) =>
            seq(choice("*", "[*]"), optional("const"), $.type_right),

        function: ($) =>
            prec.left(
                seq(
                    "fn",
                    $.parameters,
                    optional(field("return_type", $.type)),
                    optional(choice(
                        $.foreign_attribute,
                        $.body,
                        seq($.foreign_attribute, $.body),
                    )),
                ),
            ),

        foreign_attribute: ($) => seq("@foreign", "(", $.string, ")"),

        parameters: ($) =>
            seq(
                "(",
                optional(commaSeparated(seq($.identifier, ":", $.type))),
                optional(","),
                optional("..."),
                ")",
            ),

        string: (_) =>
            seq('"', field("content", /[^"\\]*(?:\\.[^"\\]*)*/), '"'),

        character: (_) =>
            seq("'", field("content", /[^'\\]*(?:\\.[^'\\]*)*/), "'"),

        int: (_) => token(/[0-9][_a-zA-Z0-9]*/),

        float: (_) => token(/[0-9]\.[0-9]*/),

        global_assembly: ($) => seq("asm", $.global_assembly_body),

        global_assembly_body: ($) => seq("{", repeat($.string), "}"),

        inline_assembly: ($) => seq("asm", $.inline_assembly_body),

        inline_assembly_body: ($) =>
            seq(
                "{",
                repeat($.string),
                optional(
                    seq(
                        ":",
                        optional(seq($.string, "(", $._expression, ")")),
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
                    field(
                        "operator",
                        choice(
                            "+=",
                            "-=",
                            "*=",
                            "/=",
                            "%=",
                            "<<=",
                            ">>=",
                            "&=",
                            "^=",
                            "|=",
                            "=",
                        ),
                    ),
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
                    ["<=", "comparison"],
                    [">=", "comparison"],
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
