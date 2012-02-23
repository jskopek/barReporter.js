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
    test("custom scale", function() {
        var el = $("<div class='bar'></div>");
        var data = [[20, "Label 1"], [40, "Label 2"]];

        //ensure custom scale is respected
        $(el).barReporter({"data": data, "scale": 80});
        equal( $(el).find("#brRow0 #brBar0")[0].style.width, "25%" );
        equal( $(el).find("#brRow1 #brBar0")[0].style.width, "50%" );

        //ensure percent cannot go over 100%;
        $(el).barReporter({"data": data, "scale": 10});
        equal( $(el).find("#brRow0 #brBar0")[0].style.width, "100%" );
        equal( $(el).find("#brRow1 #brBar0")[0].style.width, "100%" );

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
        $(el).barReporter({"data": [[5, "Label 1 modified"], [40, "Label 2"], [80, "Label 3"]]});
        equal( $(el).find("#brRow0 #brBar0")[0].style.width, "6.25%" );
        equal( $(el).find("#brRow1 #brBar0")[0].style.width, "50%" );
        equal( $(el).find("#brRow2 #brBar0")[0].style.width, "100%" );
    });
    test("update removing rows", function() {
        var el = $("<div class='bar'></div>");

        $(el).barReporter({"data": [[20, "Label 1 modified"], [40, "Label 2"], [80, "Label 3"]]});
        equal( $(el).find(".brRow").length, 3 );

        $(el).barReporter({"data": [[20, "Label 1 modified"], [40, "Label 2"]]});
        equal( $(el).find(".brRow").length, 2 );
        equal( $(el).find("#brRow0 #brBar0")[0].style.width, "50%" );
        equal( $(el).find("#brRow1 #brBar0")[0].style.width, "100%" );
    });
    test("show percent", function() {
    });

    module("Multiple points")
    test("render multiple points, stacked", function() {
        var el = $("<div class='bar'></div>");

        $(el).barReporter({"data": [ [[10,40], "Label 1 modified"] ]});
        ok( $(el).hasClass("brMulti"), "does not have multi css class" );
        equal( $(el).find("#brRow0 .brBar").length, 2 );
        equal( $(el).find("#brRow0 #brBar0")[0].style.width, "25%" );
        equal( $(el).find("#brRow0 #brBar1")[0].style.width, "100%" );


    });
    test("render multiple points, multi", function() {
        var el = $("<div class='bar'></div>");

        $(el).barReporter({"data": [ [[10,40], "Label 1 modified"] ], "type": "stacked"});
        ok( $(el).hasClass("brStacked"), "does not have stacked css class" );
        equal( $(el).find("#brRow0 .brBar").length, 2 );
        equal( $(el).find("#brRow0 #brBar0")[0].style.width, "20%" );
        equal( $(el).find("#brRow0 #brBar1")[0].style.width, "80%" );
    });
    test("convert from stacked to multi", function() {
        var el = $("<div class='bar'></div>");
        var data = [ [[10,40], "Label 1 modified"] ];

        $(el).barReporter({"data": data, "type": "stacked"});
        ok( $(el).hasClass("brStacked"), "does not have stacked css class" );
        equal( $(el).find("#brRow0 #brBar1")[0].style.width, "80%" );

        $(el).barReporter({"data": data, "type": "multi"});
        ok( $(el).hasClass("brMulti"), "does not have multi css class" );
        ok( !$(el).hasClass("brStacked"), "has leftover not have stacked css class" );
        equal( $(el).find("#brRow0 #brBar1")[0].style.width, "100%" );
    });
    test("update with new row points", function() {
        var el = $("<div class='bar'></div>");

        $(el).barReporter({"data": [ [[20,40], "Label 1 modified"] ]});

        $(el).barReporter({"data": [ [[20,40, 80], "Label 1 modified"] ]});
        equal( $(el).find("#brRow0 .brBar").length, 3 );
        equal( $(el).find("#brRow0 #brBar0")[0].style.width, "25%" );
        equal( $(el).find("#brRow0 #brBar1")[0].style.width, "50%" );
        equal( $(el).find("#brRow0 #brBar2")[0].style.width, "100%" );
    });
    test("update removing row points", function() {
    });

    module("Bar Label");
    test("render simple bar", function() {
        var el = $("<div class='bar'></div>");

        $(el).barReporter({ "data": [[30, "Label 1"]]});
        equal( $(el).find("#brRow0 #brBar0").text(), "30" );
    });
    test("render multiple bars", function() {
        var el = $("<div class='bar'></div>");
        $(el).barReporter({"data": [[20, "Label 1"], [40, "Label 2"]]});

        equal( $(el).find("#brRow0 #brBar0").text(), "20" );
        equal( $(el).find("#brRow1 #brBar0").text(), "40" );
    });
    test("simple update", function() {
        var el = $("<div class='bar'></div>");
        $(el).barReporter({"data": [[20, "Label 1"], [40, "Label 2"]]});
        equal( $(el).find("#brRow0 #brBar0").text(), "20" );

        //modify a few components of first bar
        $(el).barReporter({"data": [[10, "Label 1 modified"], [40, "Label 2"]]});
        equal( $(el).find("#brRow0 #brBar0").text(), "10" );

        //add a third row
        $(el).barReporter({"data": [[5, "Label 1 modified"], [40, "Label 2"], [80, "Label 3"]]});
        equal( $(el).find("#brRow0 #brBar0").text(), "5" );
    });
    test("render multiple points, stacked", function() {
        var el = $("<div class='bar'></div>");

        $(el).barReporter({"data": [ [[10,40], "Label 1 modified"] ]});
        equal( $(el).find("#brRow0 #brBar0").text(), "10" );
        equal( $(el).find("#brRow0 #brBar1").text(), "40" );

    });
});

