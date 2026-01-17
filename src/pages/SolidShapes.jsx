import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html, Center, Environment, Float, ContactShadows, Stars } from '@react-three/drei';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import gsap from 'gsap';

// --- Constants & Data ---

const FACE_CONFIGS = {
  bottom: { name: '底面', color: '#4CAF50' },
  top:    { name: '顶面', color: '#4CAF50' },
  front:  { name: '前面', color: '#2196F3' },
  back:   { name: '后面', color: '#FFC107' },
  left:   { name: '左面', color: '#9C27B0' },
  right:  { name: '右面', color: '#F44336' },
};

// The 11 Nets of a Cube (defined as trees starting from 'bottom')
const NETS = [
  // --- 1-4-1 Types (6 variations) ---
  {
    id: '141_a', label: '1-4-1 (基础型/Cross)',
    structure: {
      face: 'bottom',
      children: [
        { face: 'back', side: 'top', children: [
           { face: 'top', side: 'top' }
        ]},
        { face: 'front', side: 'bottom' },
        { face: 'left', side: 'left' },
        { face: 'right', side: 'right' }
      ]
    }
  },
  {
    id: '141_b', label: '1-4-1 (错位型1)',
    structure: {
      face: 'bottom',
      children: [
        { face: 'back', side: 'top', children: [
           { face: 'top', side: 'top' },
           { face: 'left', side: 'left' }
        ]},
        { face: 'front', side: 'bottom' },
        { face: 'right', side: 'right' }
      ]
    }
  },
  {
      id: '141_d', label: '1-4-1 (错位型3)',
      structure: {
          face: 'bottom',
          children: [
              { face: 'back', side: 'top', children: [
                  { face: 'top', side: 'top' }
              ]},
              { face: 'front', side: 'bottom', children: [
                  { face: 'right', side: 'right' }
              ]},
              { face: 'left', side: 'left' }
          ]
      }
  },
  {
      id: '141_e', label: '1-4-1 (错位型4)',
      structure: {
          face: 'bottom',
          children: [
              { face: 'back', side: 'top', children: [
                  { face: 'top', side: 'top' }
              ]},
              { face: 'front', side: 'bottom', children: [
                  { face: 'left', side: 'left' }
              ]},
              { face: 'right', side: 'right' }
          ]
      }
  },
  {
    id: '141_f', label: '1-4-1 (长条型)',
    structure: {
        face: 'bottom',
        children: [
            { face: 'back', side: 'top', children: [
                { face: 'top', side: 'top', children: [
                    { face: 'front', side: 'top' }
                ]}
            ]},
            { face: 'left', side: 'left' },
            { face: 'right', side: 'right' }
        ]
    }
  },

  // --- 2-3-1 Types (3 variations) ---
  {
      id: '231_a', label: '2-3-1 (型A)',
      structure: {
          face: 'bottom',
          children: [
              { face: 'left', side: 'left' },
              { face: 'right', side: 'right' },
              { face: 'back', side: 'top' },
              { face: 'front', side: 'bottom', children: [
                  { face: 'top', side: 'bottom' }
              ]}
          ]
      }
  },
  {
      id: '231_b', label: '2-3-1 (型B)',
      structure: {
          face: 'bottom',
          children: [
              { face: 'left', side: 'left', children: [
                  { face: 'top', side: 'top' } // Top attached to Left
              ]},
              { face: 'right', side: 'right' },
              { face: 'back', side: 'top' },
              { face: 'front', side: 'bottom' }
          ]
      }
  },
  {
      id: '231_c', label: '2-3-1 (型C)',
      structure: {
          face: 'bottom',
          children: [
              { face: 'left', side: 'left' },
              { face: 'right', side: 'right', children: [
                  { face: 'top', side: 'top' } // Top attached to Right
              ]},
              { face: 'back', side: 'top' },
              { face: 'front', side: 'bottom' }
          ]
      }
  },

  // --- 2-2-2 Type (1 variation) ---
  {
    id: '222', label: '1-4-1 (错位型)',
    structure: {
        face: 'bottom',
        children: [
            { face: 'left', side: 'left' },
            { face: 'back', side: 'top', children: [
                { face: 'top', side: 'top', children: [
                    { face: 'right', side: 'right' },
                    { face: 'front', side: 'top' }
                ]}
            ]}
        ]
    }
  },

  // --- 3-3 Type (1 variation) ---
  {
      id: '33', label: '3-3 (两排型)',
      structure: {
          face: 'bottom',
          children: [
              { face: 'left', side: 'left' },
              { face: 'right', side: 'right' },
              { face: 'front', side: 'bottom', children: [
                  { face: 'top', side: 'right', children: [
                      { face: 'back', side: 'right' }
                  ]}
              ]}
          ]
      }
  }
];

