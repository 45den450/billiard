import { useRef, useEffect, FunctionComponent, CanvasHTMLAttributes } from "react";
import { GameManager } from "./gameManager";
import "./canvas.css";
import { Ball } from "./ball";

interface CanvasProps {
    props: CanvasHTMLAttributes<HTMLCanvasElement>;
    openChangeColor: (ball: Ball) => void;
}
// CanvasHTMLAttributes<HTMLCanvasElement> & { openChangeColor: () => void }
export const Canvas: FunctionComponent<CanvasProps> = ({ props, openChangeColor }) => {
    const manager = useRef(new GameManager({ height: +props.height!, width: +props.width! }));
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement | null;
        if (!canvas) {
            return;
        }
        const context = canvas.getContext("2d");
        if (!context) {
            return;
        }

        const getRelative = (e: MouseEvent): [number, number] => {
            return [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop];
        };
        const inCanvas = (relative: [number, number]): boolean => {
            return relative[0] > 0 && relative[0] < canvas.width && relative[1] > 0 && relative[1] < canvas.height;
        };

        canvas.ondblclick = e => {
            const [relativeX, relativeY] = getRelative(e);
            if (!inCanvas([relativeX, relativeY])) {
                return;
            }
            const ball = manager.current.getBallAtPoint(relativeX, relativeY);
            if (!ball) {
                return;
            }
            openChangeColor(ball);
        };

        canvas.onmouseup = e => {
            if (inCanvas(getRelative(e))) {
                manager.current.releaseBall();
            }
        };

        canvas.onmousedown = e => {
            const [relativeX, relativeY] = getRelative(e);
            if (inCanvas([relativeX, relativeY])) {
                manager.current.grabBall(relativeX, relativeY);
            }
        };

        canvas.onmousemove = e => {
            const [relativeX, relativeY] = getRelative(e);
            if (inCanvas([relativeX, relativeY])) {
                manager.current.moveCaughtBall(relativeX, relativeY);
                return;
            }
            manager.current.releaseBall();
        };

        (function (mouseStopDelay) {
            let timeout: NodeJS.Timeout;
            document.addEventListener("mousemove", e => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    const event = new CustomEvent("mousestop", {
                        detail: {
                            clientX: e.clientX,
                            clientY: e.clientY,
                        },
                        bubbles: true,
                        cancelable: true,
                    });
                    e.target?.dispatchEvent(event);
                }, mouseStopDelay);
            });
        })(50);

        canvas.addEventListener("mousestop", () => {
            manager.current.moveStop();
        });

        const interval = setInterval(() => manager.current.render(context), 10);

        // Стоп игра
        // setTimeout(() => {
        //     clearInterval(interval);
        // }, 15000);
    }, []);

    return <canvas className="canvas" ref={canvasRef} {...props} />;
};
