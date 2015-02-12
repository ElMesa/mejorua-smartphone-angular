//Helpers/Aliases to ease angular console debugging

var DEBUG = DEBUG || {};

(function() {

    DEBUG.angularScope = new function angularScope() {

        this.targetScopeId = "view_mainContent";
        this.scopeActive = undefined; //The actual angular scope gathered

        //Setter for angular scopes. Includes aplying changes to update bindings (So views react acordinglly and enables a rough debugging)
        this.set = function set(attribute, value) {
            if (this._scopeCheckAndGather()) {
                this.scopeActive[attribute] = value;
                this.scopeActive.$apply();
            }
        }

        //Boolean switch for scope attributes
        this.toggle = function toggle(attribute) {
            if (this._scopeCheckAndGather()) {
                var oldValue = this.scopeActive[attribute];
                this.set(attribute, !oldValue);
            }
        }

        this.list = function list() {
            var listedAttributes = {};

            if (this._scopeCheckAndGather()) {

                for (attributeName in this.scopeActive) {
                    if (attributeName[0] != '$') {
                        listedAttributes[attributeName] = this.scopeActive[attributeName];
                    }
                }

            }

            return listedAttributes;
        }

        this.debugEvents = function debugEvents() {
            if (this._scopeCheckAndGather()) {
                var issueBO = this.scopeActive.issueBO;
                var eventTemplate = issueBO.model.events[0];

                event1 = this._clone(eventTemplate);
                event2 = this._clone(eventTemplate);
                event3 = this._clone(eventTemplate);

                event1.type = 'STATE_CHANGE_PENDING';
                event2.type = 'STATE_CHANGE_INPROGRESS';
                event3.type = 'STATE_CHANGE_DONE';

                issueBO.model.events.push(event1);
                issueBO.model.events.push(event2);
                issueBO.model.events.push(event3);

                issueBO.updateViewData();

                this.scopeActive.$apply();
            }
        }

        this._scopeCheckAndGather = function _scopeCheckAndGather() {
            var done = true;

            if (this.scopeActive == undefined) this._scopeGather();
            if (this.scopeActive == undefined) {
                done = false;
                console.log("DEBUG.angularScope._scopeCheckAndGather() - Error - No scope gathered.");
            }

            return done;
        }

        this._scopeGather = function _scopeGather() {
            var targetDOM = document.getElementById(this.targetScopeId);
            this.scopeActive = angular.element(targetDOM).scope();
        }

        this._clone = function clone(obj) {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        }

    }

})();

//Aliases (yeah, polluting global, im a noobster)
function ls() {
    return DEBUG.angularScope.list();
}

function set(attribute, value) {
    DEBUG.angularScope.set(attribute, value);
}

function toggle(attribute) {
    DEBUG.angularScope.toggle(attribute);
}

function debugEvents() {
    DEBUG.angularScope.debugEvents();
}