// Helper to get dimensions based on face type and box size [w, h, d]
// Note: "Top/Bottom" are WxD. "Front/Back" are WxH. "Left/Right" are DxH.
const getFaceDims = (face, [w, h, d]) => {
  switch(face) {
    case 'bottom': case 'top': return [w, d];
    case 'front': case 'back': return [w, h];
    case 'left': case 'right': return [d, h];
    default: return [1, 1];
  }
};

// Recursive Face Component
const RecursiveFace = ({ 
    config, 
    isFolded, 
    boxDims, // [w, h, d]
    depth = 0
}) => {
    const { face, side, children } = config;
    const groupRef = useRef();
    
    const [w, h, d] = boxDims;
    const myDims = getFaceDims(face, boxDims); // [width, length]
    const thickness = 0.05;

    useEffect(() => {
        if (depth === 0) return; // Root is static
        
        // Fold Angle: -90 degrees (Math.PI/2) to fold IN
        const targetAngle = isFolded ? -Math.PI / 2 : 0;
        
        gsap.to(groupRef.current.rotation, {
            x: targetAngle,
            duration: 1.5,
            ease: "power2.inOut"
        });
    }, [isFolded, depth]);

    const FaceMesh = ({ args, color }) => (
        <group>
             <mesh position={[0, 0, -args[1]/2]}> {/* Offset to align bottom edge with origin */}
                <boxGeometry args={[args[0], thickness, args[1]]} />
                <meshPhysicalMaterial 
                    color={color} 
                    transparent opacity={0.9} 
                    roughness={0.1} metalness={0.1} clearcoat={0.5}
                />
                <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(args[0], thickness, args[1])]} />
                    <lineBasicMaterial color="white" linewidth={2} />
                </lineSegments>
                {/* Face Label */}
                {/* <Text position={[0, 0.1, 0]} fontSize={0.5} rotation={[-Math.PI/2,0,0]} color="white">
                    {FACE_CONFIGS[face].name}
                </Text> */}
            </mesh>
        </group>
    );

    return (
        <group ref={groupRef}>
            <FaceMesh args={myDims} color={FACE_CONFIGS[face].color} />
            
            {children && children.map((child, i) => {
                // Calculate Child Position & Rotation relative to THIS face
                // My dims: myDims[0] (x), myDims[1] (z)
                // Coordinate system: Origin at bottom edge, Z points UP (towards -z locally)
                
                let pos = [0, 0, 0];
                let rot = [0, 0, 0];
                
                // Child attach side relative to THIS face
                switch(child.side) {
                    case 'top': 
                        pos = [0, 0, -myDims[1]]; 
                        rot = [0, 0, 0]; 
                        break;
                    case 'bottom': 
                        // Should not happen in tree if flow is unidirectional, 
                        // but if it does, it's at origin.
                        pos = [0, 0, 0]; 
                        rot = [0, Math.PI, 0]; 
                        break;
                    case 'left': 
                        pos = [-myDims[0]/2, 0, -myDims[1]/2]; 
                        rot = [0, Math.PI/2, 0]; 
                        break;
                    case 'right': 
                        pos = [myDims[0]/2, 0, -myDims[1]/2]; 
                        rot = [0, -Math.PI/2, 0]; 
                        break;
                    default: break;
                }

                return (
                    <group key={i} position={pos} rotation={rot}>
                        <RecursiveFace 
                            config={child} 
                            isFolded={isFolded} 
                            boxDims={boxDims} 
                            depth={depth + 1} 
                        />
                    </group>
                );
            })}
        </group>
    );
};


const ShapeInfo = ({ title, description, features, minimized = false }) => {
  const [isMinimized, setIsMinimized] = useState(minimized);

  return (
    <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        maxWidth: '320px',
        pointerEvents: 'none',
        zIndex: 10
    }}>
        {/* Toggle Button (Clickable) */}
        <div style={{ pointerEvents: 'auto', marginBottom: '10px' }}>
            <button 
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    color: '#1a237e',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}
            >
                {isMinimized ? 'ℹ️ 显示信息' : '❌ 隐藏信息'}
            </button>
        </div>

        {/* Content (Only visible if not minimized) */}
        {!isMinimized && (
            <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                padding: '24px',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                pointerEvents: 'auto'
            }}>
                <h2 style={{ margin: '0 0 12px 0', color: '#1a237e', fontSize: '1.4em', fontWeight: '700' }}>{title}</h2>
                <p style={{ margin: '0 0 16px 0', color: '#3949ab', lineHeight: '1.6', fontSize: '0.95em' }}>{description}</p>
                <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#283593', fontSize: '1em', fontWeight: '600' }}>特征：</h4>
                <ul style={{ margin: '0', paddingLeft: '20px', color: '#5c6bc0', fontSize: '0.95em', lineHeight: '1.5' }}>
                    {features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                </div>
            </div>
        )}
    </div>
  );
};

