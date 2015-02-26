# MejorUA Smartphone client with angular

Rewrite of the client in angular

## Tasks

* IssueMap view
    * Show all issues
        * Marker color from issue state
        * On click, brief details about the issue, also with color coding (background color)
        * Link to issue details
    * Include marker clustering: http://tombatossals.github.io/angular-leaflet-directive/examples/markers-clustering-example.html
    * Test map refresh on add
* Fix IssueDetail - notify mode
* Issue change state
* Issue List/Map filtering

## Research

* IssueDAO - IssueCollection - Smart update after adding items
    * Now after post (via IssueDAO.add()) we fetch all the issues again. It would be interesting getting just the issue posted by a new request, or from de post response
        * Restangular.collection.post response returns a promise. Maybe if API returns the added item it could be retrieved from there, or at least the id of the added item, so we can perform a single request
          
