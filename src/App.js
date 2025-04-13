// Starter template using React, Three.js, and Tone.js
import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as Tone from "tone";

function DraggableSphere({ position, setPosition, color }) {
  const ref = useRef();
  const [dragging, setDragging] = useState(false);

  useFrame(({ mouse }) => {
    if (dragging) {
      const newX = mouse.x * 5;
      const newZ = mouse.y * -5;
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
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function RoomScene({ sourcePos, setSourcePos, receiverPos, setReceiverPos }) {
  return (
    <Canvas camera={{ position: [0, 5, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Source (Red) */}
      <DraggableSphere position={sourcePos} setPosition={setSourcePos} color="red" />

      {/* Receiver (Blue) */}
      <DraggableSphere position={receiverPos} setPosition={setReceiverPos} color="blue" />

    </Canvas>
  );
}


function App() {
  const [sourcePos, setSourcePos] = useState([1, 0.5, 1]);
  const [receiverPos, setReceiverPos] = useState([-1, 0.5, -1]);

  /*const playSound = async () => {
    const player = new Tone.Player("./media/Summertime.mp3").toDestination();
    Tone.loaded().then(() => {player.start();});
  };
*/
  /*const playSound = async () => {
      await Tone.start();

      // Calculate distance between source and receiver
      const dx = sourcePos[0] - receiverPos[0];
      const dy = sourcePos[1] - receiverPos[1];
      const dz = sourcePos[2] - receiverPos[2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Calculate gain based on inverse square law
      const volume = 1 / (1 + distance * distance);

      const gain = new Tone.Gain(volume).toDestination();
      const player = new Tone.Player("/media/Summertime.mp3").connect(gain);

      Tone.loaded().then(() => {
        player.start();
      });
  };*/
  const [player, setPlayer] = useState(null);
  const [gainNode, setGainNode] = useState(null);

  useEffect(() => {
    const setup = async () => {
      await Tone.start();
      const gain = new Tone.Gain(1).toDestination();
      const pl = new Tone.Player("/media/Summertime.mp3").connect(gain);
      await Tone.loaded();
      setPlayer(pl);
      setGainNode(gain);
    };
    setup();
  }, []);

  useEffect(() => {
    if (gainNode) {
      const dx = sourcePos[0] - receiverPos[0];
      const dy = sourcePos[1] - receiverPos[1];
      const dz = sourcePos[2] - receiverPos[2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const volume = 1 / (1 + distance * distance);
      gainNode.gain.rampTo(volume, 0.1);
    }
  }, [sourcePos, receiverPos, gainNode]);

  const playSound = () => {
    if (player && player.state !== "started") {
      player.start();
    }
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
        <button onClick={playSound}>Play Sound from Source</button>
        <div>Source Position: {sourcePos.map(n => n.toFixed(2)).join(", ")}</div>
        <div>Receiver Position: {receiverPos.map(n => n.toFixed(2)).join(", ")}</div>
      </div>
    </div>
  );
}

export default App;

