(function() {
    "use strict";
  
    angular
      .module("spa-demo.subjects")
      .component("sdTypeThings", {
        templateUrl: thingsTemplateUrl,
        controller: TypeThingsController,
      })
      .component("sdTypeThingInfo", {
        templateUrl: thingInfoTemplateUrl,
        controller: TypeThingInfoController,
      })
      ;
  
    thingsTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
    function thingsTemplateUrl(APP_CONFIG) {
      return APP_CONFIG.current_things_html;
    }    
    thingInfoTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
    function thingInfoTemplateUrl(APP_CONFIG) {
      return APP_CONFIG.current_thing_info_html;
    }    
  
    TypeThingsController.$inject = ["$rootScope","$scope",
                                       "spa-demo.subjects.typeThing"];
    function TypeThingsController($rootScope,$scope,typeThing) {
      var vm=this;
      vm.thingClicked = thingClicked;
      vm.isCurrentThing = typeThing.isCurrentThingIndex;
      
      vm.$onInit = function() {
        console.log("CurrentThingsController",$scope);
      }
      vm.$postLink = function() {
        $scope.$watch(
          function() { return typeThing.getThings(); }, 
          // function(things) { vm.things = things; }
          function() { vm.things = $rootScope.current_type_things; }
        );
      }    
      return;
      //////////////
      function thingClicked(index) {
        typeThing.setCurrentThing(index);
      }    
    }
  
    TypeThingInfoController.$inject = ["$scope",
                                          "spa-demo.subjects.typeThing",
                                          "spa-demo.subjects.Thing",
                                          "spa-demo.authz.Authz"];
    function TypeThingInfoController($scope,typeThing, Thing, Authz) {
      var vm=this;
      vm.nextThing = typeThing.nextThing;
      vm.previousThing = typeThing.previousThing;
  
      vm.$onInit = function() {
        console.log("TypeThingInfoController",$scope);
      }
      vm.$postLink = function() {
        $scope.$watch(
          function() { return typeThing.getCurrentThing(); }, 
          newThing 
        );
        $scope.$watch(
          function() { return Authz.getAuthorizedUserId(); },
          function() { newThing(typeThing.getCurrentThing()); }
        );        
      }    
      return;
      //////////////
      function newThing(link) {
        vm.link = link; 
        vm.thing = null;
        if (link && link.thing_id) {
          vm.thing=Thing.get({id:link.thing_id});
        }
      }
  
  
  
  
  
  
  
    }
  })();
  