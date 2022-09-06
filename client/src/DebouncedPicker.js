import React, {useEffect, useState} from "react";
import { HexColorPicker } from "react-colorful";
import {useSocketStore} from "./stores/socketStore";

function useDebounce(value, delay) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
        () => {
            // Update debounced value after delay
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            // Cancel the timeout if value changes (also on delay change or unmount)
            // This is how we prevent debounced value from updating if value is changed ...
            // .. within the delay period. Timeout gets cleared and restarted.
            return () => {
                clearTimeout(handler);
            };
        },
        [value, delay] // Only re-call effect if value or delay changes
    );
    return debouncedValue;
}

export const DebouncedPicker = ({ color }) => {
    const actions = useSocketStore((store) => store.actions);
    const remoteColor = useSocketStore((store) => store.shape.color);
    const [value, setValue] = useState(color);
    const debounceChangeTerm = useDebounce(value, 50);
    useEffect(
        () => actions.shape_color_change(value),
        [debounceChangeTerm] // Only call effect if debounced term changes
    );
    return <HexColorPicker color={remoteColor} onChange={setValue} />;
};
