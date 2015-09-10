//version 1.0.0
//this directive attributes(arguments) are
//ng-marker="marker"    type="object" MUST BE DEFINED.like marker.Lat=''
//ng-marker-drag="true" type="bool"     default | true
//ng-marker-limit="2"   type="nubmer"   default | 1
//ng-marker-icon="i.png"type="string"   default | google icon
//ng-zoom="12"          type="number"   default | 10
//ng-center-lat="44"    type="number"   default | 40.177037117759895
//ng-center-lng="45"    type="number"   default | 44.51488494873047
app.directive('simpleMarker',function($parse,$log,$timeout){
    //this function is for Initializeing the map.|arguments:1)element
    //Returns 1)map(type=object)
    function Initialize(el){
        var m,data = {};
        data.center = new google.maps.LatLng(40.177037117759895,44.51488494873047);
        data.mapTypeId = google.maps.MapTypeId.ROADMAP;
        m = new google.maps.Map(el,data);
        return m;
    };
    return {
        restrict: 'A',
        scope: {
            ngMarker: '='
        },
        compile: function compile(el,attr){
            var map,zoom,drag,limit,icon;
            var marker = {};
            var center = {};
            var markers = new Array();
            //this function is used for getting data from attributes and init somethings
            //function needs some GLOBAL variables for getting data
            //it needs | 1)zoom,2)drag,3)limit,4)marker(type=object),5)center(type=object),6)icon
            //arguments | 1)a:(attr),2)scope(for parseing)
            //attributes must be | 1)zoom(ng-zoom(type=number)),2)drag(ng-marker-drag),3)limit(ng-limit(type=number))
            function initData(a,scope){
                $timeout(function(){
                    marker = scope.ngMarker;
                    drag = $parse(a.ngMarkerDrag)(scope);
                    zoom = $parse(a.ngZoom)(scope);
                    limit = $parse(a.ngMarkerLimit)(scope);
                    icon = a.ngMarkerIcon;
                    center.Lat = $parse(a.ngCenterLat)(scope);
                    center.Lng = $parse(a.ngCenterLng)(scope);
                    marker.drag = drag;
                    marker.limit = limit;
                    marker.icon = icon;
                    setCenter(center);
                    setZoom(zoom);
                    addMarker(marker,scope);
                    scope.$watch('ngMarker',function(data){
                        if (angular.isDefined(marker.Lat) && angular.isDefined(marker.Lng) && marker.Lat!="" && marker.Lng!=""){
                            marker.Lat = Number(data.Lat);
                            markers[0].setPosition(new google.maps.LatLng(marker.Lat,marker.Lng));
                        }
                    },true)
                },100);
            }
            /* ---end initData()--- */
            function setCenter(obj){
                if(angular.isDefined(obj.Lat) && angular.isDefined(obj.Lng))
                    map.setCenter(new google.maps.LatLng(obj.Lat,obj.Lng));
            }
            function setZoom(n){
                if(angular.isDefined(n) && angular.isNumber(n) && n<=19)
                    map.setZoom(n);
                else
                    map.setZoom(10);
            }
            function addMarker(obj,scope){
                if(!angular.isObject(obj))
                    return $log.error("'addMarker`s argument isn`t object");
                if(!angular.isDefined(obj.limit))
                    obj.limit = 1;
                if(markers.length>=obj.limit)
                    return $log.info("markers` limit is less:limit="+obj.limit);
                if(!angular.isNumber(obj.Lat) || !angular.isNumber(obj.Lng))
                    return;
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(obj.Lat,obj.Lng),
                    map: map
                });
                if(angular.isDefined(obj.icon))
                    marker.setIcon(obj.icon);
                if(!angular.isDefined(obj.drag) | obj.drag)
                {
                    marker.setDraggable(true);
                    google.maps.event.addListener(marker,'drag',function(e){
                        scope.$apply(function(){
                            obj.Lat = e.latLng.lat();
                            obj.Lng = e.latLng.lng();
                        });
                    });
                }
                markers.push(marker);
            }
            map = Initialize(el[0]);

            return function(scope,el,attr){
                initData(attr,scope);
                var input = document.getElementById('pac-input');
                var searchBox = new google.maps.places.SearchBox(input);
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

                map.addListener('bounds_changed', function() {
                    searchBox.setBounds(map.getBounds());
                });

                google.maps.event.addListener(map,'click',function(e){
                    if(!angular.isObject(marker))
                        return;
                    scope.$apply(function(){
                        if(markers.length<marker.limit) {
                            marker.Lat = e.latLng.lat();
                            marker.Lng = e.latLng.lng();
                        }
                        addMarker(marker,scope);
                    });
                });

                searchBox.addListener('places_changed', function() {
                    var places = searchBox.getPlaces();
                    var bounds = new google.maps.LatLngBounds();

                    if (places.length == 0) {
                        return;
                    }

                    scope.$apply(function(){
                        marker.Lat = places[0].geometry.location.G;
                        marker.Lng = places[0].geometry.location.K;
                    });

                    if (places[0].geometry.viewport) {
                        bounds.union(places[0].geometry.viewport);
                    } else {
                        bounds.extend(places[0].geometry.location);
                    }
                    map.fitBounds(bounds);
                });

            };
        }
    };
});