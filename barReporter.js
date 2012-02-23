
(function($) {
    $.fn.barReporter = function(options) {
        options = $.extend({
            "data": [],
            "color": "green",
            "type": "stacked",
            "scale": undefined,
        }, options);

        //find the bar element or initialize & add to container
        var get_or_create_row = function(parent, id) {
            var el = $(parent).find("#brRow" + id);
            if( !el.length ) {
                el = $("<div class='brRow' id='brRow" + id + "'>" +
                    "<div class='brLabel'></div>" +
                    "<div class='brBars'></div>");
                $(parent).append( el );
            }
            return el;
        }
        
        //find or add a new bar
        var get_or_create_bar = function(parent, index) {
            var el = $(parent).find(".brBars #brBar" + index);
            if( !el.length ) {
                el = $("<div class='brBar' id='brBar" + index + "'></div>");
                $(parent).find(".brBars").append( el );
            }
            return el;
        }

        //calculates the scale to present items out of
        var get_scale = function() {
            if( options.scale ) {
                return options.scale
            }

            var scale = 0;

            for( var index in options.data ) {
                var data = options.data[index][0];
                var total = 0;

                //if row does not have array of data, row's total is simply the value
                if( !$.isArray(data) ) {
                    total = data;

                //if row has array of data, row is either sum of values or highest value (depends on report type)
                } else {
                    $(data).each(function(i,value) {
                        if( options.type == "stacked" ) {
                            total += value;
                        } else if( (options.type == "multi") && (value > total) ) {
                            total = value;
                        }
                    });
                }

                if( total > scale ) {
                    scale = total;
                }
            }

            return scale;
        }

        //Remove any rows that no longer exist
        if( $(this).find(".brRow").length >= options.data.length ) {
            $(this).find(".brRow").each(function(index) {
                if( index > options.data.length - 1 ) {
                    $(this).remove();
                }
            });
        }

        //loop through rows and render them
        $(options.data).each($.proxy(function(index, row_data) {

            //get or create row
            var row_el = get_or_create_row(this, index);

            var data = $.isArray( row_data[0] ) ? row_data[0] : [ row_data[0] ];
            var label = row_data[1];

            //Remove any bars that no longer exist
            if( row_el.find(".brBar").length >= data.length ) {
                row_el.find(".brBar").each(function(index) {
                    if( index > data.length - 1 ) {
                        $(this).remove();
                    }
                });
            }

            //Update bar data
            $(data).each( function(index, value) {
                var el = get_or_create_bar( row_el, index );
                var width = value / get_scale() * 100;
                $(el).css("width", width + "%");
            });

            //Update label
            $(row_el).find(".brLabel").text( label );

        }, this));
    }

})(jQuery);

