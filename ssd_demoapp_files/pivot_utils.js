/*****************************************************************************
 pivot_utils.js
 
******************************************************************************
by E.Sandberg, 2012
Copyright (C) 2012 Statistiska Centralbyrån (SCB)

Pivot table code written by Brian Douglas Skinner <brian.skinner@gumption.org>
*/

var PIVOT_UTILS = (function (self, $) {
    self.createPivotTableFromUrl = function (url, request, tableDivId, mySelectCallback) {
        $.support.cors = true;
        $.post(
            url,
            JSON.stringify(request),
            function (data) {
                var axis = [];
                var resultAxis = new Axis("data");
                for (var i = 0; i < data.columns.length; i++) {
                    if (data.columns[i].type == 'c') {
                        resultAxis.makeNewBucket(data.columns[i].text);
                    }
                    else {
                        axis.push(new Axis(data.columns[i].text));
                    }
                }
                axis.push(resultAxis);

                var buckets = {};
                for (var d = 0; d < data.data.length; d++) {
                    for (var i = 0; i < data.data[d].key.length; i++) {
                        if (buckets[data.data[d].key[i]] == null)
                            buckets[data.data[d].key[i]] = axis[i].makeNewBucket(data.data[d].key[i]);
                    }
                }

                var dataVortex = new DataVortex(axis);
                dataVortex.metricList.push(new Metric('', Datatype.NUMBER));

                for (var d = 0; d < data.data.length; d++) {
                    var thisBuckets = [];
                    for (var i = 0; i < data.data[d].key.length; i++) {
                        thisBuckets.push(buckets[data.data[d].key[i]]);
                    }
                    for (var i = 0; i < data.data[d].values.length; i++) {
                        dataVortex.setValue(dataVortex.metricList[0], parseFloat(data.data[d].values[i]), thisBuckets.concat([resultAxis.bucketList[i]]));
                    }
                }

                var dataPivot = new PivotTable(tableDivId, dataVortex, dataVortex.axisList.slice(0, dataVortex.axisList.length - 1), dataVortex.axisList.slice(dataVortex.axisList.length - 1, dataVortex.axisList.length), mySelectCallback);
                dataPivot.display();
            },
            "json"
        );
    };
    return self;
})(PIVOT_UTILS || {}, jQuery);


var IMG_UTILS = (function (self, $) {
    self.getImageFromUrl = function (url, request) {
        $.support.cors = true;
        $.post(
            url,
            JSON.stringify(request),
            function (data) {
                return JSON.stringify(data);
            },
            "json"
        );
    };
    return self;
})(IMG_UTILS || {}, jQuery);