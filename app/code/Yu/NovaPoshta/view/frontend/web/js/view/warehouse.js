define([
    'jquery',
    'Magento_Ui/js/form/element/select',
    'Magento_Checkout/js/model/quote',
    'Yu_NovaPoshta/js/model/city',
    'Magento_Customer/js/model/address-list',
    'mage/translate',
    'Yu_NovaPoshta/js/lib/select2/select2'
], function ($, Select, quote, city, addressList) {
    'use strict';

    return Select.extend({

        defaults: {
            warehouseName: '',
            exports: {
                warehouseName: '${ $.parentName }.shipping-address-fieldset.street.0:value'
            }
        },

        warehouses: {
        },

        initialize: function () {
            this._super();
            this.setOptions(this.warehouses);
            this.warehouseName(this.getPreview());
            return this;
        },

        initObservable: function () {
            this._super();
            this.observe('warehouseName');
            return this;
        },

        selectedMethodCode: function () {

            var method = quote.shippingMethod();
            var selectedMethodCode = method != null ? method.method_code : false;

            if (selectedMethodCode === 'novaposhta_to_warehouse') {
                city.loadCityWarehouses(this);
            }
            return selectedMethodCode;
        },

        setDifferedFromDefault: function () {
            this._super();
            this.warehouseName(this.getPreview());
        },

        setWarehouses: function (data) {
            this.clear();
            this.warehouses = data;
            this.setOptions(this.warehouses);

            if (addressList().length > 0) {
                var street = quote.shippingAddress().street[0];
                if (street != '' && street != undefined) {
                    $("[name='warehouse_novaposhta_id'] option:contains(" + street + ")").attr('selected', 'selected');
                }
            }
        },

        select2: function (element) {
            $(element).select2({
                placeholder: $.mage.__('choose a branch'),
                dropdownAutoWidth: true,
                width: $(element).parent().parent().width().toString() + 'px'
            });
        }
    });
});