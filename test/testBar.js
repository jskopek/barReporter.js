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

        equal( $(el).find("#brRow1 #brBar0")[0].style.width, "100%" );
    });
    test("simple update", function() {
        var el = $("<div class='bar'></div>");
        $(el).barReporter({"data": [[20, "Label 1"], [40, "Label 2"]]});

        //modify a few components of first bar
        $(el).barReporter({"data": [[10, "Label 1 modified"], [40, "Label 2"]]});
        equal( $(el).find("#brRow0 #brBar0")[0].style.width, "25%" );

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

    module("Multiple points")
    test("render multiple points, multi", function() {
        var el = $("<div class='bar'></div>");

        $(el).barReporter({"data": [ [[10,40], "Label 1 modified"] ]});
        ok( $(el).hasClass("brMulti"), "does not have multi css class" );
        equal( $(el).find("#brRow0 .brBar").length, 2 );
        equal( $(el).find("#brRow0 #brBar0")[0].style.width, "25%" );
        equal( $(el).find("#brRow0 #brBar1")[0].style.width, "100%" );


    });
    test("render multiple points, stacked", function() {
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
        var el = $("<div class='bar'></div>");

        $(el).barReporter({"data": [ [[20,40, 80], "Label 1 modified"] ]});
        $(el).barReporter({"data": [ [[40, 80], "Label 1 modified"] ]});
        equal( $(el).find("#brRow0 .brBar").length, 2 );
        equal( $(el).find("#brRow0 #brBar0")[0].style.width, "50%" );
        equal( $(el).find("#brRow0 #brBar1")[0].style.width, "100%" );

    });

    module("Bar Label");
    test("Rendering labels for simple, small bars", function() {
        var el = $("<div class='bar'></div>");
        var lbl1 = "Label 1", lbl2 = "Label 2";
        $(el).barReporter({"data": [[20, lbl1], [40, lbl2]]});

        lbl1 = $.fn.barReporter.format_label( lbl1 );
        lbl2 = $.fn.barReporter.format_label( lbl2 );

        ok( $(el).find("#brRow0 .brLabel").filter(function() { return $(this).html() == lbl1 }).length );
        ok( $(el).find("#brRow1 .brLabel").filter(function() { return $(this).html() == lbl2 }).length );
    });
    test("Label formater works as expected", function() {

        equal( $.fn.barReporter.format_label("a", 20), "a" );
        equal( $.fn.barReporter.format_label("A longer string of text", 20), "A&nbsp;longer&nbsp;string&nbsp;of&nbsp;text" );
        equal( $.fn.barReporter.format_label("A longer string of text", 10), "A&nbsp;longer&nbsp;string of text" );
    });
    test("Rendering labels for long bars of text", function() {
        var el = $("<div class='bar'></div>");
        var lbl1 = "A long string of text with a ton of content that is very long and goes on and on and on";
        $(el).barReporter({"data": [[20, lbl1]]});

        lbl1 = $.fn.barReporter.format_label( lbl1 );
        ok( $(el).find("#brRow0 .brLabel").filter(function() { return $(this).html() == lbl1 }).length );
    });
    test("Modifying the number of no-wrap characters", function() {
        var el = $("<div class='bar'></div>");
        var lbl1 = "A long string of text with a ton of content that is very long and goes on and on and on";
        $(el).barReporter({"data": [[20, lbl1]], "num_no_wrap_chars": 50});

        lbl1 = $.fn.barReporter.format_label( lbl1, 50 );
        ok( $(el).find("#brRow0 .brLabel").filter(function() { return $(this).html() == lbl1 }).length );
    });
    test("Rendering labels for multi bar points", function() {
        var el = $("<div class='bar'></div>");

        var lbl1 = "Label 1 modified";
        $(el).barReporter({"data": [ [[10,40], lbl1] ]});


        lbl1 = $.fn.barReporter.format_label( lbl1 );
        ok( $(el).find("#brRow0 .brLabel").filter(function() { return $(this).html() == lbl1 }).length );
    });
    test("Modifying the label for multi bar points", function() {
        var el = $("<div class='bar'></div>");

        var lbl1 = "Label 1 modified";
        $(el).barReporter({"data": [ [[10,40], lbl1] ]});
        lbl1 = "Label 1 - now with 100% more characters!!!";
        $(el).barReporter({"data": [ [[10,40], lbl1] ]});


        lbl1 = $.fn.barReporter.format_label( lbl1 );
        ok( $(el).find("#brRow0 .brLabel").filter(function() { return $(this).html() == lbl1 }).length );
    });

    module("Bar Value");
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

    module("Percent value");
    test("Percent shown when enabled", function() {
        var el = $("<div class='bar'></div>");

        $(el).barReporter({ "data": [[30, "Label 1"]] });
        equal( $(el).find("#brRow0 .brPct").text(), "100%" );
    });
    test("Show, then hide perecent", function() {
        var el = $("<div class='bar'></div>");

        $(el).barReporter({ "data": [[30, "Label 1"]] });
        equal( $(el).find("#brRow0 .brPct").text(), "100%" );

        $(el).barReporter({ "data": [[30, "Label 1"]], "show_percent": false });
        equal( $(el).find("#brRow0 .brPct").text(), "" );
    });

    test("Custom scale does not affect percent", function() {
        var el = $("<div class='bar'></div>");

        $(el).barReporter({ "data": [[30, "Label 1"]], "scale": 100 });
        equal( $(el).find("#brRow0 .brPct").text(), "100%" );
    });
    test("Percent not shown when disabled", function() {
        var el = $("<div class='bar'></div>");

        $(el).barReporter({ "data": [[30, "Label 1"]], "show_percent": false });
        equal( $(el).find("#brRow0 .brPct").text(), "" );
    });
    test("Percent calculated correctly with multiple points", function() {
        var el = $("<div class='bar'></div>");
        var data = [
            [[20,40, 80], "Ethical"],
            [30, "Unethical"],
            [[100,10], "Morally ambiguous"],
        ]

        $(el).barReporter({"data": data, "type": "multi", "showPct": true});
        equal( $(el).find("#brRow0 .brPct").text(), "100%" );
        equal( $(el).find("#brRow1 .brPct").text(), "21%" );
        equal( $(el).find("#brRow2 .brPct").text(), "79%" );

        $(el).barReporter({"data": data, "type": "stacked", "showPct": true});
        equal( $(el).find("#brRow0 .brPct").text(), "100%" );
        equal( $(el).find("#brRow1 .brPct").text(), "21%" );
        equal( $(el).find("#brRow2 .brPct").text(), "79%" );
    });

    /*test("Benchmark test", function() {*/
    /*var el = $("<div class='bar'></div>");*/
    /*var buckets = [[0, "a"],[0, "b"],[0, "c"]];*/
    /*var count = 0;*/
    /*var maxCount = 1000;*/

    /*console.profile("Benchmark w/ " + maxCount);*/
    /*var render_fn = function() {*/
    /*var index = Math.round( Math.random() * (buckets.length - 1) );*/
    /*buckets[index][0]++;*/

    /*$(el).barReporter({ "data": buckets });*/

    /*//add a new bucket*/
    /*if( count % 100 == 0 ) {*/
    /*buckets.push( [0, String.fromCharCode( 97 + buckets.length )] );*/
    /*}*/

    /*//loop*/
    /*if( count < maxCount ) {*/
    /*count += 1;*/
    /*setTimeout(render_fn, 0);*/
    /*} else {*/
    /*console.profileEnd();*/
    /*}*/
    /*}*/

    /*$("body").append(el);*/
    /*render_fn();*/
    /*});*/

    /*test("Styling test", function() {*/
    /*var el = $("<div class='bar'></div>");*/
    /*var data = [*/
    /*[[20,40, 80], "Ethical"],*/
    /*[30, "Unethical"],*/
    /*[[100,10], "Morally ambiguous"],*/
    /*]*/

    /*$(el).barReporter({"data": data, "type": "multi", "showPct": true});*/
    /*$("body").append(el);*/
    /*});*/

});

