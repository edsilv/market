import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  useGLTF,
  Stage,
  useTexture,
  Sphere,
} from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { useControls } from 'leva'

const PBR = ({ links, displacementScale }) => {
  const texturesLoader = useTexture([...Object.values(links)])
  const textures = Object.keys(links).reduce((acc, curr, i) => {
    acc[curr] = texturesLoader[i]

    return acc
  }, {})
  return (
    <Sphere args={[1, 200, 200]}>
      <meshPhysicalMaterial
        {...textures}
        side={THREE.DoubleSide}
        displacementScale={displacementScale}
      />
    </Sphere>
  )
}

const MatCap = ({ url }) => {
  const [matcap] = useTexture([url])
  const group = useRef()
  const { nodes } = useGLTF('/suzanne.gltf')

  return (
    <group ref={group} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Suzanne.geometry}
        position={[0, 0.19, -0.04]}
        attach='material'
      >
        <meshMatcapMaterial matcap={matcap} />
      </mesh>
    </group>
  )
}

const Material = ({ url, info: { category, links } }) => {
  const ref = useRef()
  const lightControls =
    category === 'matcaps'
      ? {}
      : {
          displacement: {
            value: 0.1,
            min: 0,
            max: 1,
            step: 0.1,
            label: 'displacement scale',
          },
          intensity: {
            value: 0.1,
            min: 0,
            max: 2,
            step: 0.1,
            label: 'light intensity',
          },
          preset: {
            value: 'rembrandt',
            options: ['rembrandt', 'portrait', 'upfront', 'soft'],
          },
          environment: {
            value: 'city',
            options: [
              '',
              'sunset',
              'dawn',
              'night',
              'warehouse',
              'forest',
              'apartment',
              'studio',
              'city',
              'park',
              'lobby',
            ],
          },
        }
  const controls = useControls(
    {
      autoRotate: true,
      contactShadow: true,
      ...lightControls,
    },
    { collapsed: true }
  )

  return (
    <>
      <Stage
        controls={ref}
        preset={controls.preset}
        intensity={controls.intensity}
        contactShadow={controls.contactShadow}
        environment={controls.environment}
        shadowBias={-0.001}
      >
        {category === 'matcaps' ? (
          <MatCap url={url} />
        ) : (
          <PBR links={links} displacementScale={controls.displacement} />
        )}
      </Stage>
      <OrbitControls ref={ref} autoRotate={controls.autoRotate} />
    </>
  )
}

export default function MaterialComponent(props) {
  return (
    <Canvas
      shadows
      gl={{ alpha: false }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 150], fov: 50 }}
    >
      <color attach='background' color='white' />
      <ambientLight intensity={0.25} />
      <Suspense fallback={null}>
        <Material {...props} />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload('/suzanne.gltf')
