import create from "zustand";
import { combine } from "zustand/middleware";

import io from 'socket.io-client';

const initialState = {
    connected: false,
    users: [],
    shape: {color: "#ffde01"}
}
const mutations = (setState, getState) => {
    const socket = io();

    // this is enough to connect all our server events
    // to our state managment system!
    socket
        .on("connect", () => {
            setState({ connected: true });
        })
        .on("disconnect", () => {
            setState({ connected: false });
        })
        .on("remote_mouse_move", (users) => {
            setState({ users: users });
        })
        .on("remote_shape_color_change", (color) => {
            setState({shape: {color:color}});
        });

    return {
        actions: {
            mouse_move(mouse) {
                socket.emit("mouse_move", mouse);
            },
            shape_color_change(color) {
                socket.emit("shape_color_change", color);
            }
        },
    };
};


export const useSocketStore = create(combine(initialState, mutations));
