$(document).ready(function() {
    module("Bar");
    test("initialize", function() {
        var el = $("<div class='bar'></div>");
        $(el).barReporter({ data: [] });
    });
    test("render simple bar", function() {
        var el = $("<div class='bar'></div>");

        $(el).barReporter({ "data": [[30, "Label 1"]]});
        ok( $(el).find(".brRow").length, 1 );
        equal( $(el).find("#brRow0 #brBar0")[0].style.width, "100%" );
        ok( $(el).find("#brRow0 .brLabel").filter(function() { return $(this).text() == "Label 1" }).length );
    });
    test("render multiple bars", function() {
        var el = $("<div class='bar'></div>");
        var data = [[20, "Label 1"], [40, "Label 2"]];
        $(el).barReporter({"data": data});

        ok( $(el).find(".brRow").length, 2 );

        equal( $(el).find("#brRow0 #brBar0")[0].style.width, "50%" );
        ok( $(el).find("#brRow0 .brLabel").filter(function() { return $(this).text() == "Label 1" }).length );

        equal( $(el).find("#brRow1 #brBar0")[0].style.width, "100%" );
        ok( $(el).find("#brRow1 .brLabel").filter(function() { return $(this).text() == "Label 2" }).length );
    });
    test("simple update", function() {
    });
    test("update with new rows", function() {
    });
    test("update labels", function() {
    });
    test("update with new row points", function() {
    });
    test("show percent", function() {
    });
});

