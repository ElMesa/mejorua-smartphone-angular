'use strict';

/**
 * @ngdoc service
 * @name mejoruaSmartphoneAngularApp.ObserverService
 * @description
 * # ObserverService
 * Observer pattern with event subscrition
 *
 * Each observer is subscribed to an event.
 * Notifies only callbacks of an especific event
 */
angular.module('mejoruaSmartphoneAngularApp')
  .service('ObserverService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    this.init = function init() {
    	this.events = {};
    }

    this.create = function create() {
    	var newObserver = angular.copy(this);
    	newObserver.init();
    	return newObserver;
    }

    this.addEvent = function addEvent(eventName) {
    	this.events[eventName] = {};
    	this.events[eventName].nextId = 0;
    	this.events[eventName].subscribers = {};
    }

    this.subscribe = function subscribe(event, callback) {
    	var id = -1;

    	if(this.events[event] != undefined) {
    		id = this.nextId++;
    		this.events[event].subscribers[id] = callback;
    	} else {
    		console.log("ObserverService - subscribe(event:%O) - ERROR - Inexisting event", event);
    	}

    	return id;
    }

    this.unsubscribe = function unsubscribe(event, id) {
		var done = false;

		if(this.events[event] != undefined) {
			if(this.events[event][id] != undefined) {
				delete this.events[event][id];
			} else {
				console.log("ObserverService - unsubscribe(event:%O, id:%O) - ERROR - Inexisting id for event", event, id);
			}
    	} else {
    		console.log("ObserverService - unsubscribe(event:%O, id:%O) - ERROR - Inexisting event", event, id);
    	}    	
    }

    this.notify = function notify(event, data) {
    	var callbackId;
    	var callback;

    	if(this.events[event] != undefined) {
    		for(callbackId in this.events[event].subscribers) {
    			callback = this.events[event].subscribers[callbackId];
    			callback(data);
    		}
    	} else {
    		console.log("ObserverService - notify(event:%O) - ERROR - Inexisting event", event, id);
    	}	
    }

    this.init();

  });
