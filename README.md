# MejorUA Smartphone client with angular

Rewrite of the client in angular

## Tasks

* RoomElementsDAO
    * Check correct RoomElementIndex creation. Room SIGUA:0007PB017 UGE:0003 should have more than 1 item, but only one appearing.

* IssueNotify - Use RoomElements data on view

* Issues::Update
    * Solve view not updated after update response
        * Tried using $.extend(true, targetObject, updatedObject) to set values, instead of replacing the whole object (http://stackoverflow.com/questions/9454863/updating-javascript-object-property)
    
* Notify issues
    * Add user visual feedback and maybe redirection to map or issue details of generated issue
* IssueDetailView - Migrating from issue.view approach in the IssueBO service to raw data access (issue.models.X.Y), and doing the mapping (Ex: modelState2viewCSS) in view instead of in the service, exposing those modelState2viewCSS and so throught the controller to view. This avoids some update problems, reliying on angular bindings instead
* BUG - On notify issue view, if backbutton to map is used, map modes crashes, and issue markers disappear
* Issue change state
* Issue List/Map filtering
* IssueMap view
    * Include marker clustering: http://tombatossals.github.io/angular-leaflet-directive/examples/markers-clustering-example.html
    * Marker popup - View deatils button: Use CSS preprocesor to bind ".issue a.stateX" to "btn btn-X" so we have more flexibility to change theming
* Users: Implement collaborators, resolvers, and resolver groups
* Filters: Generic filtering system, {Resolver} filters list, {ResolverGroup} filters list (shared with all members)
* Contact info: {Resolvers} & {ResolversGroup} contact info needed to resolve the action demanded
* Materials list for rooms and activities
* {User.collaborator} - Feedback once issue is resolved in form of satisfaction of the results (boolena, or 1-5stars, 1-10 points, list of "feelings about" like, acceptable, needs get better) Inspired by customer feedback from Salesforce service (https://www.youtube.com/watch?v=H9fR_kuJp2w#t=74)

## Research

* Check Salesforce videos to get inspiration:https://www.salesforce.com/eu/form/demo/conf/demo-overview.jsp
* IssueDAO - IssueCollection - Smart update after adding items
    * Now after post (via IssueDAO.add()) we fetch all the issues again. It would be interesting getting just the issue posted by a new request, or from de post response
        * Restangular.collection.post response returns a promise. Maybe if API returns the added item it could be retrieved from there, or at least the id of the added item, so we can perform a single request
          
