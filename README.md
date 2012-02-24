#Bar Reporter

The bar reporter allows us to build fast, scalable bar reports. The library is inspired from [jqBarGraph](http://www.workshop.rs/jqbargraph/), so you may want to give that a look if this isn't exactly what you're looking for.

![](http://cl.ly/EUdj/Screen%20Shot%202012-02-24%20at%201.19.52%20PM.png)
![](http://cl.ly/ETcd/Screen%20Shot%202012-02-24%20at%201.02.13%20PM.png)

##Features

* Fast: handles rapid updates with minimal CPU overhead and work
* Scalable: simply change font size to change the size of the graph; it's flexible, so it adapts well to containers
* Clean Labels: tries to wrap labels into multiple lines when appropriate, otherwise keeps on one line with escaped spaces
* Multiple data points per label: Can show multiple bars per label, in stacked or multi 
* jQuery integration

##Usage

To generate a bar report, simply type the following

    $(".bar").barReport({ data: dataSource });

The `dataSource` should be a list of data in the following format:

    var dataSource = new Array(
        [value, label],
        [value, label]
    )

If you have multiple points of data for a label, simply pass an array of values in the value field:

    var dataSource = new Array(
        [[1,1.5,10], "Label for 3 bars"]
    )

In addition to `data`, several options may be specified:

* `color`: A hex color value for the chart (default: green)
* `type`: When dealing with multi-value labels, specify `stacked` or `multi` (default: multi)
* `show_percent`: Choose to show a label indicating the size of each bar, in percent (default: true)
* `num_no_wrap_chars`: The maximum number of characters in a label that will appear on one line before being wrapped (default: 20)
* `scale`: A value to scale bars by; if not specified, will default to highest value passed

##Caveats:

This library only renders bar charts, and only renders them horizontally and in HTML form. Its hyper-specialized and will likely never be extended to do more than just the basics. If that's what you're looking for though, knock yourself out!

##License

Copyright (c) 2012 Top Hat Monocle, http://tophatmonocle.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

