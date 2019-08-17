(function() {
    "use strict";
  
    angular
      .module("spa-demo.subjects")
      .factory("spa-demo.subjects.Type", TypeFactory);
  
    TypeFactory.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];
    function TypeFactory($resource, APP_CONFIG) {
      var service = $resource(APP_CONFIG.server_url + "/api/types/:id",
        { id: '@id' },
        {
          update: {method: "PUT"},
          save:   {method: "POST", transformRequest: checkEmptyPayload }
        });
      return service;
    }
  
    //rails wants at least one parameter of the document filled in
    //all of our fields are optional
    //ngResource is not passing a null field by default, we have to force it
    function checkEmptyPayload(data) {
      if (!data['label']) {
        data['label']=null;
      } 
      return angular.toJson(data);
    }    
  })();
  