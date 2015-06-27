/**
 * Created by halcwb on 22/06/15.
 */

/* global dump, chai, webix, $$, medcalc*/

var assert = chai.assert;
var expect = chai.expect;

describe("Medcalc", function () {
    "use strict";

    it("should run", function () {
        assert.equal('bar', 'bar');
        expect('foo').to.equal('foo');
    });


    it ('should have global object medcalc', function () {
        expect(medcalc).to.be.a('object');
    });


    it ('should have an init method', function () {
        expect(medcalc.init).to.be.a('function');
    });


    it ('should be possible to run init twice', function () {
        medcalc.init(medcalc.viewport);
        medcalc.init(medcalc.viewport);
    });


    it ('should have an init div', function () {
        medcalc.init(medcalc.viewport);
        var div = document.getElementById('init');
        expect(div).to.be.ok;
    });

    it('should have the right version of webix loaded', function () {
        expect(webix).to.be.ok;
        expect(webix.version).to.equal('2.4.7');
    });

    it('should be able to find the app root div', function () {
        var root = $$('medcalc');
        expect(root).to.be.ok;
    });

});