// selectedproducts.controller.js

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/ColumnListItem",
    "./Utils"
], function (Controller, JSONModel, ColumnListItem, Utils) {
    "use strict";

    return Controller.extend("sap.m.sample.TableDnD.SelectedProducts", {

        onInit: function () {
            // No need to create the model again here if initialized in Component.js
            // Just retrieve it
            var oSelectedProductsModel = this.getView().getModel("selectedProductsModel");
            if (!oSelectedProductsModel) {
                // Handle error if model not found
                console.error("selectedProductsModel not found in SelectedProducts controller.");
            }
        },

        moveToAvailableProductsTable: function () {
            var oSelectedProductsTable = Utils.getSelectedProductsTable(this);
            Utils.getSelectedItemContext(oSelectedProductsTable, function (oSelectedItemContext, iSelectedItemIndex) {
                // Reset the rank property and update the model to refresh the bindings
                var oProductsModel = oSelectedProductsTable.getModel();
                oProductsModel.setProperty("Rank", Utils.ranking.Initial, oSelectedItemContext);

                // Remove the product from the selected products model
                var oSelectedProductsModel = this.getView().getModel("selectedProductsModel");
                var aSelectedProducts = oSelectedProductsModel.getProperty("/selectedProducts");
                aSelectedProducts = aSelectedProducts.filter(function (oProduct) {
                    return oProduct !== oSelectedItemContext.getObject();
                });
                oSelectedProductsModel.setProperty("/selectedProducts", aSelectedProducts);

                // Select the previously selected position
                var aItemsOfSelectedProductsTable = oSelectedProductsTable.getItems();
                var oPrevItem = aItemsOfSelectedProductsTable[Math.min(iSelectedItemIndex, aItemsOfSelectedProductsTable.length - 1)];
                if (oPrevItem) {
                    oPrevItem.setSelected(true);
                }
            }.bind(this));
        },

        onDropSelectedProductsTable: function (oEvent) {
            var oDraggedItem = oEvent.getParameter("draggedControl");
            var oDraggedItemContext = oDraggedItem.getBindingContext();
            if (!oDraggedItemContext) {
                return;
            }
        
            var oRanking = Utils.ranking;
            var iNewRank = oRanking.Default;
            var oDroppedItem = oEvent.getParameter("droppedControl");
        
            if (oDroppedItem instanceof sap.m.ColumnListItem) {
                // Get the dropped row data
                var sDropPosition = oEvent.getParameter("dropPosition");
                var oDroppedItemContext = oDroppedItem.getBindingContext();
                var iDroppedItemRank = oDroppedItemContext.getProperty("Rank");
                var oDroppedTable = oDroppedItem.getParent();
                var iDroppedItemIndex = oDroppedTable.indexOfItem(oDroppedItem);
        
                // Find the new index of the dragged row depending on the drop position
                var iNewItemIndex = iDroppedItemIndex + (sDropPosition === "After" ? 1 : -1);
                var oNewItem = oDroppedTable.getItems()[iNewItemIndex];
                if (!oNewItem) {
                    // Dropped before the first row or after the last row
                    iNewRank = oRanking[sDropPosition](iDroppedItemRank);
                } else {
                    // Dropped between first and the last row
                    var oNewItemContext = oNewItem.getBindingContext();
                    iNewRank = oRanking.Between(iDroppedItemRank, oNewItemContext.getProperty("Rank"));
                }
            }
        
            // Set the rank property and update the model to refresh the bindings
            var oSelectedProductsTable = Utils.getSelectedProductsTable(this);
            var oProductsModel = oSelectedProductsTable.getModel();
            oProductsModel.setProperty("Rank", iNewRank, oDraggedItemContext);
        
            // Add the product to the selected products model
            var oSelectedProductsModel = this.getView().getModel("selectedProductsModel");
            var aSelectedProducts = oSelectedProductsModel.getProperty("/selectedProducts");
            aSelectedProducts.push(oDraggedItemContext.getObject());
            oSelectedProductsModel.setProperty("/selectedProducts", aSelectedProducts);
            // setmodel trigger
            this.getView().setModel(oSelectedProductsModel, "selectedProductsModel");
            // Log the contents of selectedProductsModel to console
            var aCurrentSelectedProducts = oSelectedProductsModel.getProperty("/selectedProducts");
            console.log("Selected Products after dropping:", aCurrentSelectedProducts);
        },
        
        

        // Save the selected products and log them to the console
        saveSelectedProducts: function () {
            var oSelectedProductsModel = this.getView().getModel("selectedProductsModel");
            var aSelectedProducts = oSelectedProductsModel.getProperty("/selectedProducts");
            console.log("Selected Products:", aSelectedProducts);
            // Additional logic to save data can be added here
        },

        moveSelectedItem: function (sDirection) {
            var oSelectedProductsTable = Utils.getSelectedProductsTable(this);
            Utils.getSelectedItemContext(oSelectedProductsTable, function (oSelectedItemContext, iSelectedItemIndex) {
                var iSiblingItemIndex = iSelectedItemIndex + (sDirection === "Up" ? -1 : 1);
                var oSiblingItem = oSelectedProductsTable.getItems()[iSiblingItemIndex];
                var oSiblingItemContext = oSiblingItem.getBindingContext();
                if (!oSiblingItemContext) {
                    return;
                }

                // Swap the selected and the sibling's rank
                var oProductsModel = oSelectedProductsTable.getModel();
                var iSiblingItemRank = oSiblingItemContext.getProperty("Rank");
                var iSelectedItemRank = oSelectedItemContext.getProperty("Rank");

                oProductsModel.setProperty("Rank", iSiblingItemRank, oSelectedItemContext);
                oProductsModel.setProperty("Rank", iSelectedItemRank, oSiblingItemContext);

                // After move, select the sibling
                oSelectedProductsTable.getItems()[iSiblingItemIndex].setSelected(true).focus();
            });
        },

        moveUp: function (oEvent) {
            this.moveSelectedItem("Up");
            oEvent.getSource().focus();
        },

        moveDown: function (oEvent) {
            this.moveSelectedItem("Down");
            oEvent.getSource().focus();
        },

        onBeforeOpenContextMenu: function (oEvent) {
            oEvent.getParameters().listItem.setSelected(true);
        }
    });

});