//        Reporting.draw_status_bars({
//            render_fn: function(id, title, height, color) {
//                var entry = $(ed.templates.render('reporting_bar', {
//                    id: id,
//                    title: title,
//                    height: height, 
//                    color: color,
//                    drawbuttons: report_options["draw_correct_answer_buttons"]
//                }));
//            },
//            update_fn: function(el, id, value, label) {
//                if( !id ) { return false; }
//                $(el).find("#" + id.valueOf() + " #bar").css("width", value + "%");
//                $(el).find("#" + id.valueOf() + " .chart_percent").text(value + "%");
//                $(el).find("#" + id.valueOf() + " .extra_label").text(label);
//            },
//
//        });
//
//
//
//
//
//
//draw_status_bars: function(options) {
//    var options = $.extend({ //        el: "body",
//        title: "",
//        title_position: "vertical", //may be vertical or horizontal
//        data: [],
//        height: 25,
//        get_fn: this._get_status_bars,
//        render_fn: this._draw_status_bar,
//        update_fn: this._update_status_bar,
//        inline_bars: false, //defines if multiple bars should be rendered in one line, or in multiple rows
//        remove_unreferenced_bars: true //if the status bar el contains a status bar that is not defined in 'data', specify if remove
//    }, options);
//
//    //el: element to put the status bars in
//    //data: [{id: '--', title:'---', value: 0-100, label: '(opn)', color: '(opn)'}, ...]
//
//    //cannot use table because when tables are not visible, jqplot does not work
//    //create a container if it doesn't exist of the status bars
//    var $status_bar_div_container = $(options.el).find(".status_bar_container");
//
//    //if nothing present, initialize
//    if ($status_bar_div_container.length == 0) {
//        if( options.title_position == "horizontal" ) {
//            $status_bar_div_container = $("<table class='status_bar_container'></table>");
//            if (options.drawbuttons && (options.module_item.get('type') != 'na')) {
//                $status_bar_div_container.append("<tr><td colspan='3'></td><td>Correct</td></tr>");
//            }
//
//        } else {
//            $status_bar_div_container = $("<div class='status_bar_container'><div class='title'>" + options.title + "</div><div class='status_bars'></div><div style='clear:both;'></div></div>");
//        }
//        $(options.el).prepend($status_bar_div_container);
//    } 
//
//    //check against previous data to see if any changes are required; return immediately if not
//    var prev_data = $status_bar_div_container.data("status_bars_data");
//    if( prev_data && (_.isEqual(prev_data, options.data)) ) { return true; }
//    $status_bar_div_container.data("status_bars_data", options.data);
//
//    var bar_ids = _.map(options.data, function(item) { return item.id; });
//    var bar_el_ids = _.map(options.get_fn($status_bar_div_container), function(el) { return $(el).attr("id"); });
//
//    //boolean true/false value, triggered if a bar is added or removed from the chart
//    //when bars are added or removed, we must resize them
//    var bars_changed = false;
//
//    if( options.remove_unreferenced_bars ) {
//        //remove any bars that are present in the el, but not in the data
//        _.each(bar_el_ids, function(bar_id) {
//            if( _.indexOf(bar_ids, bar_id) == -1 ) {
//                options.get_fn($status_bar_div_container).filter(function() { return $(this).attr("id") == bar_id; }).remove();
//                bars_changed = true;
//            }
//        });
//    }
//
//
//    //add any bars that are present in the data, but not in the el
//    _.each(bar_ids, function(bar_id) {
//        if( _.indexOf(bar_el_ids, bar_id) == -1 ) {
//            var bar_data = _.detect(options.data, function(item) { return item.id == bar_id});
//            if( !bar_data.height ) { bar_data.height = options.height; }
//            if( !bar_data.color ) { bar_data.color = color; }
//            $status_bar_div_container.append(options.render_fn(bar_data.id, bar_data.title, bar_data.height, bar_data.color));
//            bars_changed = true;
//        }
//    });
//
//    //update bars
//    for( i in options.data ) {
//        var bar_data = options.data[i];
//        options.update_fn($status_bar_div_container, bar_data.id, bar_data.value, bar_data.label);
//    }
//
//    if( bars_changed ) {
//        var $status_bars = $status_bar_div_container.find(".status_bar");
//        if( options.inline_bars ) {
//            $status_bars.css("width", (100 / $status_bars.length) + "%");
//        } else {
//            $status_bars.css("width", "100%");
//        }            
//    }
//},
//    _get_status_bars: function(el) {
//        return $(el).find(".status_bar");
//    },
//    _draw_status_bar: function(id, title, height, color, label) {
//        //value = 0-100
//        var html = "<div id='" + id + "' class='status_bar' style='float: left;'>" +
//            "<div class='chart'>" +
//            "<span class='chart_percent' style='line-height:" + height + "px'></span>" +
//            "<div id='bar' style='background-color:" + color + "; width: 0%; height:" + height + "px'></div>" +
//            "</div>" +
//            (title ? "<div class='label'>" + title + "</div>" : "") +
//            "</div>";
//        return html;
//    },
//    _update_status_bar: function(el, id, value, label) {
//        if( !id ) { return false; }
//        $(el).find("#" + id.valueOf() + " #bar").css("width", value + "%");
//        $(el).find("#" + id.valueOf() + " .chart_percent").text(label);
//    },
//
//
//
