// rfce
import React from 'react'
import { PropTypes } from 'prop-types';

// onClick must be dinamical for each row in list. And not to re-create in each refresh
// for this we create react class component rcc
import { Component } from 'react'

class ContestPreview extends Component {
  handleClick = () =>{
    console.log(this.props.contestName);
    this.props.onClick(this.props._id);
  }

  render() {
    return (
      <div className='ContestPreview link' onClick={this.handleClick}>
        <h2>ContestPreview</h2>
        <div className='contestName'>{this.props.contestName}</div>
        <div className='categoryName'>{this.props.categoryName}</div>
        
        
      </div>
    )
  }
}
 

ContestPreview.propTypes = {
  _id: PropTypes.string.isRequired,
  categoryName: PropTypes.string.isRequired,
  contestName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};



export default ContestPreview