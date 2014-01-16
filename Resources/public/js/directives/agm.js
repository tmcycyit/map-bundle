app.directive('yitMap',function($parse){

    //this function is for Initializeing the map.|arguments:1)element
    //Returns 1)0:Error,2)map(type=object)
    function Initialize(el){
        var map,data = {};
        data.center = new google.maps.LatLng(40.177037117759895,44.51488494873047);
        data.mapTypeId = google.maps.MapTypeId.HYBRID;
        map = new google.maps.Map(el,data);
        return map;
    };
    return {
        restrict: 'A',
        compile: function compile(el,attr){
            var map,data,selectMarker;
            var markers = new Array();
            var infoWindows = new Array();
            map = Initialize(el[0]);


            //link function
            return function (scope,el,attr){
                data = $parse(attr.yitMap)(scope);

                scope.$watch(attr.ngMarkers,function(d){
                    console.log(d);
                    data.deleteAllMarkers();
                    data.addMarkersInfoWindows(d);
                },true);
                data.filterMarkers = function(singleData){
                    if(typeof singleData.hide !== "undefined" && singleData.hide)
                        return false;
                    else
                        return true;
                };
                map.setCenter(new google.maps.LatLng(data.center.Lat,data.center.Lng));
                scope.$watch(attr.yitMap,function(d){
                    map.setZoom(parseInt(d.zoom));
                },true);
                google.maps.event.addListener(map,'click',function(e){
                    scope.$apply(function(){
                        data.marker.Lat = e.latLng.b;
                        data.marker.Lng = e.latLng.d;
                        selectMarker = null;
                    });
                });
                data.deleteMarker = function(){
                    if (selectMarker !== null)
                        selectMarker.setMap(null);
                };
                data.deleteAllMarkers = function(){
                    for(var i = 0;i<markers.length;i++)
                        markers[i].setMap(null);
                };
                data.addMarkersInfoWindows = function(objs){
                    for(var i = 0;i<objs.length;i++)
                    {
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(objs[i].Lat,objs[i].Lng),
                            map: map,
                            title:"Hello World!",
                            icon: objs[i].icon,
                            //animation:google.maps.Animation.BOUNCE
                        });
                        var infoWindow = new google.maps.InfoWindow({
                            content: objs[i].infoWindow.content,
                            position: new google.maps.LatLng(objs[i].infoWindow.position.Lat,objs[i].infoWindow.position.Lng)
                        });
                        //google.maps.event.addListener(marker,'click',function(e){
                        infoWindow.open(map,marker);
                        //});
                        infoWindows.push(infoWindow);
                        markers.push(marker);
                    }
                    console.log(infoWindows)
                };
            };
        }
    };
});