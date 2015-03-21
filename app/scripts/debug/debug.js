var DEBUG = DEBUG || {};

////////////////////////////////////////////////////////////////////////////////////////////////
///
///	ALIASES (yeah, polluting global, im a noobster)
///
////////////////////////////////////////////////////////////////////////////////////////////////

var angularDebug = DEBUG.angularScope;

function ls() {
    return angularDebug.list();
}

function get(attribute) {
    angularDebug.set(attribute, value);
}

function set(attribute, value) {
    angularDebug.set(attribute, value);
}

function toggle(attribute) {
    angularDebug.toggle(attribute);
}

function debugEvents() {
    angularDebug.debugEvents();
}

function debugLastModifiedDate() {
    angularDebug.debugLastModifiedDate();
}