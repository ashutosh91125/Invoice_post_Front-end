sap.ui.define(
    ["sap/suite/ui/generic/template/lib/AppComponent",
"sap/ui/core/UIComponent",
  "sap/ui/Device",],
    function (Component,UIComponent,Device) {
        "use strict";

        
        return Component.extend("invoicerap.Component", {
            metadata: {
                manifest: "json"
            },
 /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
            init: function () {

                var jQueryScript = document.createElement('script');
                var jQueryScript = document.createElement('script');
                jQueryScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.0/xlsx.js');
                document.head.appendChild(jQueryScript);
               

                var jQueryScript = document.createElement('script');
            jQueryScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.0/jszip.js');
            document.head.appendChild(jQueryScript);
            

            var jQueryScript = document.createElement('script');
            jQueryScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.0/xlsx.js');
            document.head.appendChild(jQueryScript);
        }
        
        });
    }
);