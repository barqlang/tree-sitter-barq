package tree_sitter_barq_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-barq"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_barq.Language())
	if language == nil {
		t.Errorf("Error loading Barq grammar")
	}
}
