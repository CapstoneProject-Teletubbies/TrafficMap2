import React, { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';
import { useLocation } from 'react-router';

import SearchBar from '../components/SearchBar';

const baseurl = 'https://dev.chaerin.shop:9000/'         //베이스 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


function FindWay(props){
    const [findLocation, setFindLocation] = useState();
    const [startplaceholder, setStartPlaceHolder] = useState('출발지 입력');
    const [endplaceholder, setEndPlaceHolder] = useState('도착지 입력');

    const [startPlace, setStartPlace] = useState();
    const [endPlace, setEndPlace] = useState();
    const [both, setBoth] = useState(false);

    const [findway, setFindway] = useState();
    const [route, setRoute] = useState();

    const [routeLat, setRouteLat] = useState();
    const [routeLng, setRouteLng] = useState();

    const location = useLocation();

    const mylocation = location.state.mylocation;

    const handleSuccess = (pos) => {                //현재 내 위치 받아오기
        const {latitude, longitude } = pos.coords;
        
        setFindLocation({
          latitude, longitude
        })
    };

    const TmapfindWay = (startlng, startlat, endlng, endlat) => {
        const fw = axios.create({
            baseURL: baseurl
        })
        fw.post('/api/way', null, {params: {
            startX : startlng, startY : startlat, endX : endlng, endY : endlat, startName : "출발지", endName : "도착지", option : '0'
        }}).then(function(res){
            console.log(res.data);
            setRoute(res.data);
        }).catch(function(err){
            console.log("길찾기 실패");
        })
    };

    useEffect(()=>{
        if(route){
            route.map((obj)=>{
                console.log(obj.isStair);
            })
        }
    })

    useEffect(()=>{
        setFindway(location.state);
        if(location.state){
            if(location.state.startBuilding){
                console.log("출발지 정보 왔어요");
                setStartPlace(location.state.startBuilding);            //출발지 정보
                setStartPlaceHolder(location.state.startBuilding.name);  //출발지 이름
            }
            if(location.state.endBuilding){    
                console.log("도착지 정보 왔어요");
                setEndPlace(location.state.endBuilding);              //도착지 정보
                setEndPlaceHolder(location.state.endBuilding.name);   //도착지 이름
            }  
            // if(location.state.startBuilding && location.state.endBuilding){
            if(startPlace && endPlace){
                console.log("출발지, 도착지 둘 다 입력 완료");
                console.log(startPlace);
                console.log(endPlace);   
                setBoth(true);
                var startlat = startPlace.obj.latitude;
                var startlng = startPlace.obj.longitude;
                var endlat = endPlace.obj.latitude;
                var endlng = endPlace.obj.longitude;
                TmapfindWay(startlng, startlat, endlng, endlat);
            }
        }
    }, [findway])
///////////////////////////////////////////
//////////////////////////////////////////
    const handleXButton =   () => {
        console.log("클릭");
        window.location.href = "/";
        // TmapfindWay();
    }

    useEffect(()=>{
        var startLat, startLng;
        var endLat, endLng;
        var middleLat, middleLng;


        if(both){
            startLat = startPlace.obj.latitude;
            startLng = startPlace.obj.longitude;
            endLat = endPlace.obj.latitude;
            endLng = endPlace.obj.longitude;
            
            middleLat = (startLat + endLat) / 2;
            middleLng = (startLng + endLng) / 2;

            console.log(middleLat, middleLng);

        }

        const script = document.createElement("script");
        script.innerHTML = `
            var map;
            var marker_s, marker_e, marker_p1, marker_p2;
            var totalMarkerArr = [];
            var drawInfoArr = [];
            var resultdrawArr = [];
    
            function initTmap() {
                var map = new Tmapv2.Map("TMapApp", {
                    center: new Tmapv2.LatLng(${middleLat}, ${middleLng}),
                    width: "100%",
                    height: "100%",
                    httpsMode: true,
                    zoomControl: false,
                    zoom:13,
                });
                // 출발 마커
                marker_s = new Tmapv2.Marker(
                    {
                        position : new Tmapv2.LatLng(${startLat}, ${startLng}),
                        icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
                        iconSize : new Tmapv2.Size(24, 38),
                        map : map
                    });
    
                // 도착 마커
                marker_e = new Tmapv2.Marker(
                    {
                        position : new Tmapv2.LatLng(${endLat}, ${endLng}),
                        icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
                        iconSize : new Tmapv2.Size(24, 38),
                        map : map
                    });
                
                $.ajax({
                    method: "POST",
                    url : "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
                    async: false,
                    data: {
                        "appKey" : "l7xxafd79b2f4cce4ae6a4f6d1a1f4c31386",
						"startX" : "${startLng}",
						"startY" : "${startLat}",
						"endX" : "${endLng}",
						"endY" : "${endLat}",
						"reqCoordType" : "WGS84GEO",
						"resCoordType" : "EPSG3857",
						"startName" : "출발지",
						"endName" : "도착지"
                    },
                    success: function(response){
                        var resultData = response.features;
                        console.log(resultData);

                        if (resultdrawArr.length > 0) {
							for ( var i in resultdrawArr) {
								resultdrawArr[i]
										.setMap(null);
							}
							resultdrawArr = [];
						}
                        drawInfoArr = [];

                        for ( var i in resultData) { //for문 [S]
							var geometry = resultData[i].geometry;
							var properties = resultData[i].properties;
							var polyline_;


							if (geometry.type == "LineString") {
								for ( var j in geometry.coordinates) {
									// 경로들의 결과값(구간)들을 포인트 객체로 변환 
									var latlng = new Tmapv2.Point(
											geometry.coordinates[j][0],
											geometry.coordinates[j][1]);
									// 포인트 객체를 받아 좌표값으로 변환
									var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
											latlng);
									// 포인트객체의 정보로 좌표값 변환 객체로 저장
									var convertChange = new Tmapv2.LatLng(
											convertPoint._lat,
											convertPoint._lng);
									// 배열에 담기
									drawInfoArr.push(convertChange);
								}
							} else {
								var markerImg = "";
								var pType = "";
								var size;
						
                                if (properties.pointType == "S") { //출발지 마커
									markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
									pType = "S";
									size = new Tmapv2.Size(24, 38);
								} else if (properties.pointType == "E") { //도착지 마커
									markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
									pType = "E";
									size = new Tmapv2.Size(24, 38);
								} else { //각 포인트 마커
									markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
									pType = "P";
									size = new Tmapv2.Size(8, 8);
								}

								// 경로들의 결과값들을 포인트 객체로 변환 
								var latlon = new Tmapv2.Point(
										geometry.coordinates[0],
										geometry.coordinates[1]);

								// 포인트 객체를 받아 좌표값으로 다시 변환
								var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
										latlon);

								var routeInfoObj = {
									markerImage : markerImg,
									lng : convertPoint._lng,
									lat : convertPoint._lat,
									pointType : pType
								};

								// Marker 추가
								marker_p = new Tmapv2.Marker(
										{
											position : new Tmapv2.LatLng(
													routeInfoObj.lat,
													routeInfoObj.lng),
											icon : routeInfoObj.markerImage,
											iconSize : size,
											map : map
										});
							}
						}//for문 [E]
						drawLine(drawInfoArr);
                        var polyline4 = new Tmapv2.Polyline({
                            path: drawInfoArr,
                            strokeColor: "#E00000", // 라인 색상
                            strokeWeight: 4, // 라인 두께
                            map: map // 지도 객체
                        });
                    },
                    error: function(err){
                        console.log("에러임");
                    }
                })
        

                return map;
            }

            function addComma(num) {
                var regexp = /\B(?=(\d{3})+(?!\d))/g;
                return num.toString().replace(regexp, ',');
            }

            function drawLine(arrPoint) {
                console.log("드로우 실행");
                var polyline_;
        
                polyline_ = new Tmapv2.Polyline({
                    path : arrPoint,
                    strokeColor : "#DD0000",
                    strokeWeight : 6,
                    map : map
                });
                resultdrawArr.push(polyline_);
            }

            if('${startPlace}' && '${endPlace}'){
                initTmap();
            }

        `;

        script.type = "text/javascript";
        script.async = "async";
        document.head.appendChild(script);
    }, [both]);


    return(
        <div style={{position: "fixed", width: "100%", height: "100%", backgroundColor: "#D5D5D5"}}>
            <div className= "row align-items-center" id="findwayheader" style={{position: "relative", width: "100%", margin: "0px", display: "flex"
                , backgroundColor: "white", boxShadow: "1px 1px 10px 0.8px gray"}}>
                <div className='col-11' style={{position: "relative", textAlign: "-webkit-left"}}>
                    <SearchBar style={{border: "1px solid gray", borderRadius: "6px", margin: "5px", marginTop: "12px", width: "100%", }} placeholder={startplaceholder} location={mylocation} src={'/find-search'} id={'start'} endPlace={endPlace}></SearchBar>
                    <SearchBar style={{border: "1px solid gray", borderRadius: "6px", margin: "5px", marginBottom: "12px",  width: "100%", }} placeholder={endplaceholder} location={mylocation} src={'/find-search'} id={'end'} startPlace={startPlace}></SearchBar>
                </div>
                <div className="col-1" style={{alignSelf: "flex-start", marginTop: "5px", padding: "0px"}}>
                    <div style={{display: "flex", left: "-3px"}}>
                        <i class="bi bi-x" onClick={handleXButton} style={{fontSize: "2rem"}}></i>
                    </div>                               
                </div>
                {both && 
                <div style={{width: "100%", padding: "0px"}}>
                    <button style={{width: "50%", backgroundColor: "white", border: "none", boxShadow: "1px 1px 1px 1px gray"}}>도보</button>
                    <button style={{width: "50%", backgroundColor: "white", border: "none", boxShadow: "1px 1px 1px 1px gray"}}>대중교통</button>
                </div>
                }
            </div>
            {both &&
            <body onload="initTmap();">
            <div id="TMapApp" style={{
                overflowY: "hidden",
                height: "100%",
                width: "100%",
              }}>
                
            </div></body>}
        </div>     
    );
}
export default FindWay;