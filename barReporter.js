/* Copyright (c) 2012 Top Hat Monocle, http://tophatmonocle.com/
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

(function($) {
    $.fn.barReporter = function(options) {
        options = $.extend({}, $.fn.barReporter.defaults, options);

        //add appropriate type css to barReport
        if( options["type"] == "multi" ) {
            $(this).removeClass("brStacked").addClass("brMulti");
        } else if( options["type"] == "stacked" ) {
            $(this).removeClass("brMulti").addClass("brStacked");
        }

        //determine graph scale
        var data_scale = $.fn.barReporter.calculate_scale(options);
        var pct_scale = $.fn.barReporter.calculate_pct_scale(options);
        var scale = options.scale || data_scale;

        //determine if non row-specfic values have been changed since last rendering
        //data must be removed, as modifying it is not indicative of change in other options
        var comp_options = $.extend({}, options, {"scale": scale, "data":false});
        var options_modified = $.fn.barReporter.is_modified( this, comp_options );

        //Remove any rows that no longer exist
        if( $(this).find(".brRow").length >= options.data.length ) {
            $(this).find(".brRow").each(function(index) {
                if( index > options.data.length - 1 ) {
                    $(this).remove();
                }
            });
        }

        //loop through rows and render them
        for( var row_index in options.data ) {
            var row_data = options.data[row_index];

            //get or create row
            var row_el = $.fn.barReporter.get_or_create_row(this, row_index);

            //only redraw rows if data has been modified
            if( !options_modified && !$.fn.barReporter.is_modified( row_el, row_data ) ) {
                continue;
            }
            
            var data = $.isArray( row_data[0] ) ? row_data[0] : [ row_data[0] ];
            var label = row_data[1];

            //Remove any bars that no longer exist
            if( row_el.find(".brBar").length >= data.length ) {
                row_el.find(".brBar").each(function(row_index) {
                    if( row_index > data.length - 1 ) {
                        $(this).remove();
                    }
                });
            }


            //Update bar data
            for( var bar_index in data ) {
                var value = data[bar_index];
                var el = $.fn.barReporter.get_or_create_bar( row_el, bar_index );
                var width = value / scale * 100;
                if( width > 100 ) { width = 100; }
                $(el).css("width", width + "%");
                $(el).text(value);
            }

            //Update label
            label = $.fn.barReporter.format_label( label, options.num_no_wrap_chars );
            $(row_el).find(".brLabel").html( label );

            //Render percent value for row
            if( options.show_percent ) {

                //calculate total pct for all row data based on data_scale
                var total_pct = 0;
                $(data).each( function(row_index, value) {
                    total_pct += value / pct_scale * 100;
                });
                total_pct = Math.round(total_pct);

                //render value
                $(row_el).find(".brPct").html( total_pct + "%" );
            } else {
                //render nothing
                $(row_el).find(".brPct").html( false );
            }

        }
    };
    //
    //determines if the row's data has changed, requiring a redraw
    $.fn.barReporter.is_modified = function( row_el, row_data ) {
        var old_data = $(row_el).data("rowData");
        var new_data = JSON.stringify(row_data);

        if( new_data == old_data ) {
            return false;
        } else {
            $(row_el).data("rowData", new_data);
            return true;
        }
    }

    $.fn.barReporter.format_label = function( str, num_no_wrap_chars ) {
        //use default num_no_wrap_chars if no value provided
        if( !num_no_wrap_chars ) {
            num_no_wrap_chars = $.fn.barReporter.defaults.num_no_wrap_chars;
        }

        return str.substr(0,num_no_wrap_chars).replace(/\s/g, "&nbsp;") + str.substr( num_no_wrap_chars );
    }

    //find the bar element or initialize & add to container
    $.fn.barReporter.get_or_create_row = function(parent, id) {
        var el = $(parent).children("#brRow" + id);
        
        if( !el.length ) {
            el = $("<div class='brRow' id='brRow" + id + "'>" +
                "<div class='brLabel'></div>" +
                "<div class='brBars'></div>" +
                "<div class='brPct'></div>");
            $(parent).append( el );
        }
        return el;
    }

    //find or add a new bar
    $.fn.barReporter.get_or_create_bar = function(parent, index) {
        var el = $(parent).find(".brBars > #brBar" + index);

        if( !el.length ) {
            el = $("<div class='brBar' id='brBar" + index + "'></div>");
            $(parent).find(".brBars").append( el );
        }
        return el;
    }

    //calculates the scale to present items out of
    $.fn.barReporter.calculate_scale = function(options) {
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

    //calculates the percentage scale (identical to stacked scale)
    $.fn.barReporter.calculate_pct_scale = function(options) {
        var options = $.extend({}, options, { "type": "stacked"} );
        return $.fn.barReporter.calculate_scale( options );
    }

    $.fn.barReporter.defaults = {
        "data": [],
        "color": "green",
        "type": "multi",
        "scale": undefined,
        "num_no_wrap_chars": 20,
        "show_percent": true
    }

})(jQuery);
