//Imtiaj Ahmed. Department of Computer Science, University of Helsinki, Finland. January, 2021.
//License: GPL 3 or later
import React, {Component} from 'react'
import { GetJsonDataAsync } from '../api/GetJsonDataAsync';


class LeaderBoard extends React.Component {
  deptID ='';

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

    global.FindTeamScore = this.FindTeamScore.bind(this); //calls from AvgContact
  }
    
//array.sort(GetSortOrder("EmployeeName"));
    async fetchData() {
        const series = await GetJsonDataAsync(`allDepartmentsScore.json`);
        this.setState({ series:series, isLoaded:true }); 
        
        this.state.series.sort((a,b)=>b.score-a.score);   
    }



  FindTeamScore(deptID){  
    
    for (let i = 0; i < this.state.series.length; i++)
      if(deptID === this.state.series[i].deptID)
        return [this.state.series[i].score, this.state.series[i].rank];            
    
    return [-1,-1];
  };
    
  async componentDidMount() {
    await this.fetchData();   

  }
    
  
  render(){
    if (!this.state.isLoaded) {
      return <div>Loading LeaderBoard...</div>;
    }  
    return (
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12" style={{fontFamily:"AvenirLTStd-book",textAlign:"left"}}>
            <h3>TOP 3 LEADERBOARD</h3>
          </div>
        </div>
        <div class="row" style={{fontFamily:"Bauhaus",marginTop:"2em"}}>
          {this.state.series.map((postDetail, index)=>{
            if(index <3)
            return (
              <div class="row" style={{marginBottom:"1.3em"}}>  
                <div class="col-md-2">
                  <h2>{postDetail.score}</h2> 
                </div>
                <div class="col-md-6">
                  <div class="row">
                    <div class="col-md-12">
                      <h3 style={{color:"#6780AA"}}>{postDetail.deptID}</h3> 
                    </div>
                  </div>
                  <div class="row" style={{marginTop:"-0.5em"}}>
                    <div class="col-md-4">
                      <strong style={{fontSize:16, paddingTop:100}}>{postDetail.gold}{" "}</strong>
                      <img class="Img" src={process.env.PUBLIC_URL + `/Image/gold.png`} />                  
                    </div>
                    <div class="col-md-4">
                      <strong style={{fontSize:16}}>{postDetail.silver}{" "}</strong>
                      <img class="Img" src={process.env.PUBLIC_URL + `/Image/silver.png`} />                  
                    </div>
                    <div class="col-md-4">
                    <strong style={{fontSize:16}}>{postDetail.bronze}{" "}</strong>
                      <img class="Img" src={process.env.PUBLIC_URL + `/Image/bronze.png`} />
                    </div>
                  </div>
                </div>
                <div class="col-md-4">                            
                  <img src={process.env.PUBLIC_URL + `/Image/${postDetail.logo}`} style={{width:100, height:100, float:"left"}} class="rounded" />
                </div>
              </div>              
            )
          })} 
        </div> 
        
      </div>
        
    )
  }
      
}
export default LeaderBoard;
  
  