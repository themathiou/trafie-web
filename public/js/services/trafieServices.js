
angular.module('trafie.services', []);

(function () {
    'use strict';

    // NOTE: To avoid circular dependencies, make sure that a service can only include services
    // that are defined above it in the list below.

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // *** alertSvc ***
    // Alert messages service
    ///////////////////////////////////////////////////////////////////////////////////////////////
    angular.module('trafie.services').factory('AlertSvc', [
        '$rootScope',
        '$http',
        AlertSvcImpl
    ]);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // *** modalSvc ***
    // Modals service
    ///////////////////////////////////////////////////////////////////////////////////////////////
    angular.module('trafie.services').factory('ModalSvc', [
        '$modal',
        '$http',
        'Activity',
        ModalSvcImpl
    ]);
})();