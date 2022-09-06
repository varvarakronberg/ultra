import './App.css';
import {Canvas} from '@react-three/fiber'
import {useSocketStore} from "./stores/socketStore";
import {Box} from "./Box";
import {Cursor} from "./Cursor";
import {DebouncedPicker} from "./DebouncedPicker";
import {MouseMoveListener} from "./MouseMoveListener";

function App() {
    const remoteUsers = useSocketStore((store) => store.users);
    const localSocketId = useSocketStore((store) => store.serverSocketId);
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
              {remoteUsers?.filter(u => u.socketId !== localSocketId).map(user => {
                  return  <Cursor mouse={user.mouseState} className="cursors-canvas" />
              })}
          </Canvas>
        </div>
    );
}

export default App;
