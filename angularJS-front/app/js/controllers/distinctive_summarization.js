'use strict';

/* Controllers */

  // Form controller
app.controller('DistinctiveSummarizationCtrl', ['$scope','$uibModal', '$http', function($scope,$uibModal, $http) {
    $scope.diseases = [
        {
            "name":"CARDIOMYOPATHY",
            "keyWords":[
                {
                    "name":"interferon_gamma",
                    "number":3.34
                },
                {
                    "name":"interleukin-4",
                    "number":2.81
                },
                {
                    "name":"tumor_necrosis_factor",
                    "number":2.72
                },
                {
                    "name":"interleukin-17a",
                    "number":2.54
                }

            ]
        },
        {
            "name":"ARRHYTHMIA",
            "keyWords":[
                {
                    "name":"methionine_synthase",
                    "number":3.79
                },
                {
                    "name":"ryanodine_receptor_2",
                    "number":3.35
                },
                {
                    "name":"potassium_voltage-gated",
                    "number":2.72
                },
                {
                    "name":"gap_junction_alpha-1",
                    "number":1.87
                }

            ]
        },
        {
            "name":"VALVE DYSFUNCTION",
            "keyWords":[
                {
                    "name":"mineralocorticoid_receptor",
                    "number":3.27
                },
                {
                    "name":"elastin",
                    "number":2.38
                },
                {
                    "name":"tropomyosin_alpha-1_chain",
                    "number":2.33
                },
                {
                    "name":"myosin-binding_protein_c",
                    "number":1.70
                }

            ]
        },
        {
            "name":"CEREBROVASCULAR",
            "keyWords":[
                {
                    "name":"alpha-galactosidase_a",
                    "number":5.91
                },
                {
                    "name":"brain-derived_neurotrophic",
                    "number":5.59
                },
                {
                    "name":"tissue-type_plasminogen",
                    "number":4.94
                },
                {
                    "name":"apolipoprotein_e",
                    "number":3.69
                }

            ]
        },
        {
            "name":"Disease Name",
            "keyWords":[
                {
                    "name":"Cras justo odio",
                    "number":14
                }

            ]
        },
        {
            "name":"BEATING",
            "keyWords":[
                {
                    "name":"alpha-galactosidase_a",
                    "number":4.60
                },
                {
                    "name":"brain-derived_neurotrophic",
                    "number":3.99
                },
                {
                    "name":"tissue-type_plasminogen",
                    "number":3.65
                },
                {
                    "name":"apolipoprotein_e",
                    "number":3.30
                }

            ]
        }
    ];

    $scope.diseases = null; // set default data to be null
    $scope.raw_query = null; // store the user input query

    $scope.getSampleQuery = function () {
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'tpl/distinctive_summarization_sample_submission_modal.html',
            controller: function ($uibModalInstance, $http) {
                var $ctrl = this;
                $http.get("http://192.17.58.208:3000/distinctive_summarization/get_sample").then(function(response) {
                // $http.get("http://localhost:3000/distinctive_summarization/get_sample").then(function(response) {
                    $ctrl.request = response.data;
                    $scope.raw_query = response.data; // save the query data
                });

                $ctrl.ok = function () {
                    // $http.get("http://localhost:3000/distinctive_summarization", {params: $ctrl.request}).then(function(response) {
                    $http.get("http://192.17.58.208:3000/distinctive_summarization", {params: $ctrl.request}).then(function(response) {
                        $scope.diseases = response.data;
                    });
                    $uibModalInstance.close();
                };

                $ctrl.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            controllerAs: '$ctrl'
        });
    }

    $scope.submitForm = function() {
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'tpl/distinctive_summarization_submission_modal.html',
            resolve: {
                request: function () {
                    $scope.request.targetEntitySubtypes=[];
                    $scope.targetEntitySubtypes.forEach(function(e) {
                        $scope.request.targetEntitySubtypes.push(e.text);
                    });
                    $scope.raw_query = $scope.request; // save the query data
                    return $scope.request;
                }
            },
            controller: function ($uibModalInstance, request, $http) {
                var $ctrl = this;
                $ctrl.request = request;

                $ctrl.ok = function () {
                    $http.get("http://192.17.58.208:3000/distinctive_summarization", {params: request}).then(function(response) {
                    // $http.get("http://localhost:3000/distinctive_summarization", {params: request}).then(function(response) {
                        $scope.diseases = response.data;
                    });
                    $uibModalInstance.close();
                };

                $ctrl.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            controllerAs: '$ctrl'
        });
    }

}]);