const Navigation = ({ currentShape, onSelect }) => {
  const shapes = [
    { id: 'cube', label: '正方体', icon: '🧊' },
    { id: 'cuboid', label: '长方体', icon: '📦' },
    { id: 'cylinder', label: '圆柱', icon: '🛢️' },
    { id: 'cone', label: '圆锥', icon: '🍦' },
    { id: 'sphere', label: '球体', icon: '⚽' },
    { id: 'builder', label: '自定义搭建', icon: '🏗️' },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '12px',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px)',
      padding: '12px',
      borderRadius: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      zIndex: 10
    }}>
      {shapes.map(shape => (
        <button
          key={shape.id}
          onClick={() => onSelect(shape.id)}
          style={{
            background: currentShape === shape.id ? 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' : 'transparent',
            color: currentShape === shape.id ? 'white' : '#5c6bc0',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '16px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            boxShadow: currentShape === shape.id ? '0 4px 12px rgba(33, 150, 243, 0.3)' : 'none'
          }}
        >
          <span style={{fontSize: '18px'}}>{shape.icon}</span>
          <span>{shape.label}</span>
        </button>
      ))}
      <Link to="/math" style={{
        textDecoration: 'none',
        marginLeft: '12px',
        background: 'linear-gradient(135deg, #FF5252 0%, #D32F2F 100%)',
        color: 'white',
        padding: '10px 24px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: '15px',
        boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
        transition: 'all 0.2s ease'
      }}>
        🚪 退出
      </Link>
    </div>
  );
};

// --- Shape Modules ---

// 1. Cube / Cuboid with Folding Animation
const FoldingBox = ({ type = 'cube', isFolded, netId }) => {
  const [w, h, d] = type === 'cube' ? [2, 2, 2] : [3, 1.5, 2];
  
  // Find the selected net or default to first one
  const netConfig = NETS.find(n => n.id === netId) || NETS[0];

  return (
    <group>
        {/* Center the box based on its root face dimensions */}
        {/* Root is 'bottom' (w, d). Center is at (0,0,0) locally. */}
        {/* We want the whole structure to be centered visually. */}
        {/* RecursiveFace renders root starting at (0,0,0) extending to -Z (d). */}
        {/* So Center of Root is (0, 0, -d/2). */}
        {/* We shift it by +d/2 to center the Root at (0,0,0). */}
        <group position={[0, 0, d/2]}>
             <RecursiveFace 
                config={netConfig.structure} 
                isFolded={isFolded} 
                boxDims={[w, h, d]} 
             />
        </group>
    </group>
  );
};

