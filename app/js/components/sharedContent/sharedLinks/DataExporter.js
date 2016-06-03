import csv from 'csv'
var xlsx = require('xlsx')
import { saveAs } from 'node-safe-filesaver'
import moment from 'moment'
import { CellDataTypes } from './SharedLinks.component'

function dataExport(dataModel, data, format) {
    if (format == 'csv') {
        exportCSV(dataModel, data);
    } else if (format == 'xlsx') {
        exportXLSX(dataModel, data);
    } else if (format == 'pdf') {
        exportPDF(dataModel, data);
    } else if (format == 'clipboard') {
        exportClipboard(dataModel, data);
    }
}

function dataToArray(dataModel, data) {
    var formattedData = _.map(data, function(dEl) {
        return _.map(dataModel, function(dmEl) {
            var val = dEl[dmEl.dataProp];
            if (val == null) {
                val = '';
            } else {
                if (dmEl.dataTransform) {
                    val = dmEl.dataTransform(val);
                }
                if (dmEl.dataType == CellDataTypes.date) {
                    val = moment(val).format('YYYY-MM-DD HH:mm:ss');
                }
            }
            return val + '';
        });
    });

    formattedData.unshift(_.map(dataModel, 'label')); //Add the headers
    return formattedData;
}

function exportCSV(dataModel, data) {
    var formattedData = dataToArray(dataModel, data);

    csv.stringify(formattedData, function(err, data) {
        data = encodeURI('data:text/csv;charset=utf-8,' + data);

        var link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', 'Contempo-Shared-Links ' + moment().format('L') + '.csv');
        link.click();
    });
}

function exportPDF(dataModel, data) {
    var formattedData = dataToArray(dataModel, data);
    var docDefinition = {
        pageOrientation: 'landscape',
        content: [{
            table: {
                headerRows: 1,
                widths: _.map(dataModel, function() {
                    return 'auto';
                }),

                body: formattedData

            }
        }]
    };
    pdfMake.createPdf(docDefinition).download('Contempo-Shared-Links ' + moment().format('L') + '.pdf');
}

function exportXLSX(dataModel, data) {
    dataModel = _.values(dataModel);

    var book = {
        SheetNames: [],
        Sheets: {}
    };
    var sheet = {
        '!ref': 'A1:I164'
    };

    _.each(dataModel, function(model, column) {
        var columnLetter = String.fromCharCode('A'.charCodeAt(0) + column);
        var cellLabel = columnLetter + 1;

        sheet[cellLabel] = {
            t: 's', //cell type
            v: model.label //raw value
        }
    });
    _.each(data, function(data, row) {
        _.each(dataModel, function(model, column) {
            //Convert the column number to a letter, this blows up after 26 columns
            var value = data[model.dataProp];
            value = model.dataTransform ? model.dataTransform(value) : value;

            var columnLetter = String.fromCharCode('A'.charCodeAt(0) + column);
            var cellLabel = columnLetter + (row + 2);
            var type = 's';
            var link = false;

            if (model.dataType == CellDataTypes.number) {
                type = 'n';
            } else if (model.dataType == CellDataTypes.dollars) {
                type = 'n';
            } else if (model.dataType == CellDataTypes.date) {
                type = 'd';
            } else if (model.dataType == CellDataTypes.link) {
                type = 's';
                link = {
                    Target: value
                }
            } else {

            }

            sheet[cellLabel] = {
                t: type, //cell type
                v: value //raw value
            }
            if (link) {
                sheet[cellLabel].l = link;
            }

        });
    });

    var sheetName = 'SharedLinks';
    book.SheetNames.push(sheetName);
    book.Sheets[sheetName] = sheet;

    var output = xlsx.write(book, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    saveAs(new Blob([streamToArrayBuffer(output)], { type: "application/octet-stream" }), 'Contempo-Shared-Links ' + moment().format('L') + '.xlsx');
}

function exportClipboard(dataModel, data) {
    var formattedData = dataToArray(dataModel, data);
    var text = _.reduce(formattedData, function(text, row) {
        return text + '\r\n' + _.reduce(row, function(text, cell) {
            return text + "\t" + cell;
        }, '');
    }, '');

    var textField = document.createElement('TextArea');
    document.body.appendChild(textField);
    textField.value = text;
    textField.select();
    document.execCommand('copy');
    document.body.removeChild(textField);

}

function downloadData(data, filename) {
    data = encodeURI(data);

    var link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}


function streamToArrayBuffer(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

export default dataExport
