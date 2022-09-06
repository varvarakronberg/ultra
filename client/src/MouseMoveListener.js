import {useSocketStore} from "./stores/socketStore";
import {useFrame} from "@react-three/fiber";

let localMouse = {x: 0, y: 0};
export const MouseMoveListener = () => {
    const actions = useSocketStore((store) => store.actions);
    useFrame((state, delta) => {
            if (localMouse.x != state.mouse.x || localMouse.y != state.mouse.y) {
                actions.mouse_move(state.mouse);
            }
        }
    );
}
