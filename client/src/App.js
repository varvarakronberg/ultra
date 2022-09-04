import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import {useEffect, useRef, useState} from "react";
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {Vector3} from 'three';

const socket = io();

// Mouse-camera movement
const Rig = () => {
  const { camera, mouse } = useThree();
  const vec = new Vector3();
  return useFrame(() =>
      camera.position.lerp(
          vec.set(mouse.x * 2, mouse.y * 1, camera.position.z),
          0.02
      )
  );
};
const remoteMouse = {x: 0, y: 0};
const localMouse = {x: 0, y: 0};
const MouseMoveListener = () => {
    const { mouse } = useThree();
    useFrame((state, delta) => {
            if (remoteMouse.x != state.mouse.x || remoteMouse.y != state.mouse.y) {
                remoteMouse.x = state.mouse.x;
                remoteMouse.y = state.mouse.y;
                socket.emit('mouse_move', state.mouse);
            }
        }
    );
}
function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  const {mouse} = useThree();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
      if (localMouse.x != state.mouse.x || localMouse.y != state.mouse.y) {
          localMouse.x = state.mouse.x;
          localMouse.y = state.mouse.y;
          ref.current.rotation.x = mouse.x;
          ref.current.rotation.y = mouse.y;
      }
    }
  );
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
      <mesh
          {...props}
          ref={ref}
          scale={clicked ? 3 : 2.5}
          onClick={(event) => click(!clicked)}
          onPointerOver={(event) => hover(true)}
          onPointerOut={(event) => hover(false)}
          >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
  )
}

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
  const [remoteMouse, setRemoteMouse] = useState({"x": 0, "y": 0});

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });

    socket.on('remote_mouse_move', (mouse) => {
        console.log("remote mouse_move", JSON.stringify(mouse));
          setRemoteMouse(mouse);
      });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const sendPing = () => {
    socket.emit('ping');
  }



  return (
        <div className="App" style={{ width: "100vw", height: "100vh" }}>
          {/*<p>Connected: { '' + isConnected }</p>
          <p>Last pong: { lastPong || '-' }</p>
          <button onClick={ sendPing }>Send ping</button>*/}

          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Box position={[-1.2, 0, 0]} rotation={[remoteMouse.x, remoteMouse.y, 0]} />
            <MouseMoveListener />
          </Canvas>
        </div>
  );
}

export default App;
