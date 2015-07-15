/* global angular */
(function() {
    'use strict';

    angular
        .module('angularScreenfull')
        .directive('showIfFullscreen', showIfFullscreenDirective);

    /**
     * @ngdoc directive
     * @name angularScreenfull.directive:showIfFullscreen
     * @restrict A
     *
     * @description
     * Shows or hides the element (using ng-hide) if the closest
     * parent that has the ngsf-fullscreen directive is in fullscreen mode.
     *
     * By default the element shows itself if its fullscreen or hides otherwise, but you can
     * change this behaviour by passing false to the directive
     *
     * @param {boolean=}  showIfFullscreen   If false it inverts the show/hide behaviour. Defaults to true.
     *
     */

    showIfFullscreenDirective.$inject = ['$animate'];

    function showIfFullscreenDirective ($animate) {
        // Directive definition
        return {
            restrict: 'A',
            require: '^ngsfFullscreen',
            link: link
        };

        function link (scope, elm, attrs, fullScreenCtrl) {
            var hideOrShow = function () {

                var show = fullScreenCtrl.isFullscreen();
                if (attrs.showIfFullscreen === 'false' || attrs.showIfFullscreen === false) {
                    show = !show;
                }

                if (show) {
                    $animate.removeClass(elm, 'ng-hide');
                } else {
                    $animate.addClass(elm, 'ng-hide');
                }
            };
            hideOrShow();
            var unwatch = fullScreenCtrl.onFullscreenChange(hideOrShow);
            scope.$on('$destroy', unwatch);
        }
    }
})();
