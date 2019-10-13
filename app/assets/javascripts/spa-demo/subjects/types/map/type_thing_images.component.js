(function() {
    "use strict";
  
    angular
      .module("spa-demo.subjects")
      .component("sdCurrentImages", {
        templateUrl: imagesTemplateUrl,
        controller: CurrentImagesController,
      })
      .component("sdCurrentImageViewer", {
        templateUrl: imageViewerTemplateUrl,
        controller: CurrentImageViewerController,
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
  
    CurrentImagesController.$inject = ["$scope",
                                       "spa-demo.subjects.typeThing"];
    function CurrentImagesController($scope, typeThing) {
      var vm=this;
      vm.imageClicked = imageClicked;
      vm.isCurrentImage = typeThing.isCurrentImageIndex;
  
      vm.$onInit = function() {
        console.log("CurrentImagesController",$scope);
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
        typeThing.setCurrentImage(index);
      }
    }
  
    CurrentImageViewerController.$inject = ["$scope",
                                            "spa-demo.subjects.typeThing"];
    function CurrentImageViewerController($scope, typeThing) {
      var vm=this;
      vm.viewerIndexChanged = viewerIndexChanged;
  
      vm.$onInit = function() {
        console.log("CurrentImageViewerController",$scope);
      }
      vm.$postLink = function() {
        $scope.$watch(
          function() { return typeThing.getImages(); }, 
          function(images) { vm.images = images; }
        );
        $scope.$watch(
          function() { return typeThing.getCurrentImageIndex(); }, 
          function(index) { vm.currentImageIndex = index; }
        );
      }    
      return;
      //////////////
      function viewerIndexChanged(index) {
        console.log("viewer index changed, setting currentImage", index);
        typeThing.setCurrentImage(index);
      }
    }
  
  })();
  