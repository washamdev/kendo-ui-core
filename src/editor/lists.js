(function(f, define){
    define([ "./linebreak" ], f);
})(function(){

(function($) {

// Imports ================================================================
var kendo = window.kendo,
    Class = kendo.Class,
    extend = $.extend,
    Editor = kendo.ui.editor,
    dom = Editor.Dom,
    RangeUtils = Editor.RangeUtils,
    EditorUtils = Editor.EditorUtils,
    Command = Editor.Command,
    ToolTemplate = Editor.ToolTemplate,
    FormatTool = Editor.FormatTool,
    BlockFormatFinder = Editor.BlockFormatFinder,
    textNodes = RangeUtils.textNodes,
    registerTool = Editor.EditorUtils.registerTool;

var ListFormatFinder = BlockFormatFinder.extend({
    init: function(tag) {
        this.tag = tag;
        var tags = this.tags = [tag == 'ul' ? 'ol' : 'ul', tag];

        BlockFormatFinder.fn.init.call(this, [{ tags: tags}]);
    },

    isFormatted: function (nodes) {
        var formatNodes = [];
        var formatNode, i;

        for (i = 0; i < nodes.length; i++) {
            formatNode = this.findFormat(nodes[i]);

            if (formatNode && dom.name(formatNode) == this.tag) {
                formatNodes.push(formatNode);
            }
        }

        if (formatNodes.length < 1) {
            return false;
        }

        if (formatNodes.length != nodes.length) {
            return false;
        }

        // check if sequential lists are selected
        for (i = 0; i < formatNodes.length; i++) {
            if (formatNodes[i].parentNode != formatNode.parentNode) {
                break;
            }

            if (formatNodes[i] != formatNode) {
                return false;
            }
        }

        return true;
    },

    findSuitable: function (nodes) {
        var candidate = this.findFormat(nodes[0]);

        if (candidate && dom.name(candidate) == this.tag) {
            return candidate;
        }

        return null;
    }

});

var ListFormatter = Class.extend({
    init: function(tag, unwrapTag) {
        var that = this;
        that.finder = new ListFormatFinder(tag);
        that.tag = tag;
        that.unwrapTag = unwrapTag;
    },

    isList: function(node) {
        var name = dom.name(node);

        return name == "ul" || name == "ol" || name == "dl";
    },

    immutables: function () {
        return this.editor && !!this.editor.options.immutables;
    },

    wrap: function(list, nodes) {
        var li = dom.create(list.ownerDocument, "li"),
            i, node,
            isImmutable = this.immutables() ? Editor.Immutables.immutable : $.noop;;

        for (i = 0; i < nodes.length; i++) {
            node = nodes[i];

            if (dom.is(node, 'li')) {
                list.appendChild(node);
                continue;
            }

            if (this.isList(node)) {
                while (node.firstChild) {
                    list.appendChild(node.firstChild);
                }
                continue;
            }

            if (dom.is(node, "td")) {
                while (node.firstChild) {
                    li.appendChild(node.firstChild);
                }
                list.appendChild(li);
                node.appendChild(list);
                list = list.cloneNode(false);
                li = li.cloneNode(false);
                continue;
            }

            li.appendChild(node);

            if (dom.isBlock(node)) {
                list.appendChild(li);
                if (!isImmutable(node)) {
                    dom.unwrap(node);
                }
                li = li.cloneNode(false);
            }
        }

        if (li.firstChild) {
            list.appendChild(li);
        }
    },

    containsAny: function(parent, nodes) {
        for (var i = 0; i < nodes.length; i++) {
            if (dom.isAncestorOrSelf(parent, nodes[i])) {
                return true;
            }
        }

        return false;
    },

    suitable: function (candidate, nodes) {
        if (candidate.className == "k-marker") {
            var sibling = candidate.nextSibling;

            if (sibling && dom.isBlock(sibling)) {
                return false;
            }

            sibling = candidate.previousSibling;

            if (sibling && dom.isBlock(sibling)) {
                return false;
            }
        }

        return this.containsAny(candidate, nodes) || dom.isInline(candidate) || candidate.nodeType == 3;
    },

    _parentLists: function(node) {
        var editable = dom.closestEditable(node);

        return $(node).parentsUntil(editable, "ul,ol");
    },

    split: function (range) {
        var nodes = textNodes(range);
        var start, end, parents;

        if (nodes.length) {
            start = dom.parentOfType(nodes[0], ['li']);
            end = dom.parentOfType(nodes[nodes.length - 1], ['li']);
            range.setStartBefore(start);
            range.setEndAfter(end);

            for (var i = 0, l = nodes.length; i < l; i++) {
                var formatNode = this.finder.findFormat(nodes[i]);
                if (formatNode) {
                    parents = this._parentLists(formatNode);
                    if (parents.length) {
                        RangeUtils.split(range, parents.last()[0], true);
                    } else {
                        RangeUtils.split(range, formatNode, true);
                    }
                }
            }
        }
    },

    merge: function(tag, formatNode) {
        var prev = formatNode.previousSibling, next;

        while (prev && (prev.className == "k-marker" || (prev.nodeType == 3 && dom.isWhitespace(prev)))) {
            prev = prev.previousSibling;
        }

        // merge with previous list
        if (prev && dom.name(prev) == tag) {
            while(formatNode.firstChild) {
                prev.appendChild(formatNode.firstChild);
            }
            dom.remove(formatNode);
            formatNode = prev;
        }

        next = formatNode.nextSibling;
        while (next && (next.className == "k-marker" || (next.nodeType == 3 && dom.isWhitespace(next)))) {
            next = next.nextSibling;
        }

        // merge with next list
        if (next && dom.name(next) == tag) {
            while(formatNode.lastChild) {
                next.insertBefore(formatNode.lastChild, next.firstChild);
            }
            dom.remove(formatNode);
        }
    },

    breakable: function(node) {
        return (
            node != node.ownerDocument.body &&
            !/table|tbody|tr|td/.test(dom.name(node)) &&
            !node.attributes.contentEditable
        );
    },

    applyOnSection: function (section, nodes) {
        var tag = this.tag;
        var commonAncestor = dom.closestSplittableParent(nodes);

        var ancestors = [];

        var formatNode = this.finder.findSuitable(nodes);

        if (!formatNode) {
            formatNode = new ListFormatFinder(tag == "ul" ? "ol" : "ul").findSuitable(nodes);
        }

        var childNodes;

        if (/table|tbody/.test(dom.name(commonAncestor))) {
            childNodes = $.map(nodes, function(node) {
                return dom.parentOfType(node, ["td"]);
            });
        } else {
            childNodes = dom.significantChildNodes(commonAncestor);

            if ($.grep(childNodes, dom.isBlock).length) {
                childNodes = $.grep(childNodes, $.proxy(function(node) {
                    return this.containsAny(node, nodes);
                }, this));
            }

            if (!childNodes.length) {
                childNodes = nodes;
            }
        }

        function pushAncestor() {
            ancestors.push(this);
        }

        for (var i = 0; i < childNodes.length; i++) {
            var child = childNodes[i];
            var suitable = (!formatNode || !dom.isAncestorOrSelf(formatNode, child)) && this.suitable(child, nodes);

            if (!suitable) {
                continue;
            }

            if (formatNode && this.isList(child)) {
                // merging lists
                $.each(child.childNodes, pushAncestor);
                dom.remove(child);
            } else {
                ancestors.push(child);
            }
        }

        if (ancestors.length == childNodes.length && this.breakable(commonAncestor)) {
            ancestors = [commonAncestor];
        }

        if (!formatNode) {
            formatNode = dom.create(commonAncestor.ownerDocument, tag);
            dom.insertBefore(formatNode, ancestors[0]);
        }

        this.wrap(formatNode, ancestors);

        if (!dom.is(formatNode, tag)) {
            dom.changeTag(formatNode, tag);
        }

        this.merge(tag, formatNode);
    },

    apply: function (nodes) {
        var i = 0,
            sections = [],
            lastSection,
            lastNodes,
            section,
            node,
            l = nodes.length,
            immutableParent = this.immutables() ? Editor.Immutables.immutableParent : $.noop;
        
        function addLastSection() {
            if (lastSection) {
                sections.push({
                    section: lastSection,
                    nodes: lastNodes
                });
            }
        }
        
        // split nodes into sections that need to be different lists
        for (i = 0; i < l; i++) {
            node = immutableParent(nodes[i]) || nodes[i];
            section = dom.closestEditable(node, ["td","body"]);
            if (!lastSection || section != lastSection) {
                addLastSection();
                lastNodes = [node];
                lastSection = section;
            } else {
                lastNodes.push(node);
            }
        }

        addLastSection();
        
        for (i = 0; i < sections.length; i++) {
            this.applyOnSection(sections[i].section, sections[i].nodes);
        }
    },

    unwrap: function(ul) {
        var fragment = ul.ownerDocument.createDocumentFragment(),
            unwrapTag = this.unwrapTag,
            parents,
            li,
            p,
            child;

        for (li = ul.firstChild; li; li = li.nextSibling) {
            p = dom.create(ul.ownerDocument, unwrapTag || 'p');

            while(li.firstChild) {
                child = li.firstChild;

                if (dom.isBlock(child)) {

                    if (p.firstChild) {
                        fragment.appendChild(p);
                        p = dom.create(ul.ownerDocument, unwrapTag || 'p');
                    }

                    fragment.appendChild(child);
                } else {
                    p.appendChild(child);
                }
            }

            if (p.firstChild) {
                fragment.appendChild(p);
            }
        }

        parents = this._parentLists(ul);

        if (parents[0]) {
            dom.insertAfter(fragment, parents.last()[0]);
            parents.last().remove();
        } else {
            dom.insertAfter(fragment, ul);
        }

        dom.remove(ul);
    },

    remove: function (nodes) {
        var formatNode;
        for (var i = 0, l = nodes.length; i < l; i++) {
            formatNode = this.finder.findFormat(nodes[i]);

            if (formatNode) {
                this.unwrap(formatNode);
            }
        }
    },

    toggle: function (range) {
        var that = this,
            nodes = textNodes(range),
            ancestor = range.commonAncestorContainer;

        if (!nodes.length) {
            range.selectNodeContents(ancestor);
            nodes = textNodes(range);
            if (!nodes.length) {
                var text = ancestor.ownerDocument.createTextNode("");
                range.startContainer.appendChild(text);
                nodes = [text];
                range.selectNode(text.parentNode);
            }
        }

        if (that.finder.isFormatted(nodes)) {
            that.split(range);
            that.remove(nodes);
        } else {
            that.apply(nodes);
        }
    }

});

var ListCommand = Command.extend({
    init: function(options) {
        options.formatter = new ListFormatter(options.tag);
        Command.fn.init.call(this, options);
    }
});

var ListTool = FormatTool.extend({
    init: function(options) {
        this.options = options;
        FormatTool.fn.init.call(this, extend(options, {
            finder: new ListFormatFinder(options.tag)
        }));
    },

    command: function (commandArguments) {
        return new ListCommand(extend(commandArguments, { tag: this.options.tag }));
    }
});

extend(Editor, {
    ListFormatFinder: ListFormatFinder,
    ListFormatter: ListFormatter,
    ListCommand: ListCommand,
    ListTool: ListTool
});

registerTool("insertUnorderedList", new ListTool({tag:'ul', template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "Insert unordered list"})}));
registerTool("insertOrderedList", new ListTool({tag:'ol', template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "Insert ordered list"})}));

})(window.kendo.jQuery);

}, typeof define == 'function' && define.amd ? define : function(a1, a2, a3){ (a3 || a2)(); });
