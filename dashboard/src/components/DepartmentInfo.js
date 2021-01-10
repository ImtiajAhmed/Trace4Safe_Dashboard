//Imtiaj Ahmed. Department of Computer Science, University of Helsinki, Finland. January, 2021.
//License: GPL 3 or later
import React from 'react';

import '../css/bootstrap.min.css';

function DepartmentInfo (props){
  if(props.state.deptIndex>-1){
    return(
      <div>
        <div class="row">
          <h3 style={{fontFamily:"AvenirLTStd-book",textAlign:"left"}}>DEPARTMENT STATS <span style={{color: "chocolate", fontStyle:"italic", fontWeight:"bold"}}>{' '}{props.state.deptIndex+1}{' / '} {props.state.departmentsInfo.length} </span></h3>
        </div>
        <div class="row" style={{backgroundImage:`url('/Image/rowBackImage.png')`, height:90, width:1320, textAlign:"left", marginTop:"1em"}}>
          <div class="col-md-2">
            <img src={process.env.PUBLIC_URL + `/Image/${props.state.departmentsInfo[props.state.deptIndex].logo}`} style={{height:120, float:"right", marginTop:"-0.5em"}} class="rounded" />
          </div>
          <div class="col-md-10" >
            <h1 style={{fontFamily:"Bauhaus",marginTop:"0.5em",textAlign:"left"}}> {props.state.departmentsInfo[props.state.deptIndex].description} </h1>
          </div>
        </div>
      </div>      
    );
  }
  return(
    null
  );
}

export default DepartmentInfo;
