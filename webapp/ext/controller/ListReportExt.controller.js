

sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/core/util/File",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
], function (MessageToast, Fragment, JSONModel, ODataModel, FileUtil, Export, ExportTypeCSV) {
    'use strict';

    return {
        // onTempDownload: function(oEvent) {
        //     MessageToast.show("Temp Download handler invoked.");
        // },
        onTempDownload: function () {
            // Define the properties for the template
            // var dummyData = [
            //     { ID: "1", Name: "John Doe", Age: 30, Country: "USA" },
            //     { ID: "2", Name: "Jane Smith", Age: 25, Country: "Canada" },
            //     // Add more dummy data as needed
            // ];
            // var columnLabels = [
            //     { ID: "", Name: "", Age: "", Country: "" } // Empty data
            // ];
            // // Create a JSON model with the dummy data
            // var oModel = new JSONModel(columnLabels);

            // var oExport = new Export({
            //     exportType: new ExportTypeCSV({
            //         fileExtension: "xls",
            //         separatorChar: "\t"
            //     }),
            //     models: oModel,
            //     rows: {
            //         path: "/"
            //     },
            //     columns: [
            //         { name: "ID", template: { content: "{ID}" } },
            //         { name: "Name", template: { content: "{Name}" } },
            //         { name: "Age", template: { content: "{Age}" } },
            //         { name: "Country", template: { content: "{Country}" } },
            //         // Add more columns as needed
            //     ]
            // });

            // oExport.saveFile().catch(function (oError) {
            //     // Handle error
            //     console.error("Error exporting template:", oError);
            // }).then(function () {
            //     oExport.destroy();
            // });

            var workbook = XLSX.utils.book_new();

            // Define data and columns for Sheet1
            var sheet1Data = [
                { "Invoicereferencenumber": "", "Fiscalyear": "", "Companycode": "", "Documentdate(YYYYMMDD)": "", "Postingdate(YYYYMMDD)": "", "Supplierinvoiceidbyinvcgparty	": "", "Invoicingparty": "", "Documentcurrency": "", "Invoicegrossamount": "", "Duecalculationbasedate(YYYYMMDD)": "" } // Empty data
            ];

            // Add sheet1 to the workbook
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(sheet1Data), 'Header Data');

            // Define data and columns for Sheet2
            var sheet2Data = [
                { "Invoicereferencenumber": "", "Fiscalyear": "", "Supplierinvoiceitem": "", "Purchaseorder": "", "Purchaseorderitem": "", "Supplierinvoiceitemamount": "", "Documentcurrency": "", "Taxcode": "" } // Empty data
            ];

            // Add sheet2 to the workbook
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(sheet2Data), 'Item with Purchase Order Refere');
            // Define data and columns for Sheet3
            var sheet3Data = [
                { "Invoicereferencenumber": "", "Fiscalyear": "", "Supplierinvoiceitem": "", "Ordinalnumber": "", "Documentcurrency": "", "Quantity": "", "Purchaseorderquantityunit": "", "Supplierinvoiceaccountassignmentamount": "", "Taxcode": "", "Accountassignment number": "", "Costcenter": "", "Glaccount": "" } // Empty data
            ];

            // Add sheet2 to the workbook
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(sheet3Data), 'Account Assignment Data');
            // Save the workbook
            XLSX.writeFile(workbook, 'template_tabs.xlsx');
            this.onCloseDialog();
        },
        excelSheetsData: [],
        onInit() {

        },
        oDialog: null,
        upload_File: function () {
            if (!this.oDialog) {
                this.oDialog = new sap.ui.xmlfragment("invoicerap.fragment.popup", this);
                this.getView().addDependent(this.oDialog);

                this.oDialog.attachBeforeClose(this.setDataToJsonFromExcel, this);
            }
            this.oDialog.open();

        },


        setDataToJsonFromExcel: function (oEvent) {
            // debugger;
            // var XLSX;
            var oUploader = oEvent.getSource().getContent()[0];
            this.oDataModel = this.getView().getModel();
            var domRef = oUploader.oFileUpload;
            if (!domRef.files) {
                console.log("if runs");
                return;

            }
            else {
                var file = domRef.files[0];

                var that = this;
                //start of code to fetch data from excel sheet
                var payload = []
                var excelData = {};

                if (file && window.FileReader) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = e.target.result;
                        var workbook = XLSX.read(data, {
                            type: 'binary'
                        });
                        // let obj1 = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]])
                        // obj1[0].to_Item.results = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[1]])[0]
                        // console.log("object with item",obj1)
                        workbook.SheetNames.forEach(function (sheetName) {
                            // Here is your object for every sheet in workbook
                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                            console.log("sheet data ", excelData);
                            payload.push(excelData[0])
                        });

                        console.log("our data is ", payload);
                        // debugger;

                        payload[0].to_Item = { "results": [payload[1]] };
                        // payload[0].to_Item['results'][0].to_Item_Ass = { "results": [payload[2]] }

                        let newPayload = payload[0]
                        console.log(newPayload)

                        that.oDataModel.create("/zinvo_supplier_c", newPayload, {

                            success: function () {
                                sap.m.MessageToast.show("Data Uploaded into SAP");
                            },
                            error: function () {
                                sap.m.MessageToast.show("ERROR");

                            }
                        });
                    };

                    //FileReader will start  reading the file
                    reader.readAsBinaryString(file);

                }

            }
        },
        onCloseDialog: function () {
            this.oDialog.close();
        },



    };
});