import './App.css';
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {useSocketStore} from "./stores/socketStore";
import {Box} from "./Box";
import {Cursor} from "./Cursor";
import {DebouncedPicker} from "./DebouncedPicker";
import { useState} from "react";

let localMouse = {x: 0, y:0};
const MouseMoveListener = () => {
    const actions = useSocketStore((store) => store.actions);
    const remoteUsers = useSocketStore((store) => store.users);
    const activeRemoteMouse = remoteUsers?.find(m => m.mouseState.active)?.mouseState ?? {x: 0, y:0, active:true};
    useFrame((state, delta) => {

        if (activeRemoteMouse.x != state.mouse.x || activeRemoteMouse.y != state.mouse.y) {
            actions.mouse_move(state.mouse);
        }
/*            if (remoteMouse.x != state.x || remoteMouse.y != state.y) {
                //remoteMouse.x = state.mouse.x;
                //remoteMouse.y = state.mouse.y;

            }*/
        }
    );
}


function App() {
    ///const remoteMouse = useSocketStore((store) => store.mouse);
    const remoteUsers = useSocketStore((store) => store.users);
    const activeRemoteMouse = remoteUsers?.find(u => u.mouseState.active)?.mouseState ?? {x: 0, y:0, active: true};
    const remoteShapeColor = useSocketStore((store) => store.shape.color);
  return (
        <div className="App" style={{ width: "100vw", height: "100vh" }}>
            <div className="controller"><DebouncedPicker /></div>
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Box position={[0, 0, 0]} rotation={[-activeRemoteMouse.y*3, activeRemoteMouse.x*3, 0]} color={remoteShapeColor} />
            <MouseMoveListener />
              {remoteUsers?.map(user => {
                  return  <Cursor mouse={user.mouseState} className="cursors-canvas" />
              })}

          </Canvas>
        </div>
  );
}

export default App;
