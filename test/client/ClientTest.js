/**
 * Created by halcwb on 22/06/15.
 */

/* global dump, chai */
"use strict";

var assert = chai.assert;
var expect = chai.expect;

describe("Hello World", function () {

    it("should run", function () {
        assert.equal('bar', 'bar');
        expect('foo').to.equal('foo');
    });

});