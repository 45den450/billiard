import { FunctionComponent, useState } from "react";
import "./App.css";
import { Canvas } from "./canvas";
import { Ball } from "./ball";

interface ColorChangerProps {
    changeColor: (color: string) => void;
    close: () => void;
}

const ColorChanger: FunctionComponent<ColorChangerProps> = ({ close, changeColor }) => {
    const [color, setColor] = useState<string>("#ffffff");
    return (
        <div className="change-color">
            <input
                type="color"
                value={color}
                onChange={e => {
                    setColor(e.target.value);
                    changeColor(e.target.value);
                }}
            />
            <button onClick={close}>X</button>
        </div>
    );
};

const App: FunctionComponent = () => {
    const size = { width: 800, height: 500 };

    const [isChangeColor, setIsChangeColor] = useState<boolean>(false);
    const [selectedBall, setSelectedBall] = useState<Ball | null>(null);
    return (
        <div className="app">
            <div className="canvas-wrapper" style={isChangeColor ? { filter: "blur(10px)" } : {}}>
                <Canvas
                    props={{ width: size.width, height: size.height }}
                    openChangeColor={ball => {
                        setSelectedBall(ball);
                        setIsChangeColor(true);
                    }}
                />
            </div>
            {isChangeColor ? (
                <ColorChanger
                    close={() => setIsChangeColor(!isChangeColor)}
                    changeColor={color => {
                        if (selectedBall) {
                            selectedBall.fill = color;
                        }
                    }}
                />
            ) : (
                <></>
            )}
        </div>
    );
};

export default App;
