import {useRef, useState} from "react";
import {useFrame, useThree} from "@react-three/fiber";

const localMouse = {x: 0, y: 0};
export function Box(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef();
    const {mouse} = useThree();
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
            scale={2.5}
        >
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color={props.color}/>
        </mesh>
    )
}
