sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "./Utils"
], function (Controller, Utils) {
    "use strict";

    return Controller.extend("sap.m.sample.TableDnD.AvailableProducts", {



        onDropAvailableProductsTable: function (oEvent) {
            var oDraggedItem = oEvent.getParameter("draggedControl");
            var oDraggedItemContext = oDraggedItem.getBindingContext();
            if (!oDraggedItemContext) {
                return;
            }

            // Reset the rank property and update the model to refresh the bindings
            var oAvailableProductsTable = Utils.getAvailableProductsTable(this);
            var oProductsModel = oAvailableProductsTable.getModel();
            oProductsModel.setProperty("Rank", Utils.ranking.Initial, oDraggedItemContext);

            // Update selectedProductsModel to remove the dragged item
            var oSelectedProductsModel = this.getView().getModel("selectedProductsModel");
            if (oSelectedProductsModel) {
                var aOriginalSelectedProducts = oSelectedProductsModel.getProperty("/selectedProducts");
                var sDraggedProduct = oDraggedItemContext.getObject();  // This should be the object itself

                // Log the state before filtering
                console.log("Selected products before removal:", aOriginalSelectedProducts);
                console.log("Product to remove:", sDraggedProduct);

                // Filter out the product with the matching ProductId
                var aFilteredSelectedProducts = aOriginalSelectedProducts.filter(function (oProduct) {
                    console.log("Comparing:", oProduct.ProductId, "with", sDraggedProduct.ProductId);

                    // Use a strict equality check
                    return oProduct.ProductId !== sDraggedProduct.ProductId;
                });

                // Log the state after filtering
                console.log("Selected products after removal:", aFilteredSelectedProducts);

                // Update the model with the new list of selected products
                oSelectedProductsModel.setProperty("/selectedProducts", aFilteredSelectedProducts);

                // Force the model to refresh and reflect the changes
                oSelectedProductsModel.refresh(true);
            } else {
                console.error("selectedProductsModel not found in AvailableProducts controller.");
            }
        },




        moveToSelectedProductsTable: function () {
            var oAvailableProductsTable = Utils.getAvailableProductsTable(this);
            Utils.getSelectedItemContext(oAvailableProductsTable, function (oAvailableItemContext, iAvailableItemIndex) {
                var oSelectedProductsTable = Utils.getSelectedProductsTable(this);
                var oFirstItemOfSelectedProductsTable = oSelectedProductsTable.getItems()[0];
                var iNewRank = Utils.ranking.Default;

                if (oFirstItemOfSelectedProductsTable) {
                    var oFirstContextOfSelectedProductsTable = oFirstItemOfSelectedProductsTable.getBindingContext();
                    iNewRank = Utils.ranking.Before(oFirstContextOfSelectedProductsTable.getProperty("Rank"));
                }

                var oProductsModel = oAvailableProductsTable.getModel();
                oProductsModel.setProperty("Rank", iNewRank, oAvailableItemContext);

                // select the inserted and previously selected item
                oSelectedProductsTable.getItems()[0].setSelected(true);
                var oPrevSelectedItem = oAvailableProductsTable.getItems()[iAvailableItemIndex];
                if (oPrevSelectedItem) {
                    oPrevSelectedItem.setSelected(true);
                }

                // Add the product to the selected products model
                var oSelectedProductsModel = this.getView().getModel("selectedProductsModel");
                var aSelectedProducts = oSelectedProductsModel.getProperty("/selectedProducts");
                aSelectedProducts.push(oAvailableItemContext.getObject());
                oSelectedProductsModel.setProperty("/selectedProducts", aSelectedProducts);
                // setmodel trigger
                this.getView().setModel(oSelectedProductsModel, "selectedProductsModel");
                // Log the contents of selectedProductsModel to console
                var aCurrentSelectedProducts = oSelectedProductsModel.getProperty("/selectedProducts");
                console.log("Selected Products after dropping:", aCurrentSelectedProducts);
            }.bind(this));


        },

        onBeforeOpenContextMenu: function (oEvent) {
            oEvent.getParameter("listItem").setSelected(true);
        }
    });

});
