// Updated: Adds 5 position buttons and loads corresponding IRs
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as Tone from "tone";
import { OrbitControls } from "@react-three/drei";

function DraggableSphere({ position, setPosition, color }) {
  const ref = useRef();
  const [dragging, setDragging] = useState(false);

  useFrame(({ mouse }) => {
    if (dragging) {
      const newX = mouse.x * 6;
      const newZ = mouse.y * -6;
      setPosition([newX, 0.5, newZ]);
    }
    ref.current.position.set(...position);
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerDown={() => setDragging(true)}
      onPointerUp={() => setDragging(false)}
    >
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function RoomScene({ sourcePos, setSourcePos, receiverPos, setReceiverPos }) {
  return (
    <Canvas camera={{ position: [4, 2.5, 3], fov: 80 }} style={{ background: '#fafafa' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, 0, 1]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Back Wall */}
      <mesh position={[1, 1, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#cccccc" side={2} />
      </mesh>

      {/* Left Wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 1, 1]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#d0d0d0" side={2} />
      </mesh>




      {/* Source (Red) */}
      <DraggableSphere position={sourcePos} setPosition={setSourcePos} color="red" />

      {/* Receiver (Blue) */}
      <DraggableSphere position={receiverPos} setPosition={setReceiverPos} color="blue" />

      <axesHelper args={[2]} />
      <OrbitControls />
    </Canvas>
  );
}

function App() {
  const sourcePositions = [
    [0.7, 0.7, 0.7],
    [0.85, 0.85, 0.85],
    [1.0, 1.0, 1.0],
    [1.15, 1.15, 1.15],
    [1.5, 1.5, 1.5],
  ];

  const receiverPositions = [
    [1.66256893, 1.61655235, 1.64047122],
    [1.52937829, 1.57425201, 1.57134283],
    [1.53937507, 1.50955164, 1.48763454],
    [0.33143353, 0.33566815, 0.36886978],
    [0.42988288, 0.43229115, 0.43867755],
  ];

  const [sourcePos, setSourcePos] = useState(sourcePositions[0]);
  const [receiverPos, setReceiverPos] = useState(receiverPositions[0]);
  const [convolver, setConvolver] = useState(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    Tone.start();
  }, []);

  
  const loadIRAndPlay = async (index) => {


    try {


      const irPath = `https://bronzeji.github.io/sound-visualizer/media/ir/ir_${index+1}44.wav`;
      const audioPath = "https://bronzeji.github.io/sound-visualizer/media/Summertime.mp3";
      console.log("Path loaded",irPath);

      const conv = new Tone.Convolver(irPath).toDestination();
      //await conv.load(irPath); // make sure IR is loaded
      console.log("IR loaded");
      console.log(window.location.href); // current path

      const pl = new Tone.Player({ url: audioPath, autostart: true });
      //const pl = new Tone.Player(audioPath);
      //await pl.load();
      pl.connect(conv);
      console.log("AudioContext state:", Tone.context.state);

      setConvolver(conv);
      setPlayer(pl);
      player.stop();
      //pl.start();

    } catch (error) {
      console.error("Error loading IR or audio:", error);
    }
  };

  const setPositionsAndPlay = (index) => {
    setSourcePos(sourcePositions[index]);
    setReceiverPos(receiverPositions[index]);
    loadIRAndPlay(index);
  };


  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <RoomScene
          sourcePos={sourcePos}
          setSourcePos={setSourcePos}
          receiverPos={receiverPos}
          setReceiverPos={setReceiverPos}
        />
      </div>
      <div style={{ padding: "10px", background: "#f0f0f0" }}>
        {[0, 1, 2, 3, 4].map(i => (
          <button key={i} onClick={() => setPositionsAndPlay(i)} style={{ margin: "5px" }}>
            Set Position {i + 1} & Play
          </button>
        ))}
        <button
          onClick={async () => {
            player.stop();
            await Tone.start();
            const testPlayer = new Tone.Player("https://bronzeji.github.io/sound-visualizer/media/Summertime.mp3").toDestination();
            testPlayer.autostart = true;

          }}
          style={{ margin: "5px", background: "#f0f0f0" }}
        >
          Play dry sound
        </button>

        <div>Source Position: {sourcePos.map(n => n.toFixed(2)).join(", ")}</div>
        <div>Receiver Position: {receiverPos.map(n => n.toFixed(2)).join(", ")}</div>
      </div>
    </div>
  );
}

export default App;
