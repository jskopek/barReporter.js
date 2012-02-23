$(document).ready(function() {
    module("Bar");
    test("initialize", function() {
        var data = [];
        $("#bar").barReporter({ data: data });
    });
    test("render simple bar", function() {
        $("#bar").barReporter({ "data": [[10, "Label 1"]]});
        ok( $("#bar .brRow").length, 1 );
        ok( $("#bar #brRow0 #brBar0").css("width") == "100%" );
        ok( $("#bar #brRow0 .brLabel").filter(function() { return $(this).text() == "Label 1" }).length );
    });
    test("render multiple bars", function() {
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

