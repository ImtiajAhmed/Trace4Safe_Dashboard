//Imtiaj Ahmed. Department of Computer Science, University of Helsinki, Finland. January, 2021.
//License: GPL 3 or later
import React from 'react';
import LS from 'longest-streak'
import ReactApexCharts from 'react-apexcharts'

function Streak(props) {
  var series = [0,0];

  var options = {      
    theme: {
      palette: 'palette2', // upto palette10
      //monochrome: {enabled:true}
    },      
    plotOptions: {
      radialBar: {          
        startAngle: 0,
        endAngle: 360,    
        offsetX: -20,      
        track: {
          show: false            
        },
       
      
        dataLabels: {
          show: true,
          name: {
              show: true,
              fontSize: '16px',
              fontFamily: undefined,
              fontWeight: 600,
              color: undefined,
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '14px',
              fontFamily: undefined,
              fontWeight: 400,
              color: '#6780AA',
              offsetY: 0
            },
            total: {
              show: true,
              label: 'Total',
              color: '#6780AA',
              fontSize: '16px',
              fontFamily: undefined,
              fontWeight: 600                
            }
      }
      }
    },
    labels: ['This Week', 'Last Week']
  };

  var thisWeekStrek = LS(props.Strektext[0],'1');
  var lastWeekStreak = LS(props.Strektext[1],'1');

  var thisWeekStrekPercent = Math.round(thisWeekStrek * (100/props.Strektext[0].length));
  var lastWeekStreakPercent = Math.round(lastWeekStreak * (100/props.Strektext[1].length));

  series = [thisWeekStrekPercent, lastWeekStreakPercent] ;
  
    return(
      
        <div style={{textAlign:"center"}}>
          <ReactApexCharts options={options} series={series} type="radialBar" width = "220"/>
          <h5> STREAK <span style={{fontSize:35, padding:5, color:"#6780AA"}}>{thisWeekStrek}</span> <span style={{fontSize:24,color:"#6780AA"}}>DAYS</span> </h5>
          <h5 style={{color:"#6780AA"}}>LAST WEEK <span style={{fontSize:35, padding:5}}>{lastWeekStreak}</span> <span style={{fontSize:24}}>DAYS</span> </h5>
        </div>
       
       
     
    );
  }

export default Streak;