import React, {useRef, useEffect, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import * as Tone from "tone";


function DraggableSphere({position, setPosition, color}){
  const ref=useRef();
  const [dragging, setDragging]=useState(false);

  useFrame(({mouse})=>{
    if (dragging){
      const newX=mouse.x*5;
      const newZ=mouse.y*-5;
      setPosition([newX,0.5,newZ]);
    }
    ref.current.position.set(...position); 
  });

  return(
    <mesh
      ref={ref}
      position={position}
      onPointerDown={() => setDragging(true)}
      onPointerUp={() => setDragging(false)}
      >
    <sphereGeometry args={[0.2, 32 ,32]} />
    <meshStandardMaterial color={color} />
    </mesh>
  );
}

function RoomScene({ sourcePos, setSourcePos, receiverPos, setReceiverPos}) {
    return (
    <Canvas camera={{ position: [0, 5, 5], fov: 50 }} style={{ background: "#f8f8f8" }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10,10,10]} />  

      {/* floor */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color='#e0e0e0'/>
      </mesh>
    

      {/* Source */}
      <DraggableSphere position={sourcePos} setPosition={setSourcePos} color="red" />

      {/* Receiver */}
      <DraggableSphere position={receiverPos} setPosition={setReceiverPos} color="blue" />
    </Canvas>
    );
  }


function App(){
  const [sourcePos, setSourcePos] = useState([1, 0.5, 1]);
  const [receiverPos, setReceiverPos] = useState([-1, 0.5, -1]);

  const playSound = () => {
    const panner = new Tone.Panner3D({ positionX: sourcePos[0], positionY: sourcePos[1], positionZ: sourcePos[2] });
    const player = new Tone.Player("https://tonejs.github.io/audio/berklee/gurgling_theremin.mp3").toDestination();
    player.connect(panner).toDestination();
    Tone.start();
    player.start();
  };

  return(
    <div style={{ height:"100vh", display:"flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <RoomScene
          sourcePos={sourcePos}
          setSourcePos={setSourcePos}
          receiverPos={receiverPos}
          setReceiverPos={setReceiverPos}
        />
      </div>
      <div style={{padding: "10px", background: "#f0f0f0"}}>
        <button onClick={playSound}>Play Sound from Source</button>
        <div>Source Position: {sourcePos.map(n => n.toFixed(2)).join(", ")}</div>
        <div>Receiver Position: {receiverPos.map(n => n.toFixed(2)).join(", ")}</div>
      </div>
    </div>
  );
}
export default App;




/*
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
*/

/*
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

  const playSound = () => {
    const panner = new Tone.Panner3D({ positionX: sourcePos[0], positionY: sourcePos[1], positionZ: sourcePos[2] });
    const player = new Tone.Player("https://tonejs.github.io/audio/berklee/gurgling_theremin.mp3").toDestination();
    player.connect(panner).toDestination();
    Tone.start();
    player.start();
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
*/
