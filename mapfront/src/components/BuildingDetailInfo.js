import React from 'react';
import axios from "axios";
import $ from 'jquery';
import '../css/BuildingDetailInfo.css'
import Modal from './Modal';
import { Navigate, useNavigate } from "react-router-dom";
import {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import arrowsrefresh from "../images/arrows-refresh.png";
import elevator from "../images/elevator.png";
import lift from "../images/lift.png";
import spinner from "../images/spinner.gif";


const baseurl = 'https://dev.chaerin.shop:9000/'         //베이스 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


const BuildingDetailInfo = (props) => {
    const [buildingDetailInfo, setBuildingDetailInfo] = useState();
    const [subway, SetSubway] = useState();
    const [subwayUp, SetSubwayUp] = useState([]);
    const [subwayDown, SetSubwayDown] = useState([]);
    const [one, setOne] = useState(false);
    const [url, Seturl] = useState();
    const [line, setLine] = useState();
    const [iselevator, setIsElevator] = useState();

    const [modalOpen, setModalOpen] = useState(false);

    const navigate = useNavigate();

    const openMadal = () => {
        handlesubwaymapbutton();
        setTimeout(setModalOpen(true), 50);
    }
    const closeModal = () => {
        setModalOpen(false);
    }

    const handlestartButton = () => {
        console.log("출발 버튼 클릭");
        navigate('/find-way', {
            state:{
                startBuilding: props.whole.props,
                mylocation: props.whole.props.mylocation,
                id: 'start',
            }
        })
    }
    const handleendButton = () => {
        console.log("도착 버튼 클릭");
        navigate('/find-way', {
            state:{
                endBuilding: props.whole.props,
                mylocation: props.whole.props.mylocation,
                id: 'end',
            }
        })
    }

    const handlecheckButton = () => {
        var start = null, end = null;
        if(props.findway === 'start' && props.whole.endBuilding){
            start = props.whole.props;
            end = props.whole.endBuilding;
        }else if(props.findway === 'end' && props.whole.startBuilding){
            start = props.whole.startBuilding;
            end = props.whole.props;
        }else if(props.findway === 'start'){
            console.log("c출발");
            start = props.whole.props;     
        }else if(props.findway === 'end'){
            console.log("도ㅗ착");
            end = props.whole.props;
        }
        console.log(props);
        navigate('/find-way', {
            state: {
                props: props.whole.props,
                mylocation: props.mylocation,
                id: props.findway,
                startBuilding: start,
                endBuilding: end,
            }
        })
    }
    const handlesubwaymapbutton = () => {
        const subwayname = (props.props.name.split('역'))[0];
        const subwaymap = axios.create({                                    //인천지하철 1, 2호선 내부지도
            baseURL: baseurl
        })
        const subwaymap2 = axios.create({                                   //1~9호선 내부지도
            baseURL: baseurl
        })

        var name = (buildingDetailInfo.name).split(/[\[\]]/);
        var subname = name[0];
        console.log(name);
        var line = name[1].split('호');

        switch (subname){
            case '총신대입구역/이수역': name = '총신대입구(이수)역'; break;
            case '신정역': name = '신정역(은행정)'; break;
            case '오목교역': name = '오목교역(목동운동장앞)'; break;
            case '충정로역' : name = '충정로역(경기대입구)'; break;
            case '광화문역(' : name = '광화문역(세종문화회관)'; break;
            case '종로3가역' : name = '종로3가역(탑골공원)'; break;
            case '군자역': name = '군자(능동)'; break;
            case '아차산역': name ='아차산역(어린이대공원후문)'; break;
            case '광나루역': name = '광나루역(장신대)'; break;
            case '천호역': name ='천호역(풍납토성)'; break;
            case '올림픽공원역': name = '올림픽공원역(한국체대)'; break;
            case '굽은다리역': name = '굽은다리역(강동구민회관앞)'; break;  
            case '새절역': name = '새절역(신사)'; break;
            case '증산역': name = '증산역(명지대앞)'; break;
            case '월드컵경기장역': name = '월드컵경기장역(성산)'; break;
            case '광흥창역' : name = '광흥창역(서강)'; break;       
            case '대흥역': name = '대흥역(서강대앞)'; break;
            case '효창공원앞역' : name = '효창공원앞역(용산구청)'; break; 
            case '안암역': name = '안암역(고대병원앞)'; break;
            case '고려대역' : name = '고려대역(종암)'; break;    
            case '월곡역': name = '월곡역(동덕여대)'; break;
            case '상월곡역': name = '상월곡역(한국과학기술연구원)'; break;
            case '화랑대역': name = '화랑대역(서울여대입구)'; break;
            case '공릉역': name = '공릉역(서울산업대입구)'; break;
        }


        if((buildingDetailInfo.name).includes('인천지하철')){
        subwaymap.post('/api/subway/photo', null, {params: {name: subwayname}})
        .then(function(res){
            console.log(res.data);
            if((buildingDetailInfo.name).includes('인천지하철1호선')){
                setLine('지하철입체지도/인천1호선/');
                console.log("인천 지하철 1호선임");          
            }else if((buildingDetailInfo.name).includes('인천지하철2호선')){
                setLine('지하철입체지도/인천2호선/');
                console.log("인천 지하철 2호선임");
            }
            Seturl(res.data);
        }).catch(function(err){
            console.log("지하철 입체지도 정보 못받아옴");
        })
        }else{
            
        subwaymap2.post('api/subway/photo2', null, {params: {line: line[0], name: name}})
        .then(function(res){
            console.log(res.data);
            Seturl(res.data);
        }).catch(function(err){
            console.log("1~9호선 내부지도 못받아옴");
        })
        }
    }

    const searchsubwaytime = () => {        //새로고침 눌렀을때 지하철 실시간 정보 받아옴
        var d = document.getElementById('arrowrefresh');
        d.style.animationPlayState='running';
        d.style.animationIterationCount='1';

        const subwayinfo = axios.create({
            baseURL: baseurl
        })
        var subwayname = (buildingDetailInfo.name).split('역')[0];
        switch (subwayname){
            case '쌍용': subwayname='쌍용(나사렛대)'; break;
            case '총신대입구': subwayname = '총신대입구(이수)'; break;
            case '신정': subwayname = '신정(은행정)'; break;
            case '오목교': subwayname = '오목교(목동운동장앞)'; break;
            case '군자': subwayname = '군자(능동)'; break;
            case '아차산': subwayname ='아차산(어린이대공원후문)'; break;
            case '광나루': subwayname = '광나루(장신대)'; break;
            case '천호': subwayname ='천호(풍납토성)'; break;
            case '올림픽공원': subwayname = '올림픽공원(한국체대)'; break;
            case '굽은다리': subwayname = '굽은다리(강동구민회관앞)'; break;
            case '응암순환': subwayname = '응암순환(상선)'; break;
            case '새절': subwayname = '새절(신사)'; break;
            case '증산': subwayname = '증산(명지대앞)'; break;
            case '월드컵경기장': subwayname = '월드컵경기장(성산)'; break;
            case '대흥': subwayname = '대흥(서강대앞)'; break;
            case '안암': subwayname = '안암(고대병원앞)'; break;
            case '월곡': subwayname = '월곡(동덕여대)'; break;
            case '상월곡': subwayname = '상월곡(한국과학기술연구원)'; break;
            case '화랑대': subwayname = '화랑대(서울여대입구)'; break;
            case '공릉': subwayname = '공릉(서울산업대입구)'; break;
            case '어린이대공원': subwayname = '어린이대공원(세종대)'; break;
            case '숭실대입구': subwayname = '숭실대입구(살피재)'; break;
            case '상도': subwayname = '상도(중앙대앞)'; break;
            case '몽촌토성': subwayname = '몽촌토성(평화의문)'; break;
            case '남한산성입구': subwayname = '남한산성입구(성남법원, 검찰청)'; break;
            case '신촌': subwayname = '신촌(경의.중앙선)'; break;
        }
        subwayinfo.post('/api/subway', null, {params: {name: subwayname}})
        .then(function(res){
            console.log(res.data);    
            var i= 0, j = 0;
            var tmp1 = [];
            var tmp2 = [];
            {(res.data).map((obj)=>{
                if((buildingDetailInfo.name).includes(obj.subwayId)){
                    if(obj.updnLine === "상행" && i<2){
                        tmp1.push(obj);
                        // SetSubwayUp(subwayUp => [...subwayUp, obj]);
                        i++;
                    }
                    else if(obj.updnLine === "하행" && j<2){
                        tmp2.push(obj);
                        // SetSubwayDown(subwayDown => [...subwayDown, obj]);
                        j++;
                    }
                };
            })}
            SetSubwayUp(tmp1);
            SetSubwayDown(tmp2);
        }).catch(function(err){
            console.log("지하철 정보 못받아옴");
        })
        
    };


    useEffect(()=>{
        console.log(props);
        setBuildingDetailInfo(props.props);
        SetSubway(props.subway);
        if(props.props.elevatorState === '운행중'){
            setIsElevator(true);
        }else{
            setIsElevator(false);
        }

        // if(!one && buildingDetailInfo && subway){
        //     setOne(true);
        //     searchsubwaytime();
        // }

        if(!one && buildingDetailInfo && subway){
            console.log(buildingDetailInfo);
            setOne(true);
            searchsubwaytime();
            // var i= 0, j = 0;
            // {subway.map((obj)=>{
            //     if((buildingDetailInfo.name).includes(obj.subwayId)){
            //         if(obj.updnLine === "상행" && i<2){
            //             SetSubwayUp(subwayUp => [...subwayUp, obj]);
            //             i++;
            //         }
            //         else if(obj.updnLine === "하행" && j<2){
            //             SetSubwayDown(subwayDown => [...subwayDown, obj]);
            //             j++
            //         }
            //     };
            // })}
        }
    }, [props])

    if(subwayUp){
       
    }

    const stylebutton ={
        position: "fixed",
        width: "170px",
        float: "right",
        right: "0px",
        bottom: "5px",
        margin: "10px"
    }
    const styleelivator={
        position: "fixed",
        float: "right",
        right: "30px",
        margin: "12px"

    }
    const mybutton={
        borderRadius: "20px",
        height: "35px",
        marginLeft: "8px",
    }
    /*function iselivator(props){
        if props ===true
    }
    var text=document.createTextNode("\u00a0");*/

    const setArrive = (props) => {
        let destination = props.address;

    }; //도착지 변수로 주소 넘겨주기

    const setStart = (props) => {
        let departure = props.address;
    };//출발지로 주소 넘기기
    if(buildingDetailInfo){
        if(subway){
            return(
                <div>
                    <Modal open={modalOpen} close={closeModal} url={url} line={line}>
                        팝업창임
                    </Modal>
                <footer>
                    
                <div id='Info' className="detailInfo" style={{height: "100%"}}>
                        <div id='headInfo' className="row" style={{position: "relative", paddingTop: "10px"}}>
                            <div className="col-8" style={{textAlign: "left", paddingLeft: "5%", paddingRight: "0px"}}>
                                <b>{buildingDetailInfo.name}</b> {buildingDetailInfo.bizname} 
                            </div><div className="col-4" style={{paddingLeft: "0px"}}>
                                <div id="subwaymapbutton" className="" style={{paddingRight: "5%"}}>
                                    {iselevator && <img src={elevator} style={{width: "24px", height: "24px", marginRight: "7px", float: "left"}}></img>}
                                    
                                    <button id='arrowbutton' onClick={searchsubwaytime} style={{backgroundColor: "white", border: "none", padding: "0px", width: "26px", height: "26px", float: "right"}}>
                                        <img id='arrowrefresh' src={arrowsrefresh} style={{width: "26px", height: "26px", padding: "0px", left : "-1px", top: "-2px"}}></img>
                                    </button>
                                    <i class="bi bi-map" onClick={openMadal} style={{float: "right", paddingRight: "7px"}}></i>
                                </div>
                            </div>  
                        </div>
                        {/* <div id='elivator' style={styleelivator}>
                            {buildingDetailInfo.elivator}</div> */}
                        <div id='realtime' style={{position: "relative", paddingTop: "5px"}}>
                            <div className="row" style={{height: "100%"}}>
        {/*상행 */}             <div className="col-6" style={{textAlign: "left", fontSize: "0.9em", paddingLeft: "6%", paddingRight: "1%"}}>
                                {subwayUp && subwayUp.map((obj, index)=>{
                                    var arv = '';
                                    const name =(obj.trainLineNm).split('-');
                                    if((obj.arvlMsg2).includes("도착")){                          
                                        if(obj.arvlMsg3 == (obj.arvlMsg2).split(' 도착')[0]){
                                            arv = '도착';
                                        }else{
                                            arv = obj.arvlMsg2;
                                        }
                                    }else if((obj.arvlMsg2).includes("진입")){
                                        arv = obj.arvlMsg2;
                                    }else{  
                                        var tmp;                
                                        if((obj.arvlMsg2).includes('(')){
                                            tmp = (obj.arvlMsg2).split('(')[0];
                                        }else{
                                            tmp = (obj.arvlMsg2).split('역')[0];
                                        }
                                        if(tmp.includes('[')){
                                            arv = tmp.split(/[\[\]'역']/);
                                        }else{
                                            arv = tmp;
                                        }
                                    }
                                   return(
                                    <div className="row" style={{textAlign: "left"}}>
                                        <div className="col-6" style={{padding: "0px"}}>
                                            <h8>{name[0]}</h8>
                                        </div>
                                        <div className="col-6" style={{textAlign: "left", padding: "0px", color: "red"}}>
                                            <h8>{arv}</h8>
                                        </div>
                                    </div>
                                   );
                                })}
                            </div>
                            
       {/*하행 */}          <div className="col-6" style={{ textAlign: "left", fontSize: "0.9em", paddingLeft: "1%", paddingRight: "6%"}}>
                                {subwayDown && subwayDown.map((obj, index)=>{
                                    var arv = '';
                                    const name =(obj.trainLineNm).split('-');
                                    if((obj.arvlMsg2).includes("도착")){
                                        if(obj.arvlMsg3 == (obj.arvlMsg2).split(' 도착')[0]){
                                            arv = '도착';
                                        }else{
                                            arv = obj.arvlMsg2;
                                        }    
                                    }else if((obj.arvlMsg2).includes("진입")){
                                        arv = obj.arvlMsg2;
                                    }else{
                                        var tmp;
                                        if((obj.arvlMsg2).includes('(')){
                                            tmp = (obj.arvlMsg2).split('(')[0];
                                        }else{
                                            tmp = (obj.arvlMsg2).split('역')[0];
                                        }
                                        if(tmp.includes('[')){
                                            arv = tmp.split(/[\[\]'역']/);
                                        }else{
                                            arv = tmp;
                                        }
                                    }
                                   return(
                                    <div className="row" style={{textAlign: "left",}}>
                                        <div className="col-6" style={{padding: "0px"}}>
                                        <h8>{name[0]}</h8>
                                        </div>
                                        <div className="col-6" style={{textAlign: "left", padding: "0px", color: "red"}}>
                                            <h8>{arv}</h8>
                                        </div>
                                    </div>
                                   );
                                })}
                            </div>
                            </div>
                        </div>
                        <div className="" style={stylebutton}>
                        <button type="button" class="btn btn-outline-primary btn-sm col-5" onClick={handlestartButton} style={mybutton}>출발</button>
                        <button type="button" class="btn btn-primary btn-sm col-5" onClick={handleendButton} style={mybutton}>도착</button>
                        </div>
                    </div>
                    </footer>
                    </div>
            );
        }else{
            return(
                <footer style={{boxShadow: "1px 1px 10px 1px gray", }}>
                <div style={{padding: "2%", height: "100%"}}>
                        <div style={{width: "100%", textAlign: "-webkit-left"}}>
                            <b>{buildingDetailInfo.name}</b> {buildingDetailInfo.upperBizName} {iselevator && <img src={elevator} style={{width: "25px", height: "25px", top: "-3px"}}></img>}
                            <b>{buildingDetailInfo.bstopnm}</b>
                        </div>
                        <div style={{textAlign: "-webkit-left"}}>
                            {buildingDetailInfo.fullAddressRoad}
                        </div>
                        {!props.findway &&
                        <div className="" style={stylebutton}>                          
                            <button type="button" class="btn btn-outline-primary btn-sm col-5" onClick={handlestartButton} style={mybutton}>출발</button>
                            <button type="button" class="btn btn-primary btn-sm col-5" onClick={handleendButton} style={mybutton}>도착</button>
                        </div>
                        }
                        {props.findway && 
                        <div id="checkbutton" style={{position: "relative", width: "100%", }}>
                            <button style={{width: "100%", backgroundColor: "white", borderRadius: "5px"}} onClick={handlecheckButton}>확인</button>
                        </div>
                        }
                </div>
                </footer>
            );
        }
    }
}


export default BuildingDetailInfo; 