import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { saveUserId, clearUserId, saveUserInfo, setWeatherInfo } from "./store/store";

function Login(){  

    let [id, setId] = useState('');
    let [pw, setPw] = useState('');


    //redux 저장용으로 만든 store 에 있는 slice에 값 변경하는 action 함수 호출을 하려면
    // dispatch 에 감싸서 요청해야한다   dispatch(수행할 내용)
    let dispatch = useDispatch();

    //redux 에 저장되어있는 값들을 접근해서 사용
    let reduxState = useSelector((state)=>{return state});

    console.log(reduxState);
    console.log(reduxState.user); 
    console.log(reduxState.weather); 

    let user = useSelector((state)=>{return state.user});
    console.log(user);
    
    let weather = useSelector((state)=>{return state.weather});
    console.log(weather);

    return (
        <div>
            <h1>Redux Test</h1>
            <div>
                <button onClick={()=>{
                    // saveUserId('mynewid');  단순함수호출 X
                    dispatch(saveUserId('mynewid'));  //redux 관련 함수(action) 호출
                    console.log(user);
                }}>SaveUserId</button>

                <button onClick={()=>{
                    dispatch(clearUserId());
                }}
                >ClearUserId</button>

                <button onClick={()=>{
                    dispatch(saveUserInfo(  {id:'qwe', name:'rr' }   ));
                }}
                >SaveUserInfo</button>

                <button onClick={()=>{
                    dispatch( setWeatherInfo( {weather: 'cloudy', temperature: 30, hmdt: 72} ));
                }}
                >setWeatherInfo</button>
            </div>




            <h1>React Spring Loing</h1>

            <p> id : <input type="text" onChange={(e)=>{ setId(e.target.value)} }></input>   </p>
            <p> pw : <input type="password" onChange={(e)=>{ setPw(e.target.value)} }></input>  </p>

            <button onClick={()=>{
                //로그인 시도 -> 서버에 id, pw 전달

                //axios.post( url, dataBody, header )
                axios.post(
                    '/api/login',
                    {               // post http 요청시 보낼 body data
                        id: id,     // key : value
                        pw: pw      // id 라는 key값 : id 변수에 들어있는 값
                    },
                    {
                        headers : {
                            'Content-Type':'application/json'
                        }
                    }
                )
                .then(
                    response => {
                        // { header :"", body:""}
                        // response.data.header.resultCode 
                        
                        console.log(response.data);
                        if( response.data == 'ok' ){
                            // 로그인 성공
                            // 성공 보여주기!
                            // 성공 이후 다음 페이지로 이동
                            // ReactRouter   ->  navigate("/")     navigate("/mypage")
                        } else {
                            // 로그인 실패
                            // 화면에 실패에 관련된 메시지 표시
                        }
                    }
                )
                .catch(error => console.log(error))
            }}>
                로그인
            </button>

            <button onClick={()=>{
                axios.post('/api/loginCheck')
                .then(response => console.log(response.data))
                .catch(error => console.log(error))
            }}>
                로그인여부체크
            </button>


            <button onClick={()=>{
                //로그인 시도 -> 서버에 id, pw 전달

                //axios.post( url, dataBody, header )
                axios.post(
                    '/api/loginJWT',
                    {               // post http 요청시 보낼 body data
                        id: id,     // key : value
                        pw: pw      // id 라는 key값 : id 변수에 들어있는 값
                    },
                    {
                        headers : {
                            'Content-Type':'application/json'
                        }
                    }
                )
                .then(
                    response => {                     
                        console.log(response.data);  //accessToken 

                        let token = response.data;   //JWT    토큰
                        if(token != null && token != ''){
                            //로컬 스토리지에 토큰을 저장
                            //다음에 API 로 요청할일 있을때, 토큰도 담아서 같이 전송

                            // 토큰을 로컬 스토리에 저장
                            // localStorage.setItem(key, value)
                            // localStorage.getItem(key)
                            localStorage.setItem("token", token);

                            // 로그인 성공한 정보 (id || name || nickname)
                            // -> redux 상태관리에 저장
                            // dispatch(saveUserId(id));

                            // 나중에 로그인여부 판별을 위해 아이디가 필요한 화면에서는
                            // let user = useSelector((state)=>{return state.user});
                        }

                        //로그인 성공? 실패?
                        //페이지 전환 처리~ 
                    }
                )
                .catch(error => console.log(error))
            }}>
                로그인JWT
            </button>

            <button onClick={()=>{
                axios.post(
                    '/api/loginCheckJWT',
                    {},
                    {
                        headers: {
                            "Content-Type":"application/json",
                            "Authorization":"Bearer " + localStorage.getItem("token")
                        }
                    }
                )
                .then(response => console.log(response.data))
                .catch(error => console.log(error))
            }}>
                로그인여부체크JWT
            </button>

        </div>
    )
}

export default Login;