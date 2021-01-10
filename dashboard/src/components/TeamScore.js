//Imtiaj Ahmed. Department of Computer Science, University of Helsinki, Finland. January, 2021.
//License: GPL 3 or later
import React, {Component} from 'react'
import { GetJsonDataAsync } from '../api/GetJsonDataAsync';


class TeamScore extends React.Component {
  deptID ='';
  score = -1;
  rank = -1;

  constructor(props) {
    super(props);      

    this.state = {  
      isLoaded: false,             
      series: [{
        deptID :'',
        logo :'',
        score :0,
        rank : 0,
        gold: 0,
        silver: 0,
        bronze: 0
      }]
    };
  };
    

  FindTeamScore(deptID){  
    for (let i = 0; i < this.state.series.length; i++)
      if(deptID === this.state.series[i].deptID)
      {
          this.score = this.state.series[i].score;
          this.rank = this.state.series[i].rank;
          this.deptID = deptID;
          return;
      }
      return;
  };
    
  async componentDidMount() {
    const series = await GetJsonDataAsync(`allDepartmentsScore.json`);
    this.setState({ series:series, isLoaded:true });
  }
    
  
  render(){
    if (!this.state.isLoaded) {
      return <div>Loading Team Score...</div>;
    }  

    if(this.deptID!==this.props.deptID) this.FindTeamScore(this.props.deptID);

    return (
      <div class="container-fluid">
        <div class="row">
            <div class="col-md-7">
                <h1 style={{fontFamily:"Algerian", fontWeight:"bolder", fontSize:"3em",textAlign:"center"}}>{this.score}</h1>
                <h5 style={{fontFamily:"AvenireLTStd-book", fontWeight:"bolder", fontSize:"0.7em",textAlign:"center"}}>TEAM SCORE</h5>
            </div>
            <div class="col-md-5">
                <h1 style={{fontFamily:"Algerian", fontWeight:"bolder", fontSize:"3em", textAlign:"center"}}>{this.rank}</h1>
                <h5 style={{fontFamily:"AvenireLTStd-book", fontWeight:"bolder", fontSize:"0.7em",textAlign:"center"}}>TEAM RANK</h5>
            </div>
        </div>         
      </div>        
    )
  }
      
}
export default TeamScore;
  
  