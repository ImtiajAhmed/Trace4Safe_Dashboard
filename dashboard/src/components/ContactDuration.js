
//Imtiaj Ahmed. Department of Computer Science, University of Helsinki, Finland. January, 2021.
//License: GPL 3 or later
import React, {Component} from 'react'
import {GetJsonDataAsync} from '../api/GetJsonDataAsync';
import {Millis2minutesWithSeconds} from '../api/Millis2minutesWithSeconds';
import ContactDurationChart from './ContactDurationChart'
import '../css/UHDashboard.css';
import '../css/bootstrap.min.css';


class ContactDuration extends React.Component {
  isProcessDone = false;
  deptIDfound = false; //for showing error msg if department ID is not found in the dataset
  seriesIndexOfDept = -1;   //tracks the target series
  diffAvgContactsDuration = 0;
  diffAvgContactsDurationMsg = '';
  diffAvgContactsDurationEmotIcon = '';
  thisWeekAverageContactDuration = 0;
  thisWeekContactDurationText ='';
  emotionTextColor = '';

  
  constructor(props) {
    super(props);
    

    this.state = {
      deptID : '',  //used for checking which department's info to render
      isLoaded: false,
      series: [{     //contact duration data for all departments, fetched from the json file
        deptID: '',  
        contact: [{
            name: '',
            timefrom: 0,
            timeto: 0,
            data: []
        }]
      }]  
    }
  }

  ProcessData(deptInfo){
    //find the series index of the target department
    this.seriesIndexOfDept = -1;
    for(let i=0; i<this.state.series.length; i++)
      if(deptInfo.deptID === this.state.series[i].deptID){
        this.seriesIndexOfDept = i;
        break;
      }
    if(this.seriesIndexOfDept<0)
    {
      this.deptIDfound = false;
      return;
    }     
    else this.deptIDfound = true;

   
    var thisWeekContactDurationInfo =  this.state.series[this.seriesIndexOfDept].contact[0]; //destructer, so that we can use shortname to refer the long syntax 
  
    
    
    //this week
    var sum = 0;
    var count = 0;
    var local_thisWeekContactDurationText ='';

    for (let i = 0; i < thisWeekContactDurationInfo.data.length; i++) {        
      if(thisWeekContactDurationInfo.data[i].y){
        sum = sum + thisWeekContactDurationInfo.data[i].y;
        count++;
        local_thisWeekContactDurationText += Millis2minutesWithSeconds(thisWeekContactDurationInfo.data[i].y)+'  ';
      }  
      else {
        local_thisWeekContactDurationText += '-----  ';
      }      
    } 
    this.thisWeekContactDurationText = local_thisWeekContactDurationText;

      
    if(count>0) 
      this.thisWeekAverageContactDuration = sum/count;
    else this.thisWeekAverageContactDuration = 0;

    //last week
    sum = 0;
    count = 0;
    var lastWeekContactDurationInfo =  this.state.series[this.seriesIndexOfDept].contact[1]; //destructer so that we can use shortname to refer the long syntax
    
    for (let i = 0; i < lastWeekContactDurationInfo.data.length; i++) {
      if(lastWeekContactDurationInfo.y>0){
        sum = sum + lastWeekContactDurationInfo.data[i].y;
        count++;
      }             
    }         
    
    var lastWeekAverageContactDuration =  0;
    if(count>0) lastWeekAverageContactDuration = sum/count;
    
    this.diffAvgContactsDuration = this.thisWeekAverageContactDuration - lastWeekAverageContactDuration;

    if(this.diffAvgContactsDuration<0){
      this.diffAvgContactsDurationEmotIcon =process.env.PUBLIC_URL + `/Image/happy.png`;
      this.diffAvgContactsDurationMsg = 'SHORTER CONTACT DURATION SINCE LAST WEEK';
      this.emotionTextColor = "#00BD00";
    }
      
    else{
      this.diffAvgContactsDurationEmotIcon =process.env.PUBLIC_URL + `/Image/sad.png`;
      this.diffAvgContactsDurationMsg = 'LONGER CONTACT DURATION SINCE LAST WEEK';
      this.emotionTextColor = "#C17600";
    }
    this.isProcessDone = true;
    this.setState({ deptID:deptInfo.deptID});  
  }

 

  async fetchData() 
  { 
    const series = await GetJsonDataAsync(`contactDuration.json`);
    this.setState({ series:series, isLoaded:true });    
    console.log(series);
   }

  async componentDidMount() {
    await this.fetchData(); 
  }

  
  render() {   
    if (!this.state.isLoaded) {
      return <div>Loading daily contacts...</div>;
    } 
    
    if(this.props.departmentsInfo.deptID!==this.state.deptID){
      this.isProcessDone = false;
      this.ProcessData(this.props.departmentsInfo);
    }
    if(!this.isProcessDone) return null;
    if(!this.deptIDfound) return <div>Department ID not fund in the dataset...</div>;
      
    return (  
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6">
            <h5 >Average Contact Duration</h5>
            <div className="uhAvgContactDuration" > 
              <h4 style={{color:"#6780AA"}}>{this.thisWeekContactDurationText}</h4>
            </div> 
          </div>
          <div class="col-md-1" style={{marginTop:15}}>
            <h1 style={{fontFamily:"Bauhaus", fontWeight:"bold", textAlign:"center", color:"#008CFF"}}>{Millis2minutesWithSeconds(this.thisWeekAverageContactDuration)}</h1>
          </div>
          <div class="col-md-5">
            <img src={this.diffAvgContactsDurationEmotIcon} class = "EmotIcon"/>
            <h3 style={{color:this.emotionTextColor, fontFamily:"Bauhaus", fontWeight:"bold", marginLeft:"3.9em"}}>{Millis2minutesWithSeconds(this.diffAvgContactsDuration)}</h3>
            <h6 style={{fontFamily:"Bauhaus", marginLeft:"7em", color:"#6780AA"}}>{this.diffAvgContactsDurationMsg}</h6>
          </div>
        </div>
        <div class="row"style={{marginTop:"-2em"}}>
          <div class="col-md-12">
            <ContactDurationChart series={this.state.series[this.seriesIndexOfDept].contact}/>
          </div>
        </div>
      </div>      
    );
  }
}
export default ContactDuration;
  
  