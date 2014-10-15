var app = angular.module('dontpanic', ['ngCordova']);

app.controller('GuidelineCtrl', function($scope, $window, $cordovaFile, $cordovaVibration, $cordovaToast){
    $scope.title = "Nice Guidelines";
    
    $scope.guidelines = $window.guidelines.guidelines || [];
    $scope.categories = $window.guidelines.categories || [];
    $scope.nice_dir = '/sdcard/Download/nice_guidelines2/'

    $scope._openPdf = function(filename){
        cordova.plugins.fileOpener2.open(
            filename,
            'application/pdf', 
            { 
                error : function(errorObj) { 
                    alert('Error status: ' + errorObj.status + ' - Error message: ' + errorObj.message); 
                },
                success : function () {
                    // I don't think we need to do anything here ?
                }
            }
        );
    };

    $scope._downloadGuideline = function(url, filename){
        $cordovaToast.showShortCenter('Downloading...')
        $cordovaFile.downloadFile(url, filename, true, {}).then(
            function(result) {
                // Success! 
                $scope._openPdf(filename)
            }, function(err) {
                // Error
                alert('failed download')
            }, function (progress) {
                // constant progress updates
            });
    };

    $scope.openGuideline = function($index){
        var guideline = $scope.guidelines[$index];
        var url = guideline.url;
        var filename = $scope.nice_dir + url.substr(url.lastIndexOf('/') + 1) + '.pdf';

        $cordovaFile.createDir($scope.nice_dir, false).then(
            function(result){
                $cordovaFile.checkFile(filename).then(
                    function(result){
                        $cordovaToast.showShortCenter('Found ! - opening...')
                        $scope._openPdf(filename);
                    },
                    function(result){
                        alert('File not found: ' + JSON.stringify(result));
                        $scope._downloadGuideline(url, filename);
                    }
                );
            },
            function(err){
                alert('Error 553 Larry - creating NICE2.0 dir')
            }
        );
    };

});