// 2. Cylinder / Cone with Net
const CylinderModule = ({ type = 'cylinder', isUnfolded }) => {
   const solidRef = useRef();
   const netRef = useRef();

   const SIDE_COLOR = '#2196F3'; // Blue
   const CAP_COLOR = '#FFC107';  // Amber/Yellow

   useEffect(() => {
     if (isUnfolded) {
        gsap.to(solidRef.current.scale, { x: 0, y: 0, z: 0, duration: 1 });
        gsap.to(netRef.current.scale, { x: 1, y: 1, z: 1, duration: 1, delay: 0.5 });
     } else {
        gsap.to(netRef.current.scale, { x: 0, y: 0, z: 0, duration: 1 });
        gsap.to(solidRef.current.scale, { x: 1, y: 1, z: 1, duration: 1, delay: 0.5 });
     }
   }, [isUnfolded]);

   return (
     <group>
        {/* Solid Form */}
        <group ref={solidRef}>
            {type === 'cylinder' ? (
                <group>
                    <mesh>
                        <cylinderGeometry args={[1, 1, 2, 32, 1, true]} />
                        <meshPhysicalMaterial color={SIDE_COLOR} side={THREE.DoubleSide} roughness={0.2} metalness={0.1} />
                    </mesh>
                    <mesh position={[0, 1, 0]} rotation={[Math.PI/2, 0, 0]}>
                        <circleGeometry args={[1, 32]} />
                        <meshPhysicalMaterial color={CAP_COLOR} side={THREE.DoubleSide} roughness={0.2} metalness={0.1} />
                    </mesh>
                    <mesh position={[0, -1, 0]} rotation={[Math.PI/2, 0, 0]}>
                        <circleGeometry args={[1, 32]} />
                        <meshPhysicalMaterial color={CAP_COLOR} side={THREE.DoubleSide} roughness={0.2} metalness={0.1} />
                    </mesh>
                </group>
            ) : (
                <group>
                    <mesh>
                        <coneGeometry args={[1, Math.sqrt(3), 32, 1, true]} />
                        <meshPhysicalMaterial color="#9C27B0" side={THREE.DoubleSide} roughness={0.2} metalness={0.1} />
                    </mesh>
                    <mesh position={[0, -Math.sqrt(3)/2, 0]} rotation={[Math.PI/2, 0, 0]}>
                        <circleGeometry args={[1, 32]} />
                        <meshPhysicalMaterial color={CAP_COLOR} side={THREE.DoubleSide} roughness={0.2} metalness={0.1} />
                    </mesh>
                </group>
            )}
        </group>

        {/* Unfolded Net Form */}
        <group ref={netRef} scale={[0,0,0]} rotation={[-Math.PI/2, 0, 0]}>
             {type === 'cylinder' ? (
                 <group>
                    <mesh position={[0, 0, 0]}>
                        <planeGeometry args={[6.28, 2]} />
                        <meshStandardMaterial color={SIDE_COLOR} side={THREE.DoubleSide} />
                    </mesh>
                    <mesh position={[0, 1 + 1.1, 0]}>
                         <circleGeometry args={[1, 32]} />
                         <meshStandardMaterial color={CAP_COLOR} side={THREE.DoubleSide} />
                    </mesh>
                    <mesh position={[0, -1 - 1.1, 0]}>
                         <circleGeometry args={[1, 32]} />
                         <meshStandardMaterial color={CAP_COLOR} side={THREE.DoubleSide} />
                    </mesh>
                 </group>
             ) : (
                 <group>
                    <mesh position={[0, 1, 0]}>
                        <circleGeometry args={[2, 32, 0, Math.PI]} /> 
                        <meshStandardMaterial color="#9C27B0" side={THREE.DoubleSide} />
                    </mesh>
                    <mesh position={[0, -1.2, 0]}>
                        <circleGeometry args={[1, 32]} />
                        <meshStandardMaterial color={CAP_COLOR} side={THREE.DoubleSide} />
                    </mesh>
                 </group>
             )}
        </group>
     </group>
   );
};

// 3. Sphere Module
const SphereModule = ({ size }) => {
    return (
        <group scale={[size, size, size]}>
            <mesh>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshPhysicalMaterial 
                    color="#E91E63" 
                    roughness={0.2} 
                    metalness={0.1} 
                    clearcoat={0.8}
                    clearcoatRoughness={0.1}
                />
            </mesh>
            <mesh>
                <sphereGeometry args={[1.51, 16, 16]} />
                <meshBasicMaterial color="white" wireframe transparent opacity={0.3} />
            </mesh>
        </group>
    );
};

