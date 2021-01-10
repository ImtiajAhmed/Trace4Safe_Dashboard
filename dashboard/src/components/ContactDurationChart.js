//Imtiaj Ahmed. Department of Computer Science, University of Helsinki, Finland. January, 2021.
//License: GPL 3 or later
import React from 'react';
import ReactApexCharts from 'react-apexcharts'


function ContactDurationChart(props) {
  
    var options= {
        chart: {
            toolbar: {
              show: false
            }
          },
        theme: {
          palette: 'palette3', // upto palette10
          monochrome: {enabled:true}
        },
        tooltip: {
            enabled: false            
          },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: false,
        },
        xaxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          labels: {
            style: {
                    colors: ["#F5F5F5", "#F5F5F5", "#F5F5F5", "#F5F5F5", "#F5F5F5", "#F5F5F5", "#F5F5F5"],
                    fontSize: '15px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400,
                    cssClass: 'apexcharts-xaxis-label'
                },
            offsetX: 0,
            offsetY: -20 
                     
          }          
        },
        yaxis: {
          show: false          
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center', 
          floating: true,
          fontSize: '15px',
          fontFamily: 'Helvetica, Arial',
          fontWeight: 400,
          offsetX: 0,
          offsetY: -10,     
          labels: {
            colors: ["grey"],
            useSeriesColors: false
          },
        },
        grid: {
          show: false 
        }
      };
 

    
    return(
      
        <div class="container-fluid" style={{marginBottom:"-2em"}}>
          <ReactApexCharts options={options} series={props.series} type="area" height = "200"/>
        </div>
     
    );
  }

export default ContactDurationChart;