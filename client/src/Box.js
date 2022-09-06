import {useRef, useState} from "react";
import {useFrame, useThree} from "@react-three/fiber";

const localMouse = {x: 0, y: 0};

export function Box(props) {
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
                ref.current.rotation.x = -mouse.y * 3;
                ref.current.rotation.y = mouse.x * 3;
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
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color={hovered ? 'hotpink' : props.color}/>
        </mesh>
    )
}
