/* global angular, screenfull */
(function() {
    'use strict';

    angular
        .module('angularScreenfull')
        .directive('ngsfFullscreen', ngsfFullscreenDirective);

    /**
     * @ngdoc directive
     * @name angularScreenfull.directive:ngsfFullscreen
     * @restrict A
     *
     * @description
     * Marks the element that is going to be fullscreen
     *
     * @param {string=}  ngsfFullscreen  An optional expression to store the fullscreen controller
     *
     * @example
   <example  module="myApp">
     <file name="app.js">
        angular.module('myApp', ['angularScreenfull']);
     </file>
     <file name="index.html">
        <div ngsf-fullscreen>
            <p>This is a fullscreen element</p>
            <button ngsf-toggle-fullscreen>Toggle fullscreen</button>
        </div>
     </file>
   </example>
     */

    ngsfFullscreenDirective.$inject = ['$parse'];
    function ngsfFullscreenDirective ($parse) {
        return {
            restrict: 'A',
            require: 'ngsfFullscreen',
            controller: NgsfFullscreenController,
            link: link
        };

        function link (scope, elm, attrs, ctrl) {
            // If the directive has a value, add the controller to the scope under that name
            if (attrs.ngsfFullscreen && attrs.ngsfFullscreen !== '') {
                var p = $parse(attrs.ngsfFullscreen);
                p.assign(scope, ctrl);
            }

            // Make this the current fullscreen element
            ctrl.setFullScreenElement(elm[0]);
        }
    }

    NgsfFullscreenController.$inject = ['$scope', '$document'];
    function NgsfFullscreenController ($scope, $document) {
        var ctrl = this;

        ctrl.setFullScreenElement = setFullScreenElement;
        ctrl.onFullscreenChange = onFullscreenChange;
        ctrl.requestFullscreen = requestFullscreen;
        ctrl.removeFullscreen = removeFullscreen;
        ctrl.toggleFullscreen = toggleFullscreen;
        ctrl.isFullscreen = isFullscreen;
        ctrl.fullscreenEnabled = fullscreenEnabled;

        function subscribeToEvents () {
            var fullscreenchange = function () {
                if (ctrl.isFullscreen()) {
                    angular.element(_elm).addClass('fullscreen');
                } else {
                    angular.element(_elm).removeClass('fullscreen');
                }
                $scope.$emit('fullscreenchange');
                $scope.$apply();
            };

            $document[0].addEventListener(screenfull.raw.fullscreenchange, fullscreenchange);
            $scope.$on('$destroy', function() {
                $document[0].removeEventListener(screenfull.raw.fullscreenchange, fullscreenchange);
            });
        }
        if (ctrl.fullscreenEnabled()) {
            subscribeToEvents();
        }

        ////////////////////////////////////////

        var _elm;

        function setFullScreenElement (elm) {
            _elm = elm;
        }

        function onFullscreenChange (handler) {
            return $scope.$on('fullscreenchange', handler);
        }

        function requestFullscreen () {
            if (ctrl.fullscreenEnabled()) {
                screenfull.request(_elm);
                $scope.$emit('fullscreenEnabled');
                return true;
            }
            return false;
        }

        function removeFullscreen () {
            if (ctrl.fullscreenEnabled()) {
                if (ctrl.isFullscreen()) {
                    ctrl.toggleFullscreen();
                }
            }
        }

        function toggleFullscreen () {
            if (ctrl.fullscreenEnabled()) {
                var isFullscreen = screenfull.isFullscreen;
                screenfull.toggle(_elm);
                if (isFullscreen) {
                    $scope.$emit('fullscreenDisabled');
                } else {
                    $scope.$emit('fullscreenEnabled');
                }
                return true;
            }
            return false;
        }

        function isFullscreen () {
            if (ctrl.fullscreenEnabled()) {
                return screenfull.isFullscreen;
            }
            return false;
        }

        function fullscreenEnabled () {
            if (typeof screenfull !== 'undefined') {
                return screenfull.enabled;
            }
            return false;
        }
    }
})();

