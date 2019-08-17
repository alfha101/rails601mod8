(function() {
    "use strict";
  
    angular
      .module("spa-demo.subjects")
      .directive("sdTypesAuthz", TypesAuthzDirective);
  
    TypesAuthzDirective.$inject = [];
  
    function TypesAuthzDirective() {
      var directive = {
          bindToController: true,
          controller: TypesAuthzController,
          controllerAs: "vm",
          restrict: "A",
          link: link
      };
      return directive;
  
      function link(scope, element, attrs) {
        //console.log("TypesAuthzDirective",scope);
      }
    }
  
    TypesAuthzController.$inject = ["$scope",
                                     "spa-demo.subjects.TypesAuthz"];
    function TypesAuthzController($scope, TypesAuthz) {
      var vm = this;
      vm.authz={};
      vm.authz.canUpdateItem = canUpdateItem;
      vm.newItem=newItem;
  
      activate();
      return;
      //////////
      function activate() {
        vm.newItem(null);
      }
  
      function newItem(item) {
        TypesAuthz.getAuthorizedUser().then(
          function(user){ authzUserItem(item, user); },
          function(user){ authzUserItem(item, user); });
      }
  
      function authzUserItem(item, user) {
        //console.log("new Item/Authz", item, user);
  
        vm.authz.authenticated = TypesAuthz.isAuthenticated();
        vm.authz.canQuery      = TypesAuthz.canQuery();
        vm.authz.canCreate = TypesAuthz.canCreate();
        if (item && item.$promise) {
          vm.authz.canUpdate     = false;
          vm.authz.canDelete     = false;
          vm.authz.canGetDetails = false;
          vm.authz.canGetThings = false;
          item.$promise.then(function(){ checkAccess(item); });
        } else {
          checkAccess(item)
        }
      }
  
      function checkAccess(item) {
        vm.authz.canUpdate     = TypesAuthz.canUpdate(item);
        vm.authz.canDelete     = TypesAuthz.canDelete(item);
        vm.authz.canGetDetails = TypesAuthz.canGetDetails(item);
        vm.authz.canGetThings = TypesAuthz.canGetThings();
        //console.log("checkAccess", item, vm.authz);
      }    
  
      function canUpdateItem(item) {
        return TypesAuthz.canUpdate(item);
      }    
    }
  })();
  