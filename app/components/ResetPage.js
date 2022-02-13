import React, { PureComponent } from 'react';
import CustomSpinner from './common/CustomSpinner'

class ResetPage extends PureComponent {
  constructor(props){
    super(props);
  }

  render() {
    return (
        <CustomSpinner />
    );
  }
}

export default ResetPage;
