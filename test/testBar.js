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
        var el = $("<div class='bar'></div>");
        $(el).barReporter({"data": [[20, "Label 1"], [40, "Label 2"]]});

        //modify a few components of first bar
        $(el).barReporter({"data": [[10, "Label 1 modified"], [40, "Label 2"]]});
        equal( $(el).find("#brRow0 #brBar0")[0].style.width, "25%" );
        ok( $(el).find("#brRow0 .brLabel").filter(function() { return $(this).text() == "Label 1 modified" }).length );

        //add a third row
        $(el).barReporter({"data": [[10, "Label 1 modified"], [40, "Label 2"], [80, "Label 3"]]});
        equal( $(el).find("#brRow0 #brBar0")[0].style.width, "12.5%" );
        equal( $(el).find("#brRow1 #brBar0")[0].style.width, "50%" );
        equal( $(el).find("#brRow2 #brBar0")[0].style.width, "100%" );
    });
    test("update with new rows", function() {
    });
    test("update removing rows", function() {
    });
    test("update with new row points", function() {
    });
    test("update removing row points", function() {
    });
    test("show percent", function() {
    });
});

