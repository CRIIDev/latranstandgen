import React, {useState} from 'react';
import { Button, FormGroup, Label, Row, Col} from 'reactstrap';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import Countdown, { zeroPad} from 'react-countdown';

let devTeam = ['Eitan', 'Reggie', 'Karthik', 'James', 'Josh', 'Nam'];
let compDev=[];
let currentDev=[];
let show="none";
let autoStart = false;
let count = 0;
let countdownApi = null;
let timeSelect = 15;
let end = devTeam.length-1;
const time =[
    { value: 5, label: '5 min'},
    { value: 10, label: '10 min'},
    { value: 15, label: '15 min'},
    { value: 20, label: '20 min'},
    { value: 25, label: '25 min'},
    { value: 30, label: '30 min'},
    { value: 35, label: '35 min'},
    { value: 40, label: '40 min'},
    { value: 45, label: '45 min'},
    { value: 50, label: '50 min'},
    { value: 55, label: '55 min'},
    { value: 60, label: '60 min'}];

const animatedComponents = makeAnimated();

const devOps =[
    { value: 'Eitan', label: 'Eitan'},
    { value: 'Karthik', label: 'Karthik'},
    { value: 'James', label: 'James'},
    { value: 'Reggie', label: 'Reggie'},
    { value: 'Josh', label: 'Josh'},
    { value: 'Nam', label: 'Nam'}];

const useForceUpdate = () => useState([0]);

const App = (props) => {

    const [nameState, setNameState] = useState([]);
    const [nowState, setNowState] = useState([]);
    const [timerState, setTimerState] = useState(Date.now() + ((timeSelect*60000)/devTeam.length) );


    const forceUpdate = () => useForceUpdate;

    const setRef = (countdown) => {
        if (countdown) {
            countdownApi =[];
            countdownApi = countdown.getApi();
        }
    };

    const renderer = ({ hours, minutes, seconds, completed }) => {

        if (completed && count > end){
            // Render a completed state
            handleUpdate();
            return <h1 style={{color:"limegreen", fontSize:"7rem"}}> DONE =) </h1>
        } else {
            // Render a countdown
            return <h1 style={{color:"blue", fontSize:"7rem", display:show}}>{zeroPad(minutes)}:{zeroPad(seconds)}</h1>;
        }
    };

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

            // swap elements array[i] and array[j]
            // we use "destructuring assignment" syntax to achieve that
            // let t = array[i]; array[i] = array[j]; array[j] = t
            [array[i], array[j]] = [array[j], array[i]];
        }
    };
    const handleUpdate = () => {
        forceUpdate();
    };

    const generate= () =>{
        shuffle(devTeam);
        compDev = [];
        currentDev = [];
        count=0;
        show="";
        autoStart=false;
        for (let i = 0; i < devTeam.length; i++){
            compDev.push(<h2>{devTeam[i]}</h2>);
            currentDev.push("You're up " + devTeam[i]+"!");
        }
        setNameState(compDev);

        setNowState(currentDev[count]);

        setTimerState(Date.now() + ((timeSelect*60000)/devTeam.length));
    };

    const start = () => {
        countdownApi.start();
    };
    const stop = () => {
        countdownApi.pause();
    };
    const reset = () => {
        autoStart=true;
        setTimerState(Date.now() + ((timeSelect*60000)/devTeam.length));
    };
    const next = () => {

        if (!devTeam[count]  && count > devTeam.length-2){
            setNowState([]);
            setTimerState([]);
        }else{
            count++;
            setNowState(currentDev[count]);
            reset();
        }
    };

    const prev = () => {

        if (count < 1){
            return;
        }else{
            count--;
            setNowState(currentDev[count]);
            reset();
        }
    };

    const timeSelectHandler = (opts) => {

        timeSelect = parseInt(JSON.stringify(opts.value));
        console.log(timeSelect);
    };

    const peopleHandler = (opts) =>{
        devTeam = [];

        opts.forEach((option) =>{
            devTeam.push(option.value);
        });
    };

    return (
        <div style={{textAlign: "center", backgroundColor: "#f0f2f5", minHeight: "50rem"}}>
            <header className="App-header">
                <h1 style={{backgroundColor: "gold"}}>
                    Stand Up Generator
                </h1>
            </header>

            <div className="tab-content mx-auto col-sm-12 col-lg-10 tab-pane active" style={{ textAlign: "center" }} id="cardDiv">
                <div>
                    <div className="d-flex justify-content-center mt-3" > </div>
                    <div className="card mb mt-2" id="cardDiv" style={{ display: "inline-block", maxWidth: "83.333333%", width: "100%" }}>
                        <div className="card-body" style={{border: "0px "}}>
                            <Col sm="12">
                                <Row form>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label>Participants</Label>
                                            <CreatableSelect
                                                isMulti
                                                closeMenuOnSelect={false}
                                                components={animatedComponents}
                                                onChange={peopleHandler}
                                                options={devOps}
                                                defaultValue ={[devOps[0], devOps[1], devOps[2], devOps[3], devOps[4], devOps[5]]}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                        </FormGroup>
                                    </Col>

                                    <Col md={4}>
                                        <FormGroup>
                                            <Label>Select Time</Label>
                                            <Select
                                                closeMenuOnSelect={true}
                                                placeholder={"15 min"}
                                                options = {time}
                                                defaultValue={{value: 15, label: '15 min'}}
                                                onChange={timeSelectHandler}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Button style={{backgroundColor: "#32CD32"}} onClick={generate}>Generate</Button>

                                <h1 style={{color: "red", display:show, fontSize: "5rem", marginTop: "1rem"}}>{nowState}</h1>

                                <Button style={{backgroundColor: "#3386FF", display:show }} onClick={prev}>Prev</Button>
                                <Button style={{backgroundColor: "#3386FF", display:show, marginLeft: "1rem" }} onClick={next}>Next</Button>

                                <h1>
                                    <Countdown
                                        key={timerState}
                                        date={timerState}
                                        ref={setRef}
                                        renderer={renderer}
                                        onMount={handleUpdate}
                                        onStart={handleUpdate}
                                        onPause={handleUpdate}
                                        onComplete={next}
                                        autoStart={autoStart}
                                    />
                                </h1>
                                <Button style={{backgroundColor: "green", display:show }} onClick={start}>Start</Button>
                                <Button style={{backgroundColor: "red", display:show, marginLeft: "1rem" }} onClick={stop}>Stop</Button>
                                <Button style={{backgroundColor: "gold", color:"black", display:show, marginLeft: "1rem" }} onClick={reset}>Reset</Button>
                                <h4 style={{marginTop: "2rem" }}>{nameState}</h4>
                            </Col>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;