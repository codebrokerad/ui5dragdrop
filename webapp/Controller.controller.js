sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "./Utils",
    "sap/ui/thirdparty/jquery"
], function(Controller, JSONModel, Utils, jQuery) {
    "use strict";

    return Controller.extend("sap.m.sample.TableDnD.Controller", {

        onInit: function() {
            // Initialize sample products model
            this.oProductsModel = this.initSampleProductsModel();
            this.getView().setModel(this.oProductsModel);

            // Initialize selected products model conditionally
            if (!this.getOwnerComponent().getModel("selectedProductsModel")) {
                this.initSelectedProductsModel();
            }
        },

        onExit: function() {
            this.oProductsModel.destroy();
            // Optionally, destroy the selected products model
            const oSelectedProductsModel = this.getOwnerComponent().getModel("selectedProductsModel");
            if (oSelectedProductsModel) {
                oSelectedProductsModel.destroy();
            }
        },

        initSampleProductsModel: function() {
            var oModel = new JSONModel();

            jQuery.ajax({
                url: sap.ui.require.toUrl("sap/ui/demo/mock/products.json"),
                dataType: "json"
            }).then(function(oData) {
                // prepare and initialize the rank property
                oData.ProductCollection.forEach(function(oProduct) {
                    oProduct.Rank = Utils.ranking.Initial;
                });

                oModel.setData(oData);
            });

            return oModel;
        },

        initSelectedProductsModel: function() {
            var oSelectedProductsModel = new JSONModel({ selectedProducts: [] });
            this.getOwnerComponent().setModel(oSelectedProductsModel, "selectedProductsModel");
        },

        moveToAvailableProductsTable: function() {
            this.byId("selectedProducts").getController().moveToAvailableProductsTable();
        },

        moveToSelectedProductsTable: function() {
            this.byId("availableProducts").getController().moveToSelectedProductsTable();
        }
    });
});
