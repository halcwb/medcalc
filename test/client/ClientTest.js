/**
 * Created by halcwb on 22/06/15.
 */

/* global dump, chai */

var assert = chai.assert;
var expect = chai.expect;

describe("Hello World", function () {
    "use strict";

    it("should run", function () {
        assert.equal('bar', 'bar');
        expect('foo').to.equal('foo');
    });

});