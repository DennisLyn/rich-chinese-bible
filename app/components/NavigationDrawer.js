import React, { Component} from 'react';
import Drawer from 'react-native-drawer';
import SideMenu from './SideMenu';
import {Actions, DefaultRenderer} from 'react-native-router-flux';
class NavigationDrawer extends Component {
  render () {
    const state = this.props.navigationState
    const children = state.children
    return (
      <Drawer
        ref='navigation'
        type='overlay' //displace:overlay:static
        onOpen={()=>Actions.refresh({key:state.key, open: true})}
        onClose={()=>Actions.refresh({key:state.key, open: false})}
        open={state.open}
        acceptPan={true}
        content={<SideMenu/>}
        styles={drawerStyles}
        captureGestures={true}
        tapToClose={true}
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        panThreshold={150}
        negotiatePan={false}
        elevation={5}
        captureGestures={true}
        panOpenMask={5}
      >
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      </Drawer>
    )
  }
}

const drawerStyles = {
  drawer: {
    shadowColor:'#000', 
    shadowOpacity: 0.3, 
    // backgroundColor: '#fff',
    // backgroundColor: '#999',
    opacity: 0.98
  }
}

export default NavigationDrawer;
