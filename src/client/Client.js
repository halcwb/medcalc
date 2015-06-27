/**
 * Created by halcwb on 23/06/15.
 */

/* global console, webix, $$ */

var medcalc = {};

medcalc.welcomeText = "<b>Welcome to the medical calculator</b>";

medcalc.viewport = {
    id: 'medcalc',
    type: 'line',
    padding: 20,
    rows: [
        { id: 'welcome', template: medcalc.welcomeText, height: 50 },
        {
            id: 'patient-details',
            view: 'form',
            elements: [
                { template: "Patient details", type: 'section' },
                { view: 'text', label: 'Age' },
                { view: 'text', label: 'Weight' }
            ]
        }
    ]
};

medcalc.isInitialized = false;


(function () {
    "use strict";

    medcalc.init = function (uiConfig) {
        if (!medcalc.isInitialized) {
            var node = document.createElement('div');
            node.setAttribute('id', 'init');
            document.body.appendChild(node);

            webix.ui(uiConfig);

            console.log('medcalc is initialized');
            medcalc.isInitialized = true;
        }
    };

    webix.ready(function () {
        medcalc.init(medcalc.viewport);
    });

})();