/* global angular */
(function() {
    'use strict';

    angular
        .module('angularScreenfull')
        .directive('showIfFullscreenEnabled', showIfFullscreenEnabledDirective);

    /**
     * @ngdoc directive
     * @name angularScreenfull.directive:showIfFullscreenEnabled
     * @restrict A
     *
     * @description
     * Shows or hides the element (using ng-hide) if the browser has fullscreen
     * capabilities.
     *
     */

    showIfFullscreenEnabledDirective.$inject = ['$animate'];

    function showIfFullscreenEnabledDirective ($animate) {
        // Directive definition
        return {
            restrict: 'A',
            require: '^ngsfFullscreen',
            link: link
        };

        function link (scope, elm, attrs, fullScreenCtrl) {
            if (fullScreenCtrl.fullscreenEnabled()) {
                $animate.removeClass(elm, 'ng-hide');
            } else {
                $animate.addClass(elm, 'ng-hide');
            }
        }
    }
})();
