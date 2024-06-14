sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/model/json/JSONModel'
], function(UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("sap.m.sample.TableDnD.Component", {
        metadata: {
            manifest: "json"
        },

        init: function() {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            // Create a JSON model for selected products
            var oSelectedProductsModel = new JSONModel({ selectedProducts: [] });
            this.setModel(oSelectedProductsModel, "selectedProductsModel");
        }
    });
});

