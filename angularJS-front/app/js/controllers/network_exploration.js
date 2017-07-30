'use strict';

/* Controllers */

  // Form controller
app.controller('NetworkExplorationCtrl', ['$scope','cytoData','$uibModal', '$http', function($scope,cytoData,$uibModal,$http) {
    $scope.submitForm = function() {
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'tpl/network_visualization_submission_modal.html',
            resolve: {
                request: function () {
                    return $scope.request;
                }
            },
            controller: function ($uibModalInstance, request, $http) {
                var $ctrl = this;
                $ctrl.request = request;

                $ctrl.ok = function () {
                    // $http.get("http://localhost:3000/network_exploration", {params: request}).then(function(response) {
                    $http.get("http://192.17.58.208:3000/network_exploration", {params: request}).then(function(response) {
                        $scope.elements = response.data;
                        $scope.graph.load();
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

    $scope.predictLink = function() {
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'tpl/network_visualization_prediction_submission.html',
            resolve: {
                request: function () {
                    return $scope.request;
                }
            },
            controller: function ($uibModalInstance, request, $http) {
                var $ctrl = this;
                $ctrl.request = request;

                $ctrl.ok = function () {
                    // $http.get("http://localhost:3000/network_exploration_prediction", {params: request}).then(function(response) {
                    $http.get("http://192.17.58.208:3000/network_exploration_prediction", {params: request}).then(function(response) {
                        $scope.elements = response.data;
                        $scope.graph.load();
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

    cytoData.getGraph('core').then(function(graph){
        $scope.graph = graph;
        // $scope.graph.center()
    });
    $scope.center = function(){
        $scope.graph.center()
    };
    $scope.reset = function(isZoomIn){
        $scope.graph.center();
        $scope.graph.zoom({
            level: 1.0
        });
    };

    $scope.options = { //See http://js.cytoscape.org/#core/initialisation for core options
        textureOnViewport:false,
        pixelRatio: 'auto',
        motionBlur: false,
        hideEdgesOnViewport:false
    };

    $scope.resetLayout = function(name){
        if(name == 'circle') {
            $scope.layout = {
                name: 'circle',
                avoidOverlap:false,
                padding:20,
                radius:500
            }
        } else if(name == 'cose') {
            $scope.layout = {
                name: 'cose',
                idealEdgeLength: 10,
                componentSpacing: 30
            }
        } else if(name == 'breadthfirst') {
            $scope.layout = {
                name: 'breadthfirst',
                avoidOverlap: true,
                spacingFactor: 1
            }
        }
    }
    $scope.resetLayout('circle');

    $scope.cy_graph_ready = function(evt){
        $scope.log('graph ready to be interacted with: ', evt);
    }
    // $scope.elements = [
    //     {
    //         group: 'nodes',
    //         data: {
    //             id: 'EndocardialFibroelastosis',
    //             label:'Endocardial Fibroelastosis'
    //         },
    //         selectable: true,
    //         grabbable: true
    //     },{
    //         group: 'nodes',
    //         data: {
    //             id: 'FamilialDilatedCardiomyopathy',
    //             label:'Familial Dilated Cardiomyopathy'
    //         },
    //         selectable: true,
    //         grabbable: true
    //     },{
    //         group: 'nodes',
    //         data: {
    //             id: 'familialRestrictiveCardiomyopathy',
    //             label:'familial Restrictive Cardiomyopathy'
    //         },
    //         selectable: true,
    //         grabbable: true
    //     },{
    //         group: 'nodes',
    //         data: {
    //             id: 'CarvajalSyndrome',
    //             label:'Carvajal Syndrome'
    //         },
    //         selectable: true,
    //         grabbable: true
    //     },{
    //         group: 'nodes',
    //         data: {
    //             id: 'Dmd-RelatedDilatedCardiomyopathy',
    //             label:'Dmd-Related Dilated Cardiomyopathy',
    //             docs: [
    //                 {
    //                     "title": "title1",
    //                     "pmid": "pmid1",
    //                     "sentences": ["sentence1-1", "sentence1-2", "sentence1-3"]
    //                 },
    //                 {
    //                     "title": "title2",
    //                     "pmid": "pmid2",
    //                     "sentences": ["sentence2-1", "sentence2-2", "sentence3-3"]
    //                 }
    //             ]
    //         },
    //         selectable: true,
    //         grabbable: true
    //     },{
    //         group: 'nodes',
    //         data: {
    //             id: 'CentronuclearMyopathy',
    //             label:'Centronuclear Myopathy'
    //         },
    //         selectable: true,
    //         grabbable: true
    //     },{
    //         group: 'nodes',
    //         data: {
    //             id: 'ACTC1',
    //             label:'ACTC1'
    //         },
    //         selectable: true,
    //         grabbable: true,
    //         classes: 'type2'
    //     },{
    //         group: 'nodes',
    //         data: {
    //             id: 'TAZ',
    //             label:'TAZ'
    //         },
    //         selectable: true,
    //         grabbable: true,
    //         classes: 'type2'
    //     },{
    //         group: 'nodes',
    //         data: {
    //             id: 'ABCC9',
    //             label:'ABCC9'
    //         },
    //         selectable: true,
    //         grabbable: true,
    //         classes: 'type2'
    //     },{
    //         group: 'nodes',
    //         data: {
    //             id: 'TTN',
    //             label:'TTN'
    //         },
    //         selectable: true,
    //         grabbable: true,
    //         classes: 'type2'
    //     },{
    //         group: 'nodes',
    //         data: {
    //             id: 'TNNI3',
    //             label:'TNNI3'
    //         },
    //         selectable: true,
    //         grabbable: true,
    //         classes: 'type2'
    //     },{
    //         group: 'nodes',
    //         data: {
    //             id: 'DSC2',
    //             label:'DSC2'
    //         },
    //         selectable: true,
    //         grabbable: true,
    //         classes: 'type2'
    //     },{
    //         group: 'nodes',
    //         data: {
    //             id: 'DMD',
    //             label:'DMD'
    //         },
    //         selectable: true,
    //         grabbable: true,
    //         classes: 'type2'
    //     },{
    //         group: 'nodes',
    //         data: {
    //             id: 'BIN1',
    //             label:'BIN1'
    //         },
    //         selectable: true,
    //         grabbable: true,
    //         classes: 'type2'
    //     },{
    //         group: 'edges',
    //         data: {
    //             source: 'ACTC1',
    //             target: 'FamilialDilatedCardiomyopathy',
    //             docs: [
    //                 {
    //                     "title": "title1",
    //                     "pmid": "pmid1",
    //                     "sentences": ["sentence1-1", "sentence1-2", "sentence1-3"]
    //                 },
    //                 {
    //                     "title": "title2",
    //                     "pmid": "pmid2",
    //                     "sentences": ["sentence2-1", "sentence2-2", "sentence3-3"]
    //                 }
    //             ]
    //         }
    //     },{
    //         group: 'edges',
    //         data: {
    //             source: 'ACTC1',
    //             target: 'familialRestrictiveCardiomyopathy'
    //         }
    //     },{
    //         group: 'edges',
    //         data: {
    //             source: 'TAZ',
    //             target: 'EndocardialFibroelastosis'
    //         }
    //     },{
    //         group: 'edges',
    //         data: {
    //             source: 'TAZ',
    //             target: 'FamilialDilatedCardiomyopathy'
    //         }
    //     },{
    //         group: 'edges',
    //         data: {
    //             source: 'ABCC9',
    //             target: 'familialRestrictiveCardiomyopathy'
    //         }
    //     },{
    //         group: 'edges',
    //         data: {
    //             source: 'TTN',
    //             target: 'CentronuclearMyopathy'
    //         }
    //     },{
    //         group: 'edges',
    //         data: {
    //             source: 'TTN',
    //             target: 'FamilialDilatedCardiomyopathy'
    //         }
    //     },{
    //         group: 'edges',
    //         data: {
    //             source: 'TNNI3',
    //             target: 'FamilialDilatedCardiomyopathy'
    //         }
    //     },{
    //         group: 'edges',
    //         data: {
    //             source: 'DSC2',
    //             target: 'CarvajalSyndrome'
    //         }
    //     },{
    //         group: 'edges',
    //         data: {
    //             source: 'DMD',
    //             target: 'FamilialDilatedCardiomyopathy'
    //         }
    //     },{
    //         group: 'edges',
    //         data: {
    //             source: 'DMD',
    //             target: 'Dmd-RelatedDilatedCardiomyopathy'
    //         }
    //     },{
    //         group: 'edges',
    //         data: {
    //             source: 'BIN1',
    //             target: 'CentronuclearMyopathy'
    //         }
    //     }
    // ];

    $scope.elements = null;
    $scope.style = [ // See http://js.cytoscape.org/#style for style formatting and options.
        {
            selector: 'node',
            style: {
                'shape': 'ellipse',
                'border-width': 0,
                'background-color': '#5897fc',
                'color': '#58666e',
                'height': 30,
                'width': 30,
                'font-size':30,
                'label': 'data(label)'


            }
        },{
            selector: 'edge',
            style: {
                'target-arrow-shape': 'triangle',
                'width': 8,
                'line-color': '#ddd',
                'target-arrow-color': '#ddd',
                'curve-style': 'bezier'
            }
        },{
            selector: '.highlighted',
            style : {
                'background-color': '#61bffc',
                'line-color': '#61bffc',
                'target-arrow-color': '#61bffc',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': '0.5s'
            }
        },{
            selector: '.type2',
            style: {
                'background-color': '#27c24c'
            }
        },{
            selector: '.edge1',
            style: {
                'line-color': '#f49d41'
            }
        }
    ]

    // var cy = angular.element('#cy #ab').addClass('highlighted')
    //
    // console.log(cy)

    $scope.$on('cy:node:click', function(ng,cy){
        var node = cy.cyTarget;
        console.log(node.data())
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'tpl/distinctive_summarization_node_detail_modal.html',
            resolve: {
                node: function () {
                    return node.data();
                }
            },
            controller: function ($uibModalInstance, node, $http,$scope) {
                var $ctrl = this;
                $scope.node = node;
                console.log($scope.node);
                $ctrl.ok = function () {
                    $uibModalInstance.close();
                };
            },
            controllerAs: '$ctrl'
        });
    });

    $scope.$on('cy:edge:click', function(ng,cy){
        var edge = cy.cyTarget;
        console.log(edge.data())
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'tpl/distinctive_summarization_edge_detail_modal.html',
            resolve: {
                edge: function () {
                    return edge.data();
                }
            },
            controller: function ($uibModalInstance, edge, $http,$scope) {
                var $ctrl = this;
                $scope.edge = edge;
                $ctrl.ok = function () {
                    $uibModalInstance.close();
                };
            },
            controllerAs: '$ctrl'
        });
    });
}]);
