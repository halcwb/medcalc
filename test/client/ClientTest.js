/**
 * Created by halcwb on 22/06/15.
 */
/*jshint -W030 */

/* global dump, chai, medcalc*/

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


    it ('should have an init div', function () {
        medcalc.init();
        var div = document.getElementById('init');
        expect(div).to.be.ok;
    });

});