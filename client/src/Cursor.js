import {useFrame, useThree} from "@react-three/fiber";
import {useRef} from "react";

export function Cursor(props) {
    let cursorRef = useRef();

    const {viewport} = useThree();
    const {mouse} = props;

    useFrame(() => {
        let x = mouse.x * viewport.width / 2;
        let y = mouse.y * viewport.height / 2;
        cursorRef.current.position.set(x, y, 2);
    });

    return (<mesh ref={cursorRef}>
            <torusGeometry args={[0.1, 0.04, 10, 50]} />
            <meshStandardMaterial color={mouse.color}/>
    </mesh>);
}