// 4. Builder Module
const BuilderModule = ({ blocks, setBlocks, deleteMode, previewMode, selectedColor }) => {
    const { camera, raycaster, mouse } = useThree();

    // Track ghost block position (null if not valid)
    const [ghostPos, setGhostPos] = useState(null);

    // Helper to get snapped position
    const getSnappedPos = (point, normal) => {
        const x = Math.floor(point.x + normal.x * 0.5) + 0.5;
        const y = Math.floor(point.y + normal.y * 0.5) + 0.5;
        const z = Math.floor(point.z + normal.z * 0.5) + 0.5;
        return [x, y, z];
    };
    
    // Calculate potential placement position based on event
    const calculatePlacement = (e) => {
        // If clicking on existing block
        if (e.object.userData.isBlock) {
             const cx = e.object.position.x;
             const cy = e.object.position.y;
             const cz = e.object.position.z;
             const { point } = e;
             
             const dx = point.x - cx;
             const dy = point.y - cy;
             const dz = point.z - cz;
             
             const adx = Math.abs(dx);
             const ady = Math.abs(dy);
             const adz = Math.abs(dz);
             
             let nx = 0, ny = 0, nz = 0;
             if (adx > ady && adx > adz) {
                 nx = Math.sign(dx);
             } else if (ady > adx && ady > adz) {
                 ny = Math.sign(dy);
             } else {
                 nz = Math.sign(dz);
             }
             
             const targetX = cx + nx;
             const targetY = cy + ny;
             const targetZ = cz + nz;
             
             if (targetY < 0.5) return null;
             return [targetX, targetY, targetZ];
        } 
        // If clicking on ground plane
        else if (e.object.userData.isGround) {
            const { point } = e;
            const nx = Math.floor(point.x) + 0.5;
            const ny = 0.5;
            const nz = Math.floor(point.z) + 0.5;
            return [nx, ny, nz];
        }
        return null;
    };

    const handlePointerMove = (e) => {
        // Hide ghost block on touch devices to prevent visual clutter
        if (e.pointerType === 'touch') {
            setGhostPos(null);
            return;
        }

        if (previewMode) {
            setGhostPos(null);
            return;
        }
        if (deleteMode) {
            setGhostPos(null);
            return;
        }
        e.stopPropagation();
        const pos = calculatePlacement(e);
        if (pos) {
            // Check if occupied
            const isOccupied = blocks.some(b => 
                Math.abs(b.pos[0] - pos[0]) < 0.1 && 
                Math.abs(b.pos[1] - pos[1]) < 0.1 && 
                Math.abs(b.pos[2] - pos[2]) < 0.1
            );
            if (!isOccupied) {
                setGhostPos(pos);
            } else {
                setGhostPos(null);
            }
        } else {
            setGhostPos(null);
        }
    };

    // --- Interaction State ---
    // Removed manual pointer tracking in favor of R3F e.delta

    const handleClick = (e) => {
        if (previewMode) return;

        // R3F drag detection: e.delta is the distance moved during click
        // Increased threshold to allow for slight movement when clicking (especially on trackpads/touch)
        if (e.delta > 50) return;

        e.stopPropagation();
        
        // R3F events have nativeEvent for modifiers
        const nativeEvent = e.nativeEvent;

        // Resolve the target object (handle clicks on children like edges)
        let targetObject = e.object;
        if (!targetObject.userData.isBlock && !targetObject.userData.isGround && targetObject.parent && targetObject.parent.userData.isBlock) {
            targetObject = targetObject.parent;
        }
        
        // If clicking on existing block
        if (targetObject.userData.isBlock) {
             // Check if holding Shift/Alt to remove OR delete mode is active
             if (deleteMode || e.altKey || e.shiftKey || nativeEvent.altKey || nativeEvent.shiftKey) {
                 const blockId = targetObject.userData.id;
                 setBlocks(prev => prev.filter(b => b.id !== blockId));
                 setGhostPos(null); // Clear ghost after interaction
             } else {
                 // Use ghostPos if available, otherwise calculate on the fly (for touch/mobile)
                 const pos = ghostPos || calculatePlacement(e);
                 
                 if (pos) {
                     // If we calculated position manually, verify it's not occupied
                     if (!ghostPos) {
                        const isOccupied = blocks.some(b => 
                            Math.abs(b.pos[0] - pos[0]) < 0.1 && 
                            Math.abs(b.pos[1] - pos[1]) < 0.1 && 
                            Math.abs(b.pos[2] - pos[2]) < 0.1
                        );
                        if (isOccupied) return;
                     }

                     const newId = Date.now() + Math.random();
                     setBlocks(prev => [...prev, { id: newId, pos: pos, color: selectedColor }]);
                 }
             }
        } 
        // If clicking on ground plane
        else if (targetObject.userData.isGround) {
            if (deleteMode) return;

            if (ghostPos) {
                const newId = Date.now() + Math.random();
                setBlocks(prev => [...prev, { id: newId, pos: ghostPos, color: selectedColor }]);
            } else if (ghostPos === null) {
                // Fallback if ghostPos wasn't updated (e.g. touch)
                const pos = calculatePlacement(e);
                if (pos) {
                    const isOccupied = blocks.some(b => 
                        Math.abs(b.pos[0] - pos[0]) < 0.1 && 
                        Math.abs(b.pos[1] - pos[1]) < 0.1 && 
                        Math.abs(b.pos[2] - pos[2]) < 0.1
                    );
                    if (!isOccupied) {
                         const newId = Date.now() + Math.random();
                         setBlocks(prev => [...prev, { id: newId, pos: pos, color: selectedColor }]);
                    }
                }
            }
        }
    };

    return (
        <group>
            {/* Ghost Block Preview */}
            {ghostPos && !deleteMode && !previewMode && (
                <mesh position={ghostPos} raycast={() => null}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshBasicMaterial color="#4CAF50" wireframe opacity={0.5} transparent />
                </mesh>
            )}

            {/* Ground Plane for building */}
            <gridHelper args={[20, 20, 0x444444, 0x888888]} position={[0, -0.01, 0]} />
            <mesh 
                rotation={[-Math.PI/2, 0, 0]} 
                position={[0, 0, 0]} 
                onClick={handleClick}
                onPointerMove={handlePointerMove}
                onPointerLeave={() => setGhostPos(null)}
                userData={{ isGround: true }}
                visible={true}
            >
                <planeGeometry args={[100, 100]} />
                <meshBasicMaterial transparent opacity={0.0} side={THREE.DoubleSide} />
            </mesh>

            {/* Blocks */}
            {blocks.map(block => (
                <mesh 
                    key={block.id} 
                    position={block.pos} 
                    onClick={handleClick}
                    onPointerMove={handlePointerMove}
                    userData={{ isBlock: true, id: block.id }}
                >
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color={deleteMode ? '#ffcdd2' : (block.color || '#FF9800')} />
                    <lineSegments raycast={() => null}>
                        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
                        <lineBasicMaterial color="white" linewidth={2} />
                    </lineSegments>
                </mesh>
            ))}
        </group>
    );
};


