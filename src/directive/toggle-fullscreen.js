/* global angular */
(function() {
    'use strict';

    angular
        .module('angularScreenfull')
        .directive('ngsfToggleFullscreen', ngsfToggleFullscreenDirective);

    /**
     * @ngdoc directive
     * @name angularScreenfull.directive:ngsfToggleFullscreen
     * @restrict A
     *
     * @description
     * Adds a click handler to the element that toggles the nearest ngsf-fullscreen element
     *
     */

    function ngsfToggleFullscreenDirective () {
        // Directive definition
        return {
            restrict: 'A',
            require: '^ngsfFullscreen',
            link: link
        };

        function link (scope, elm, attr, fullScreenCtrl) {
            elm.on('click', function() {
                fullScreenCtrl.toggleFullscreen();
            });
        }
    }
})();
