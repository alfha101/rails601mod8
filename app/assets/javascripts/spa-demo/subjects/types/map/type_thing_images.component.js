(function() {
    "use strict";
  
    angular
      .module("spa-demo.subjects")
      .component("sdTypeImages", {
        templateUrl: imagesTemplateUrl,
        controller: TypeImagesController,
      })
      .component("sdTypeImageViewer", {
        templateUrl: imageViewerTemplateUrl,
        controller: TypeImageViewerController,
        bindings: {
          name: "@",
          minWidth: "@"
        }
      })
      ;
  
    imagesTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
    function imagesTemplateUrl(APP_CONFIG) {
      return APP_CONFIG.current_images_html;
    }    
    imageViewerTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
    function imageViewerTemplateUrl(APP_CONFIG) {
      return APP_CONFIG.current_image_viewer_html;
    }    
  
    TypeImagesController.$inject = ["$scope",
                                       "spa-demo.subjects.typeThing"];
    function TypeImagesController($scope, typeThing) {
      var vm=this;
      vm.imageClicked = imageClicked;
      vm.isTypeImage = typeThing.isTypeImageIndex;
  
      vm.$onInit = function() {
        console.log("TypeImagesController",$scope);
      }
      vm.$postLink = function() {
        $scope.$watch(
          function() { return typeThing.getImages(); }, 
          function(images) { vm.images = images; }
        );
      }    
      return;
      //////////////
      function imageClicked(index) {
        typeThing.setTypeImage(index);
      }
    }
  
    TypeImageViewerController.$inject = ["$scope",
                                            "spa-demo.subjects.typeThing"];
    function TypeImageViewerController($scope, typeThing) {
      var vm=this;
      vm.viewerIndexChanged = viewerIndexChanged;
  
      vm.$onInit = function() {
        console.log("TypeImageViewerController",$scope);
      }
      vm.$postLink = function() {
        $scope.$watch(
          function() { return typeThing.getImages(); }, 
          function(images) { vm.images = images; }
        );
        $scope.$watch(
          function() { return typeThing.getTypeImageIndex(); }, 
          function(index) { vm.currentImageIndex = index; }
        );
      }    
      return;
      //////////////
      function viewerIndexChanged(index) {
        console.log("viewer index changed, setting currentImage", index);
        typeThing.setTypeImage(index);
      }
    }
  
  })();
  