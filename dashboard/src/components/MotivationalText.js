//Imtiaj Ahmed. Department of Computer Science, University of Helsinki, Finland. January, 2021.
//License: GPL 3 or later
import React, {Component} from 'react'
import {GetJsonDataAsync} from '../api/GetJsonDataAsync';

class MotivationalText extends Component {

  motivalionalTextIndex=-1;
  currentMotivationalText='';

  refreshInterval = 50;

  constructor(props) {
    super(props);
   
    this.state = {    
      motivationalText: [],
      motivalionalTextIndex:-1
    };
  }
 
  async componentWillMount() {
    const motivationalText = await GetJsonDataAsync('motivationalText.json');
    this.setState({ motivationalText });

  }
  
  updateInfo(){     
    if(this.state.motivationalText.length>0){
      this.setState({motivalionalTextIndex: (this.state.motivalionalTextIndex + 1) % this.state.motivationalText.length});
    } 
  };

 
  componentDidMount() {
    this.interval = setInterval(this.updateInfo.bind(this), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render(){    
    return (
      <div class="BackgroundImageContainer">
        <img src={process.env.PUBLIC_URL + `/Image/MotivationalBackground.png`} alt="Motivational Text Background" style={{width:"100%"}}></img>
        <div style={{color: "#6780AA", marginTop:-150, padding:"4%"}}>
          <h4>{this.state.motivationalText[this.state.motivalionalTextIndex]}</h4>
        </div>     
      </div>
    )
  }
  
}

export default MotivationalText;
