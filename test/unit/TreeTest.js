//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/annotate/Annotate').annotate;
var Tree = require('../../lib/Tree');
var TreeNode = require('../../lib/TreeNode');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var TreeTest = {
    /**
     * This tests
     * 1) Walking a tree
     * 2) That the nodes are walked in the correct top down depth first order.
     */
    treeWalkOrderTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var tree = new Tree();
        var rootTreeNode = new TreeNode("rootNode");
        var child1ofRootNode = new TreeNode("child1ofRootNode");
        var child2ofRootNode =  new TreeNode("child2ofRootNode");
        var child1ofChild1ofRootNode = new TreeNode("child1ofChild1ofRootNode");
        var child2ofChild1ofRootNode = new TreeNode("child2ofChild1ofRootNode");
        var child3ofChild1ofRootNode = new TreeNode("child3ofChild1ofRootNode");
        var child1ofChild2ofChild1ofRootNode = new TreeNode("child1ofChild2ofChild1ofRootNode");

        tree.setRootNode(rootTreeNode);
        rootTreeNode.addChildNode(child1ofRootNode);
        rootTreeNode.addChildNode(child2ofRootNode);
        child1ofRootNode.addChildNode(child1ofChild1ofRootNode);
        child1ofRootNode.addChildNode(child2ofChild1ofRootNode);
        child1ofRootNode.addChildNode(child3ofChild1ofRootNode);
        child2ofChild1ofRootNode.addChildNode(child1ofChild2ofChild1ofRootNode);

        var expectedWalkOrder = [
            "rootNode",
            "child1ofRootNode",
            "child1ofChild1ofRootNode",
            "child2ofChild1ofRootNode",
            "child1ofChild2ofChild1ofRootNode",
            "child3ofChild1ofRootNode",
            "child2ofRootNode"
        ];


        // Run Test
        //-------------------------------------------------------------------------------

        var actualWalkOrder = [];
        tree.walk(function(value) {
            actualWalkOrder.push(value);
        });

        this.assertEqual(actualWalkOrder.length, expectedWalkOrder.length,
            "Assert the walk took the correct number of steps");
        for (var i = 0, size = actualWalkOrder.length; i < size; i++) {
            this.assertEqual(actualWalkOrder[i], expectedWalkOrder[i],
                "Assert Tree walk step '" + expectedWalkOrder[i] + "' was performed in the correct order");
        }

    }).with('@Test("Tree walk order test")')
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = TreeTest;
