sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"./Utils"
], function(Controller, Utils) {
	"use strict";

	return Controller.extend("sap.m.sample.TableDnD.AvailableProducts", {

		

		onDropAvailableProductsTable: function(oEvent) {
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
                var aSelectedProducts = oSelectedProductsModel.getProperty("/selectedProducts");
                // Filter out the dragged item based on ProductID STARTING FROM LINE 28, IT IS FAILING , FIX IT
                aSelectedProducts = aSelectedProducts.filter(function(oProduct) {
                    return oProduct.ProductID !== oDraggedItemContext.getProperty("ProductID");
                });
                oSelectedProductsModel.setProperty("/selectedProducts", aSelectedProducts);
        
                // Log the updated selectedProductsModel to console
                console.log("Updated selectedProductsModel after removing:", aSelectedProducts);
            } else {
                console.error("selectedProductsModel not found in AvailableProducts controller.");
            }
        },
		
		
		

		moveToSelectedProductsTable: function() {
			var oAvailableProductsTable = Utils.getAvailableProductsTable(this);
			Utils.getSelectedItemContext(oAvailableProductsTable, function(oAvailableItemContext, iAvailableItemIndex) {
				var oSelectedProductsTable = Utils.getSelectedProductsTable(this);
				var oFirstItemOfSelectedProductsTable = oSelectedProductsTable.getItems()[0];
				var iNewRank = Utils.ranking.Default;

				if (oFirstItemOfSelectedProductsTable) {
					var oFirstContextOfSelectedProductsTable = oFirstItemOfSelectedProductsTable.getBindingContext();
					iNewRank =  Utils.ranking.Before(oFirstContextOfSelectedProductsTable.getProperty("Rank"));
				}

				var oProductsModel = oAvailableProductsTable.getModel();
				oProductsModel.setProperty("Rank", iNewRank, oAvailableItemContext);

				// select the inserted and previously selected item
				oSelectedProductsTable.getItems()[0].setSelected(true);
				var oPrevSelectedItem = oAvailableProductsTable.getItems()[iAvailableItemIndex];
				if (oPrevSelectedItem) {
					oPrevSelectedItem.setSelected(true);
				}
			}.bind(this));
		},

		onBeforeOpenContextMenu: function(oEvent) {
			oEvent.getParameter("listItem").setSelected(true);
		}
	});

});
