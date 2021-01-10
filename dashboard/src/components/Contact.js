//Imtiaj Ahmed. Department of Computer Science, University of Helsinki, Finland. January, 2021.
//License: GPL 3 or later
import ReactApexCharts from 'react-apexcharts'
import Chart from "react-apexcharts";
import React, {Component} from 'react'
import {GetJsonDataAsync} from '../api/GetJsonDataAsync';
import Streak from './Streak'
import TeamScore from './TeamScore'
import '../css/UHDashboard.css';
import '../css/bootstrap.min.css';

global.FindTeamScore = null;

class Contact extends React.Component {
  
  isProcessDone = false;

  dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  latestDate = new Date(1606683598000).toLocaleDateString("en-US", this.dateOptions); //To show the the latest day of contacts info
  thisWeekContactText = ''; //used to show contact of each day below the bar chart
  thisWeekStreakString = '';   //used for finding streak
  lastWeekStreakString = '';
  targetReachedDayCountText = ''; //used to show, for example: 6/7 days Target reached
  deptIDfound = false; //for showing error msg if department ID is not found in the dataset
  seriesIndexOfDept = -1;   //tracks the target series
  bestDayNumberOfContacts = -1;
  bestDayName = '';
  thisWeekAvgNumberOfContacts = 0; 
  lastWeekAvgNumnberOfContacts = 0; 
  diffAvgContacts = 0; //avg this wee - avg last week
  diffAvgContactsMsg = ''; //for example 'CONTACTS DECREASED SINCE LAST WEEK';

