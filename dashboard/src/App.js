//Imtiaj Ahmed. Department of Computer Science, University of Helsinki, Finland. January, 2021.
//License: GPL 3 or later
import React, {Component} from 'react'
import {GetJsonDataAsync} from './api/GetJsonDataAsync';
import DepartmentInfo from './components/DepartmentInfo'
import MotivationalText from './components/MotivationalText'
import Contact from './components/Contact'
import ContactDuration from './components/ContactDuration'
import LeaderBoard from './components/LeaderBoard'

import './css/bootstrap.min.css';


global.refreshInterval = 5000;
global.FindTeamScore = null;
global.CheckAllComponentMonted = [false,false,false,false]; //contact, contactDuration, leaderBoard, motivationalText

class App extends Component {

  
  constructor(props) {
    super(props);

    this.state = {    
      departmentsInfo: [{
          deptID: '',
          description: '',
          targetContacts: 0,
          logo:''
      }],
      deptIndex:-1,
      isLoaded: false 
    };
  }

 

  updateInfo(){      
    this.setState({deptIndex: (this.state.deptIndex + 1) % this.state.departmentsInfo.length});      
  };

  waitOnceIntheBeginning() //so that all the other child components get mounted
  {
    clearInterval(this.intervalForOnce);//clear the interval

    if(this.state.departmentsInfo.length>0){
      this.setState({deptIndex: 0});
    }
    this.interval = setInterval(this.updateInfo.bind(this), global.refreshInterval);
  }

  async componentDidMount() {
    const deptInfo = await GetJsonDataAsync(`departmentsInfo.json`);
    this.setState({ departmentsInfo: deptInfo, isLoaded:true });

    this.intervalForOnce = setInterval(this.waitOnceIntheBeginning.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  render(){
    if (!this.state.isLoaded)
      return <div>Loading....</div>;
    
    if(this.state.deptIndex<0)
      return <div>Couldn't load data...</div>;
   
             
    return (
       <div class="container-fluid" className="AppBackground" style={{padding:"3%"}} >
        <div class="row">
          <div class="col-md-9">
            <div class="row">
              <div class="col-md-12">
                <DepartmentInfo state={this.state}/>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">       {/*style={{padding:"2%"}}*/}
                <Contact departmentsInfo={this.state.departmentsInfo[this.state.deptIndex]}/>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <ContactDuration departmentsInfo={this.state.departmentsInfo[this.state.deptIndex]}/>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="row">
              <div class="col-md-12">
                <LeaderBoard/>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12" style={{marginTop:"2em"}}>
                <MotivationalText/> 
              </div>
            </div>
          </div>
        </div>
      </div> 
     
    );
  }
  
}

export default App;