const SolidShapes = () => {
  const [currentShape, setCurrentShape] = useState('cube');
  const [isFolded, setIsFolded] = useState(true); // Default folded (solid)
  const [sphereSize, setSphereSize] = useState(1);
  const [selectedNet, setSelectedNet] = useState(NETS[0].id);
  
  // Builder State
  // Start with empty blocks so user can build anywhere
  const [blocks, setBlocks] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FF9800'); // Default color
  const [isControlsExpanded, setIsControlsExpanded] = useState(true); // Default expanded
  const [history, setHistory] = useState([[]]); // History for undo

  // Reset state when shape changes
  useEffect(() => {
    setIsFolded(true);
    setSphereSize(1);
    setDeleteMode(false);
    setPreviewMode(false);
    setIsControlsExpanded(true);
    
    // Ensure valid net selection when switching to Cuboid
    if (currentShape === 'cuboid') {
        const validCuboidNets = ['141_a', '222'];
        if (!validCuboidNets.includes(selectedNet)) {
            setSelectedNet('141_a');
        }
    }
  }, [currentShape]);

  const updateBlocks = (newBlocks) => {
      // If passing a function, resolve it first
      const resolvedBlocks = typeof newBlocks === 'function' ? newBlocks(blocks) : newBlocks;
      
      setBlocks(resolvedBlocks);
      setHistory(prev => [...prev, resolvedBlocks]);
  };

  const handleUndo = () => {
      if (history.length > 1) {
          const newHistory = history.slice(0, -1);
          setHistory(newHistory);
          setBlocks(newHistory[newHistory.length - 1]);
      }
  };

  const resetAll = () => {
      if (currentShape === 'builder') {
          // Reset to empty
          setBlocks([]);
          setHistory([[]]);
          setDeleteMode(false);
      } else {
          setIsFolded(true);
          setSphereSize(1);
      }
  };

  const getInfo = () => {
    switch (currentShape) {
      case 'cube':
        return {
          title: '正方体 (Cube)',
          description: '正方体是由6个完全相同的正方形围成的立体图形。',
          features: [
              '6个面 (Faces) - 都是正方形', 
              '12条棱 (Edges) - 长度相等', 
              '8个顶点 (Vertices)'
          ]
        };
      case 'cuboid':
        return {
          title: '长方体 (Cuboid)',
          description: '长方体是由6个长方形围成的立体图形（特殊情况有两个相对的面是正方形）。',
          features: [
              '6个面 (Faces) - 相对的面完全相同', 
              '12条棱 (Edges) - 相对的棱长度相等', 
              '8个顶点 (Vertices)'
          ]
        };
      case 'cylinder':
        return {
          title: '圆柱 (Cylinder)',
          description: '圆柱是由两个大小一样的圆和一个曲面围成的。',
          features: ['2个底面 - 圆形，大小相同', '1个侧面 - 曲面，展开是长方形', '高度 (Height) - 两个底面之间的距离']
        };
      case 'cone':
        return {
          title: '圆锥 (Cone)',
          description: '圆锥有一个圆形的底面和一个侧面。',
          features: ['1个底面 - 圆形', '1个侧面 - 曲面，展开是扇形', '1个顶点']
        };
      case 'sphere':
        return {
          title: '球体 (Sphere)',
          description: '球体表面上的任意一点到球心的距离都相等。',
          features: ['1个曲面', '没有棱', '没有顶点', '可以向任意方向滚动']
        };
      case 'builder':
        return {
            title: '自定义搭建 (Builder)',
            description: '使用小正方体搭建你想要的立体图形。',
            features: [
                `当前方块数: ${blocks.length}`,
                '点击任意位置放置方块',
                '按住 Alt/Shift + 点击可删除方块',
                '拖动空白处旋转视角'
            ]
        };
      default:
        return {};
    }
  };

  const info = getInfo();

  // Filter available nets based on shape
  const availableNets = currentShape === 'cuboid' 
      ? NETS.filter(n => ['141_a', '222'].includes(n.id))
      : NETS;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1000,
      // background: '#f0f4f8',
      background: 'radial-gradient(circle at 50% 0%, #f0f4ff 0%, #e6eeff 100%)', // Updated to match theme
      overflow: 'hidden'
    }}>
      
      {/* 3D Canvas */}
      <Canvas camera={{ position: [5, 5, 5], fov: 45 }} shadows>
        {/* Transparent background to let gradient show through, or use the gradient color */}
        {/* <color attach="background" args={['#f0f4f8']} /> */} 
        
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Environment preset="city" />

        {/* Builder Mode doesn't use Float or Center in the same way */}
        {currentShape === 'builder' ? (
            <BuilderModule blocks={blocks} setBlocks={updateBlocks} deleteMode={deleteMode} previewMode={previewMode} selectedColor={selectedColor} />
        ) : (
             <group>
                <Center>
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        {currentShape === 'cube' && <FoldingBox type="cube" isFolded={isFolded} netId={selectedNet} />}
                        {currentShape === 'cuboid' && <FoldingBox type="cuboid" isFolded={isFolded} netId={selectedNet} />}
                        {currentShape === 'cylinder' && <CylinderModule type="cylinder" isUnfolded={!isFolded} />}
                        {currentShape === 'cone' && <CylinderModule type="cone" isUnfolded={!isFolded} />}
                        {currentShape === 'sphere' && <SphereModule size={sphereSize} />}
                    </Float>
                </Center>
                <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
             </group>
        )}

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} makeDefault />
        {currentShape !== 'builder' && <gridHelper args={[20, 20, 0xdddddd, 0xeeeeee]} position={[0, -2, 0]} />}
      </Canvas>

      {/* Info Overlay */}
      {/* Auto minimize info in builder mode to avoid obstruction */}
      <ShapeInfo {...info} minimized={currentShape === 'builder'} />

      {/* Net Selector (Only for cube/cuboid) */}
      {(currentShape === 'cube' || currentShape === 'cuboid') && (
        <div style={{
            position: 'absolute',
            bottom: '100px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            padding: '15px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            maxHeight: '40vh',
            overflowY: 'auto',
            zIndex: 1500,
            width: '220px'
        }}>
           <h3 style={{margin: '0 0 10px 0', fontSize: '15px', color: '#1a237e', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px', fontWeight: '600'}}>选择展开图</h3>
           <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
               {availableNets.map(net => (
                   <button
                       key={net.id}
                       onClick={() => setSelectedNet(net.id)}
                       style={{
                           padding: '10px 12px',
                           borderRadius: '10px',
                           border: selectedNet === net.id ? '2px solid #2196F3' : '1px solid transparent',
                           background: selectedNet === net.id ? 'rgba(33, 150, 243, 0.1)' : 'rgba(255,255,255,0.5)',
                           cursor: 'pointer',
                           textAlign: 'left',
                           fontSize: '13px',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'space-between',
                           transition: 'all 0.2s',
                           color: selectedNet === net.id ? '#1565C0' : '#555'
                       }}
                   >
                       <span style={{flex: 1}}>{net.label}</span>
                       {selectedNet === net.id && <span style={{color: '#2196F3', fontWeight: 'bold'}}>✓</span>}
                   </button>
               ))}
           </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end', // Align right
          gap: '12px',
          zIndex: 2000 // Ensure above everything
      }}>
          {/* Collapse/Expand Toggle */}
          <button 
              onClick={() => setIsControlsExpanded(!isControlsExpanded)}
              style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '20px',
                  transition: 'transform 0.2s'
              }}
              title={isControlsExpanded ? "收起菜单" : "展开菜单"}
          >
              {isControlsExpanded ? '🔼' : '🔽'}
          </button>

          {/* Collapsible Content */}
          {isControlsExpanded && (
              <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  alignItems: 'flex-end'
              }}>
                {(currentShape === 'cube' || currentShape === 'cuboid') && (
                    <>
                    <button 
                        onClick={() => setIsFolded(!isFolded)}
                        style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            fontWeight: '600',
                            borderRadius: '16px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {isFolded ? '▶ 展开 (Unfold)' : '⏪ 折叠 (Fold)'}
                    </button>
                    </>
                )}

                {(currentShape === 'cylinder' || currentShape === 'cone') && (
                    <button 
                        onClick={() => setIsFolded(!isFolded)}
                        style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            fontWeight: '600',
                            borderRadius: '16px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {isFolded ? '▶ 展开侧面 (Unfold)' : '⏪ 恢复 (Reset)'}
                    </button>
                )}

                {currentShape === 'sphere' && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(20px)',
                        padding: '20px',
                        borderRadius: '20px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                    }}>
                        <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#1a237e'}}>大小调节</label>
                        <input 
                            type="range" 
                            min="0.5" 
                            max="1.5" 
                            step="0.1" 
                            value={sphereSize} 
                            onChange={(e) => setSphereSize(parseFloat(e.target.value))}
                            style={{width: '160px', accentColor: '#E91E63'}}
                        />
                    </div>
                )}

                {currentShape === 'builder' && (
                    <>
                        {/* Color Picker */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(20px)',
                            padding: '16px',
                            borderRadius: '20px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                            display: 'flex',
                            gap: '8px',
                            flexWrap: 'wrap',
                            width: '220px',
                            justifyContent: 'center',
                            marginBottom: '5px'
                        }}>
                             <div style={{width: '100%', textAlign: 'center', fontSize: '14px', marginBottom: '8px', color: '#5c6bc0', fontWeight: '600'}}>选择颜色</div>
                             {['#FF9800', '#F44336', '#2196F3', '#4CAF50', '#FFEB3B', '#9C27B0', '#795548', '#607D8B', '#000000', '#FFFFFF'].map(color => (
                                <button
                                  key={color}
                                  onClick={() => setSelectedColor(color)}
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: color,
                                    border: selectedColor === color ? '3px solid #333' : '2px solid white',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                    transform: selectedColor === color ? 'scale(1.15)' : 'scale(1)',
                                    transition: 'transform 0.2s'
                                  }}
                                  title={color}
                                />
                             ))}
                        </div>

                        <button
                            onClick={() => {
                                setPreviewMode(!previewMode);
                                if (!previewMode) setDeleteMode(false); // Turn off delete mode when entering preview
                            }}
                            style={{
                                padding: '12px 24px',
                                fontSize: '15px',
                                borderRadius: '16px',
                                border: 'none',
                                background: previewMode ? 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' : 'rgba(255,255,255,0.9)',
                                color: previewMode ? 'white' : '#333',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                        >
                            {previewMode ? '👁️ 预览模式 (已锁定)' : '👁️ 预览模式'}
                        </button>

                        <button
                            onClick={() => setDeleteMode(!deleteMode)}
                            disabled={previewMode}
                            style={{
                                padding: '12px 24px',
                                fontSize: '15px',
                                borderRadius: '16px',
                                border: 'none',
                                background: previewMode ? '#e0e0e0' : (deleteMode ? 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)' : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)'),
                                color: previewMode ? '#999' : 'white',
                                cursor: previewMode ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                        >
                            {deleteMode ? '🗑️ 正在删除模式' : '🏗️ 搭建模式'}
                        </button>

                        <button
                            onClick={handleUndo}
                            disabled={history.length <= 1 || previewMode}
                            style={{
                                padding: '12px 24px',
                                fontSize: '15px',
                                borderRadius: '16px',
                                border: 'none',
                                background: (history.length <= 1 || previewMode) ? '#e0e0e0' : 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                                color: (history.length <= 1 || previewMode) ? '#999' : 'white',
                                cursor: (history.length <= 1 || previewMode) ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                        >
                            ↩️ 撤销 (Undo)
                        </button>
                    </>
                )}

                <button 
                        onClick={resetAll}
                        style={{
                            padding: '12px 24px',
                            fontSize: '15px',
                            borderRadius: '16px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)',
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(96, 125, 139, 0.3)',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    >
                    🔄 重置 (Reset)
                </button>
            </div>
          )}
      </div>

      {/* Navigation */}
      <Navigation currentShape={currentShape} onSelect={setCurrentShape} />
    </div>
  );
};

export default SolidShapes;
