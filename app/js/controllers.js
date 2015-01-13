streamCentreApp.controller('StreamListCtrl', function ($scope, $http, $interval, $timeout, $filter, $sce, mainConfig) {
    function updateStreams() {
        $http.get(mainConfig.backend + 'streams/').success(function(data) {
            $scope.streams = data.result;
            if (!angular.isDefined($scope.selectedStream))
                $scope.selectStream(data.result[data.result.length - 1].id);
        })
    }
    

    var updateTimer;
    function startUpdate() {
        updateTimer = $interval(updateStreams, mainConfig.updateInterval);
    }

    function stopUpdate() {
        if (angular.isDefined(updateTimer)) {
            $interval.cancel(updateTimer);
            updateTimer = undefined;
        }
    }

    $scope.newStreamForm = {
        isShown: false,
        url: '',
        description: '',
        addStream: function() {
            var params = { url: this.url, description: this.description }
            $http.post(mainConfig.backend + 'streams/create', params).success(function(form) {
                return function() {
                    updateStreams();
                    form.isShown = false;
                }
            }($scope.newStreamForm));
        }
    }

    function resetSelectedStream() {
        $scope.selectedStream = {
            id: undefined,
            status: undefined,
            clips: undefined,
            selectedClip: undefined,
            videoSrc: undefined
        }
    }

    $scope.selectClip = function(index) {
        $scope.selectedStream.selectedClip = index;
        $scope.selectedStream.videoSrc = $sce.trustAsResourceUrl($scope.selectedStream.clips[index].link);
    }

    var getClipTimer;
    function startGetClip(streamId, start, stop) {
        stopGetClip();

        $http({
            url: mainConfig.backend + 'streams/' + streamId + '/get_clip', 
            method: "GET",
            params: { start: start, stop: stop }
        }).success(function(data) {
            if (data.status == 'done') {
                $scope.selectedStream.clips = data.clips;
                $scope.selectClip(0);
            }
            else
                getClipTimer = $timeout(function () {
                    startGetClip(streamId, start, stop);
                }, mainConfig.getClipTimeout)
        });
    }

    function stopGetClip() {
        if (angular.isDefined(getClipTimer)) {
            $timeout.cancel(getClipTimer);
            getClipTimer = undefined;
        }
    }

    $scope.selectStream = function(streamId) {
        resetSelectedStream();

        $http.get(mainConfig.backend + 'streams/' + streamId + '/status').success(function(data) {
            $scope.selectedStream.id = streamId;
            $scope.selectedStream.status = data;

            if (data.start_date) {
                var stop_date = data.stop_date ? data.stop_date : parseInt(Date.now() / 1000);
                startGetClip(streamId, data.start_date, stop_date);
            }
            else
                $scope.selectedStream.clips = undefined;
        });
    }

    $scope.startStream = function(streamId) {
        $http.post(mainConfig.backend + 'streams/' + streamId + '/start').success(function(data) {
            updateStreams();
        });
    }

    $scope.stopStream = function(streamId) {
        $http.post(mainConfig.backend + 'streams/' + streamId + '/stop').success(function(data) {
            updateStreams();
        });
    }

    $scope.removeStream = function(streamId) {
        $http.post(mainConfig.backend + 'streams/' + streamId + '/remove').success(function(data) {
            updateStreams();
        });
        return false;
    }

    resetSelectedStream();
    updateStreams();
    startUpdate();

    $scope.$on('$destroy', function() {
        stopUpdate();
    });
});