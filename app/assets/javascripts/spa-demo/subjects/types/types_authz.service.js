(function() {
    "use strict";
  
    angular
      .module("spa-demo.subjects")
      .factory("spa-demo.subjects.TypesAuthz", TypesAuthzFactory);
  
    TypesAuthzFactory.$inject = ["spa-demo.authz.Authz",
                                  "spa-demo.authz.BasePolicy"];
    function TypesAuthzFactory(Authz, BasePolicy) {
      function TypesAuthz() {
        BasePolicy.call(this, "Type");
      }
  
        //start with base class prototype definitions
      TypesAuthz.prototype = Object.create(BasePolicy.prototype);
      TypesAuthz.constructor = TypesAuthz;
  
        //override and add additional methods
      TypesAuthz.prototype.canGetThings=function() {
        //console.log("ItemsAuthz.canCreate");
        return Authz.isAuthenticated();
      };
      TypesAuthz.prototype.canCreate=function() {
        //console.log("ItemsAuthz.canCreate");
        return Authz.isAuthenticated();
      };
      return new TypesAuthz();
    }
  })();
  