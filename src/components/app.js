import React from "react";

import { useState } from "react";
import Header from './Header';
import ContestList from './ContestList';
import Contest from './Contest';
import * as api from '../api';
import { PropTypes } from 'prop-types';


let testData = require('../testData');
// history navigating
const pushState = (obj, url) => {
  window.history.pushState(obj, '', url);
}

class App extends React.Component {
    static propTypes = {
      initialData: PropTypes.object.isRequired,
    };
    state = this.props.initialData;

    componentDidMount(){
      console.log('did mount');
     //debugger;
     window.onpopstate = (navEvent) => {
       this.setState({
         currentContestId: (navEvent.state || {}).currentContestId,
       });
     };
    };

    componentWillUnmount(){
      console.log('will unmount');
      //debugger;
      window.onpopstate = (navEvent) => {
        this.setState({
          currentContestId: null
        })
      };
    }

//in list of contests get current contest Id and url
    fetchContext = (contestId) => {
      pushState(
        {currentContestId : contestId},
        `/contest/${contestId}`
      );
      //lookup the contest, 
      api.fetchContest(contestId).then(contest => {
        this.setState({
          
          currentContestId: contest._id,
          //add new info about current contest
          contests: {
            ...this.state.contests,
            [contest._id]: contest
          }
        });
      });
      
    };

    fetchContestList = () => {
      pushState(
        {currentContestId : null},
        `/`
      );
      //lookup the contest, 
      api.fetchContestList().then(contests => {
        this.setState({
                    
          currentContestId: null,
          //add new info about current contest
          contests
        });
      });
      
    };


    fetchNames = (nameIds) => {
      if(nameIds.length === 0){
        return;
      }
      api.fetchNames(nameIds).then(names => {
        this.setState({
          names
        });
      });
    }

    lookupName = (nameId) => {
      if(!this.state.names || !this.state.names[nameId]){
        return {
          name: '...',
        };
      }
      return this.state.names[nameId];
    }
    

    addName = (newName, contestId) => {
      api.addName(newName, contestId).then(resp => 
        this.setState({
          contests:{
            ...this.state.contests,
            [resp.updatedContest._id]: resp.updatedContest
          },
          names:{
            ...this.state.names,
            [resp.newName._id]: resp.newName
          }
        })
        ).catch(console.error);
    };

    pageHeader(){
      if(this.state.currentContestId){
        return this.state.contests[this.state.currentContestId].contestName;
      }
      else return 'Naming Contests';    
    }


    currentComponent = () => {
      //check if one contest is selected or display full list
      if(this.state.currentContestId){
        return <Contest 
          contestListClick={this.fetchContestList}
          fetchNames={this.fetchNames}
          lookupName={this.lookupName}
          addName={this.addName}
          {...this.state.contests[this.state.currentContestId]} /> ;
      }
      else{
        return <ContestList 
        onContestClick = {this.fetchContext}
        contests={this.state.contests} />;
      }
    };


    render(){
      return (
        <div className="App">
            <Header message = {this.pageHeader()} />
            <div>
              <h2 className="text-center">
                  App body 
              </h2>
            </div>
            
            <div>
              {this.currentComponent()}
            </div>
            

        </div>
    );
    }
};

export default App;








// export default function App() {
//   const [count, setCount] = useState(0);
//   return (
//     <div>
//       This is a sample stateful and server-side
//       rendered React application.
//       <br />
//       <br />
//       Here is a button that will track
//       how many times you click it:
//       <br />
//       <br />
//       <button onClick={() => setCount(count + 1)}>{count}</button>
//     </div>
//   );
// }