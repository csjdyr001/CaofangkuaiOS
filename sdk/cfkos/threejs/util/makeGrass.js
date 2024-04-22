class makeGrass {
  clock = new THREE.Clock()
  
  constructor(scene, mesh, grassesAmount) {
    this.scene = scene
    this.mesh = mesh
    this.initSampler()
    this.leavesMaterial = this.initleavesMaterial()
    this.makegrasses(grassesAmount)
  }

  
  initleavesMaterial() {
    const vertexShader = `
    varying vec2 vUv;
    uniform float time;
    
    
    float N (vec2 st) {
      return fract( sin( dot( st.xy, vec2(12.9898,78.233 ) ) ) *  43758.5453123);
      }
      
      float smoothNoise( vec2 ip ){
          vec2 lv = fract( ip );
        vec2 id = floor( ip );
        
        lv = lv * lv * ( 3. - 2. * lv );
        
        float bl = N( id );
        float br = N( id + vec2( 1, 0 ));
        float b = mix( bl, br, lv.x );
        
        float tl = N( id + vec2( 0, 1 ));
        float tr = N( id + vec2( 1, 1 ));
        float t = mix( tl, tr, lv.x );
        
        return mix( b, t, lv.y );
      }
    
      void main() {
  
      vUv = uv;
      float t = time * 2.;
      
      
      
      vec4 mvPosition = vec4( position, 1.0 );
      #ifdef USE_INSTANCING
          mvPosition = instanceMatrix * mvPosition;
      #endif
      
      
      
      float noise = smoothNoise(mvPosition.xz * 0.5 + vec2(0., t));
      noise = pow(noise * 0.5 + 0.5, 2.) * 2.;
      
      
      float dispPower = 1. - cos( uv.y * 3.1416 * 0.5 );
      
      float displacement = noise * ( 0.3 * dispPower );
      mvPosition.z -= displacement;
      
      
      
      vec4 modelViewPosition = modelViewMatrix * mvPosition;
      gl_Position = projectionMatrix * modelViewPosition;
  
      }
     `

    const fragmentShader = `
        varying vec2 vUv;
        void main() {
        vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
        float clarity = ( vUv.y * 0.5 ) + 0.5;
        gl_FragColor = vec4( baseColor * clarity, 1 );
        }
    `

    const uniforms = {
      time: {
        value: 0
      }
    }

    const leavesMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.DoubleSide
    })

    return leavesMaterial
  }

  
  initSampler() {
    this.sampler = new THREE.MeshSurfaceSampler(this.mesh)
      .setWeightAttribute(null)
      .build()
  }

  
  makegrasses(grassesAmount) {
    const instanceNumber = grassesAmount
    const dummy = new THREE.Object3D()
    const geometry = new THREE.PlaneGeometry(0.1, 1, 1, 1)
    geometry.translate(0, 0.5, 0) 
    const instancedMesh = new THREE.InstancedMesh(
      geometry,
      this.leavesMaterial,
      instanceNumber
    )
    this.scene.add(instancedMesh)
    const _position = new THREE.Vector3()
    const _normal = new THREE.Vector3()
    for (let i = 0; i < instanceNumber; i++) {
      this.sampler.sample(_position, _normal)
      _normal.add(_position)
      dummy.position.set(_position.x, _position.y, _position.z)
      
      dummy.scale.setScalar(0.2 + Math.random() * 0.6)
      dummy.rotation.y = Math.random() * Math.PI
      dummy.updateMatrix()
      instancedMesh.setMatrixAt(i, dummy.matrix)
    }
  }

  
  update() {
    this.leavesMaterial.uniforms.time.value = this.clock.getElapsedTime()
    this.leavesMaterial.uniformsNeedUpdate = true
  }
}