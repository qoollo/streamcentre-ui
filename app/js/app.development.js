angular.module('streamCentreApp.development', [])
    .constant('mainConfig', {
        backend: 'http://localhost:5000/',
        updateInterval: 60000,
        getClipTimeout: 500
})