  deptTargetContacts = 0;
  emotionTextColor = '';
  
 
  options= {
    chart: {
      toolbar: {
        show: false
      }
    },   
    tooltip: {
      enabled: false            
    },    
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        dataLabels: {
          position: 'top',
        },
      }
    },
    theme: {
      palette: 'palette3', // upto palette10
      monochrome: {enabled:true}
    },
    annotations: {          
      yaxis: [{
        y: 50,  
        strokeDashArray: 5,                      
        borderColor: '#00E396',
        label: {
          borderColor: '#00E396',
          style: {
            color: '#fff',
            background: '#00E396',
            fontSize: '14px',
            fontWeight: 400
          },
          text: 'Target'
        }
      }]
    },
    dataLabels: {
      enabled: false,
      offsetX: 0,        
      style: {
        fontSize: '14px',
        colors: ['#fff']
      }
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: {
        style: {
                colors: ["grey", "grey", "grey", "grey", "grey", "grey", "grey"],
                fontSize: '25px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-xaxis-label'
            },
        offsetX: 0,
        offsetY: 5          
      }          
    },
    yaxis: {
      labels: {          
          style: {
              colors: ["grey"],
              fontSize: '14px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-yaxis-label',
          },
          offsetX: 0,
          offsetY: 0              
      }      
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center', 
      floating: true,
      fontSize: '20px',
      fontFamily: 'Helvetica, Arial',
      fontWeight: 400,
      offsetX: 0,
      offsetY: 0,     
      labels: {
        colors: ["grey"],
        useSeriesColors: false
      },
    },
    grid: {
      show: true,
      borderColor: '#90A4AE',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
          lines: {
              show: false
          }
      },   
      yaxis: {
          lines: {
              show: false
          }
      },  
      row: {
          colors: undefined,
          opacity: 0.5
      },  
      column: {
          colors: undefined,
          opacity: 0.5
      },  
      padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
      },  
    }
  }

  
  constructor(props) {
    super(props);    

    this.state = {
      deptID : '',  //used for checking which department's info to render
      isLoaded: false,
      series: [{     //contact's data for all departments, fetched from the json file
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

  
  async fetchData() 
  { 
    const series = await GetJsonDataAsync(`contact.json`);
    this.setState({ series:series, isLoaded:true });    
    console.log(series);
  }

  async componentDidMount() {
    await this.fetchData();          
  }

  
  ProcessData(deptInfo){  
    this.options.annotations.yaxis[0].y = deptInfo.targetContacts; //set the target green line
    this.deptTargetContacts = deptInfo.targetContacts;  // to show the target number

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
   
    var thisWeekContactInfo =  this.state.series[this.seriesIndexOfDept].contact[0]; //destructer, so that we can use shortname to refer the long syntax 
    this.latestDate = new Date(thisWeekContactInfo.timeto).toLocaleDateString("en-US", this.dateOptions); //set latest date of the data to show

    //this week
    var sum = 0;
    var count = 0;

    var minIndx = 0; 
    var minVal = 99999;
    var targetReachedDayCount = 0; 

    //set this week data series so that we can show the bar chart
   
    var local_thisWeekContactText ='';

    this.thisWeekStreakString = '';   //used for finding streak

    // generate info from this week contact data
    for (let i = 0; i < thisWeekContactInfo.data.length; i++) {
      if(thisWeekContactInfo.data[i].y){        //y = data value, x= day name
        sum = sum + thisWeekContactInfo.data[i].y;
        count++;
        local_thisWeekContactText += thisWeekContactInfo.data[i].y.toString()+'  '; //to show average contact below the bar chart

        if(thisWeekContactInfo.data[i].y<minVal){   //to calculate best day of this week
          minVal = thisWeekContactInfo.data[i].y;
          minIndx = i;
        }
        if(thisWeekContactInfo.data[i].y<=deptInfo.targetContacts){     // to track this week Target reached  and Streak string
          targetReachedDayCount++;
          this.thisWeekStreakString +='1';
        }
        else this.thisWeekStreakString +='0';
      }   
      else{
        local_thisWeekContactText += '-- '; //to show average contact below the bar chart
      }     
    } 

    this.thisWeekContactText = local_thisWeekContactText;

    this.bestDayNumberOfContacts = minVal;
    this.bestDayName = thisWeekContactInfo.data[minIndx].x.toUpperCase();
   
    this.targetReachedDayCountText = targetReachedDayCount.toString() + ' / ' + count.toString();
      
    if(count>0){
     this.thisWeekAvgNumberOfContacts = sum/count; 
    }
    else this.thisWeekAvgNumberOfContacts = 0; 



    //last week
    var lastWeekContactInfo =  this.state.series[this.seriesIndexOfDept].contact[1]; //destructer so that we can use shortname to refer the long syntax
    //set last week data series so that we can show the bar chart
    
    this.lastWeekStreakString = ''; //used for finding streak

    sum = 0;
    count = 0;
    for (let i = 0; i < lastWeekContactInfo.data.length; i++) {
      if(lastWeekContactInfo.data[i].y){
        sum = sum + lastWeekContactInfo.data[i].y;
        count++;

        if(lastWeekContactInfo.data[i].y<=deptInfo.targetContacts){     //Last week Streak string          
          this.lastWeekStreakString +='1';
        }
        else this.lastWeekStreakString +='0';
      } 
    }    
    
    if(count>0){
      this.lastWeekAvgNumnberOfContacts = sum/count;   
    }
    else this.lastWeekAvgNumnberOfContacts = 0;

    this.diffAvgContacts = this.thisWeekAvgNumberOfContacts - this.lastWeekAvgNumnberOfContacts;  

    if(this.diffAvgContacts<0) {
      this.diffAvgContactsMsg = 'CONTACTS DECREASED SINCE LAST WEEK';
      this.diffAvgContactsEmotIcon = process.env.PUBLIC_URL + `/Image/happy.png`;
      this.emotionTextColor = "#00BD00";
    }
    else {
      this.diffAvgContactsMsg = 'CONTACTS INCREASED SINCE LAST WEEK';
      this.diffAvgContactsEmotIcon = process.env.PUBLIC_URL + `/Image/sad.png`;
      this.emotionTextColor = "#C17600";
    }

    this.isProcessDone = true;
    this.setState({ deptID:deptInfo.deptID});       
  };


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
          <div class="col-md-7" style={{marginTop:"1em"}}>
            <h3 style={{fontFamily:"Goudy Stout"}}> DAILY CONTACTS </h3>
            <h5  style={{fontFamily:"AvenireLTStd-book"}}> {this.latestDate} </h5>
          </div>
          <div class="col-md-5">
            <TeamScore deptID={this.state.deptID}/>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6" >
            <ReactApexCharts options={this.options} series={this.state.series[this.seriesIndexOfDept].contact} type="bar" height={330}/>            
          </div>
          <div class="col-md-1"style={{textAlign:"center"}}>
            <h4 style={{marginTop:"3em", color:"#6780AA"}}> TARGET </h4>   
            <h1 style={{fontFamily:"Bauhaus", fontWeight:"bold", textAlign:"center", color:"#008CFF"}}> {this.deptTargetContacts} </h1>   
            <h4 style={{marginTop:"5em", color:"#6780AA"}}> AVERAGE </h4> 
          </div>
          <div class="col-md-3" style={{textAlign:"center"}}>
            <div class="col-md-12" style={{padding:"1.5em"}}>
              <h1 style={{fontFamily:"Bauhaus", textAlign:"center"}}>{this.targetReachedDayCountText} <span style={{fontSize:24}}>DAYS</span></h1>
              <h6>TARGET REACHED</h6>
            </div>
            <div class = "col-md-12">
              <h1 style={{fontFamily:"Bauhaus", textAlign:"center"}}>{this.bestDayNumberOfContacts} <span style={{fontSize:24}}>{this.bestDayName}</span></h1>
              <h6>BEST DAY THIS WEEK</h6>
            </div>
          </div>
          <div class="col-md-2">
            <Streak Strektext={[this.thisWeekStreakString,this.lastWeekStreakString]}/>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div className="uhAvgContact" style={{marginTop:"-1em",color:"#6780AA" }}> 
              <h4>{this.thisWeekContactText}</h4>
            </div>
          </div>
          <div class="col-md-1" style={{marginTop:"-1.5em"}}>
            <h1 style={{fontFamily:"Bauhaus", fontWeight:"bold", textAlign:"center", color:"#008CFF"}}>{this.thisWeekAvgNumberOfContacts.toFixed(2)}</h1>  
          </div> 
          <div class="col-md-5" style={{marginTop:"-1.5em"}}>
            <img src={this.diffAvgContactsEmotIcon} class = "EmotIcon"/>
            <h3 style={{color:this.emotionTextColor, fontFamily:"Bauhaus", fontWeight:"bold", marginLeft:"3.9em"}}>{this.diffAvgContacts.toFixed(2)}</h3>   
            <h6 style={{fontFamily:"Bauhaus", marginLeft:"7em", color:"#6780AA"}}>{this.diffAvgContactsMsg}</h6> 
          </div>
        </div>
      </div>
    );
  }
}
export default Contact;
  
  