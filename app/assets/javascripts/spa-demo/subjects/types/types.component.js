(function() {
    "use strict";
  
    angular
      .module("spa-demo.subjects")
      .component("sdTypeSelector", {
        templateUrl: typeSelectorTemplateUrl,
        controller: TypeSelectorController,
        bindings: {
          authz: "<"
        },
      })
      .component("sdTypeEditor", {
        templateUrl: typeEditorTemplateUrl,
        controller: TypeEditorController,
        bindings: {
          authz: "<"
        },
        require: {
          typesAuthz: "^sdTypesAuthz"
        }
      });
  
  
    typeSelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
    function typeSelectorTemplateUrl(APP_CONFIG) {
      return APP_CONFIG.type_selector_html;
    }    
    typeEditorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
    function typeEditorTemplateUrl(APP_CONFIG) {
      return APP_CONFIG.type_editor_html;
    }    
  
    TypeSelectorController.$inject = ["$scope",
                                       "$stateParams",
                                       "spa-demo.authz.Authz",
                                       "spa-demo.subjects.Type"];
    function TypeSelectorController($scope, $stateParams, Authz, Type) {
      var vm=this;
  
      vm.$onInit = function() {
        //console.log("TypeSelectorController",$scope);
        $scope.$watch(function(){ return Authz.getAuthorizedUserId(); }, 
                      function(){ 
                        if (!$stateParams.id) { 
                          vm.items = Type.query(); 
                        }
                      });
      }
      return;
      //////////////
    }
  
  
    TypeEditorController.$inject = ["$rootScope", "$scope","$q",
                                     "$state", "$stateParams",
                                     "spa-demo.authz.Authz",
                                     "spa-demo.subjects.TypesAuthz",
                                     "spa-demo.subjects.Type",
                                     "spa-demo.subjects.TypeThing",
                                     "spa-demo.subjects.TypeLinkableThing",
                                     ];
    function TypeEditorController($rootScope, $scope, $q, $state, $stateParams, 
                                   Authz, TypesAuthz, Type, TypeThing,TypeLinkableThing) {
      var vm=this;
      vm.thingClicked = thingClicked;
      vm.selected_linkables=[];
      vm.create = create;
      vm.clear  = clear;
      vm.update  = update;
      vm.remove  = remove;
      vm.linkThings = linkThings;
  
      vm.$onInit = function() {
        //console.log("TypeEditorController",$scope);
        $scope.$watch(function(){ return Authz.getAuthorizedUserId(); }, 
                      function(){ 
                        if ($stateParams.id) {
                          reload($stateParams.id);
                        } else {
                          newResource();
                        }
                      });
      }
      return;
      //////////////
      function thingClicked(index) {
        vm.thingClicked = index;
        $rootScope.thingClicked = index;
        return vm.thingClicked;
      }    



      function newResource() {
        //console.log("newResource()");
        vm.item = new Type();
        vm.typesAuthz.newItem(vm.item);
        return vm.item;
      }
  
      function reload(typeId) {
        var itemId = typeId ? typeId : vm.item.id;

        vm.item = Type.get({id:itemId});
        if (TypesAuthz.canGetThings()) {
            vm.things = TypeThing.query({type_id: itemId});
            vm.things.$promise.then (function()
            {
              $rootScope.current_type_things = vm.things;
            });
            
            
            $rootScope.$watch('current_type_things', function() {
            });
            $rootScope.$watch('thingClicked', function() {
              console.log("hey, thingClicked has changed!", $rootScope.thingClicked);
            });

        }
        vm.linkable_things = TypeLinkableThing.query({type_id: itemId});
        vm.typesAuthz.newItem(vm.item);
        if (vm.things) {
            $q.all([vm.item.$promise,
                vm.things.$promise]).catch(handleError);
        } else {
            $q.all([vm.item.$promise]).catch(handleError);
        }
      }
  
      function clear() {
        newResource();
        $state.go(".", {id:null});
      }
  
      function create() {
        vm.item.$save().then(
          function(){
             $state.go(".", {id: vm.item.id}); 
          },
          handleError);
      }
  
      function update() {
        vm.item.errors = null;
        var update=vm.item.$update();
        linkThings(update);
      }
  
      function linkThings(parentPromise) {
        var promises=[];
        if (parentPromise) { promises.push(parentPromise); }
        angular.forEach(vm.selected_linkables, function(linkable){
          var resource=TypeThing.save({type_id:vm.item.id}, {thing_id:linkable});
          promises.push(resource.$promise);
        });
  
        vm.selected_linkables=[];
        //console.log("waiting for promises", promises);
        $q.all(promises).then(
          function(response){
            //console.log("promise.all response", response); 
            $scope.typeform.$setPristine();
            reload(); 
          },
          handleError);    
      }
  
      function remove() {
        vm.item.errors = null;
        vm.item.$delete().then(
          function(){ 
            //console.log("remove complete", vm.item);          
            clear();
          },
          handleError);      
      }
  
  
      function handleError(response) {
        //console.log("error", response);
        if (response.data) {
          vm.item["errors"]=response.data.errors;          
        } 
        if (!vm.item.errors) {
          vm.item["errors"]={}
          vm.item["errors"]["full_messages"]=[response]; 
        }      
        $scope.typeform.$setPristine();
      }    
    }
  
  })();