/** based on https://tympanus.net/Development/ExplodingObjects/index-icosahedron.html */

import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { coloursToArray, getRandomAxis, getCentroid } from './utils';

const img1 = require('../../img/skybox/bk.jpg');
const img2 = require('../../img/skybox/dn.jpg');
const img3 = require('../../img/skybox/ft.jpg');
const img4 = require('../../img/skybox/lf.jpg');
const img5 = require('../../img/skybox/rt.jpg');
const img6 = require('../../img/skybox/up.jpg');

export default class SceneController
{
    constructor()
    {
        this.scene = new THREE.Scene();
  	    this.renderer = new THREE.WebGLRenderer( { antialias: true } ); //alpha: true
        this.clock = new THREE.Clock();
    }

    setup()
    {
        this.colourArr = (0, coloursToArray)('https://coolors.co/2f3e4f-af7595-1ac8ed-8c2155-5c1a1b');
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        this.disposed = false;

        this.scene.background = this.colourArr[0]; 

        this.surfaceColor = this.colourArr[1]; 
        this.insideColor = this.colourArr[2]; 
        this.inverted = false;

        this.targetmouseX = 0;
        this.targetmouseY = 0;

        this.delta = this.clock.getDelta();

        this.setupCamera();
        this.setupLight();
        this.setupControls();
        this.setupListeners();
        this.setupcubeTexture();
        this.setupModels();
        this.settings();
        this.addObjects();
        this.render();
        this.animate();
    }

    settings() 
    {
        this.settings = {
          progress: 0
        };
    }

    setupCamera()
    {
        let VIEW_ANGLE = 50;
        let ASPECT_RATIO = window.innerWidth / window.innerHeight;
        let NEAR_PLANE = 0.1;
        let FAR_PLANE = 100;

        this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT_RATIO, NEAR_PLANE, FAR_PLANE );
        this.camera.position.set(0, 0, 8);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    setupLight()
    {
        let hemiLight = new THREE.HemisphereLight(this.colourArr[2], this.colourArr[3], 3);
		hemiLight.position.set(0, 5, 0);
        this.scene.add(hemiLight);
    }

    setupControls()
    {
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        //this.controls.rotateSpeed = 1.0;
        this.controls.autoRotateSpeed = .2;
        this.controls.autoRotate = true;
		this.controls.zoomSpeed = 1.2;
		this.controls.panSpeed = 0.8;
		this.controls.enableZoom = true;
		this.controls.enablePan = false;
		this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.3;
        this.controls.maxDistance = 80;
        this.controls.minDistance = 5;
		this.controls.addEventListener( 'change', this.render.bind(this) );
    }

    setupModels()
    {
        this.voronoi = [];
        const loader = new GLTFLoader();  
        loader.load('../../models/icoVoronoi.gltf',
        (gltf) => {
            gltf.scene.scale.set(20, 20, 20);
            gltf.scene.traverse(child => {
                if(child.name === "Voronoi_Fracture")
                {
                    if(child.children[0].children.length > 2)
                    {
                        child.children.forEach(f => {
                            f.children.forEach(m => {
                              this.voronoi.push(m.clone());
                            });
                          });
                    } else 
                    {
                        child.children.forEach(m => {
                            this.voronoi.push(m.clone());
                        });
                    }
                }  
            });
        // console.log(gltf.scene);
        this.geoms = [];
        this.geoms1 = [];
        let j = 0;
        this.voronoi = this.voronoi.filter(v => {
          if(v.isMesh) return false;
          else 
          {
            j++;
            let vtempo = this.processSurface(v, j);
            if(this.inverted) 
            {
              this.geoms1.push(vtempo.surface);
              this.geoms.push(vtempo.volume);
            } else 
            {
              this.geoms.push(vtempo.surface);
              this.geoms1.push(vtempo.volume);
            }
            return true;
          }
        });
        let s = BufferGeometryUtils.mergeBufferGeometries(
        this.geoms,
        false
        );

        this.mesh = new THREE.Mesh(s, this.material);
        this.scene.add(this.mesh);

        let s1 = BufferGeometryUtils.mergeBufferGeometries(
            this.geoms1,
            false
        );
        this.mesh1 = new THREE.Mesh(s1, this.material1);
        this.scene.add(this.mesh1);
        },
        undefined,
        function(e) 
        {
        console.error(e);
        }
    );
    }

    processSurface(v, j) 
    {
        let c = v.position;
        let vtemp, vtemp1;
        vtemp = v.children[0].geometry.clone();
        vtemp = vtemp.applyMatrix4(
            new THREE.Matrix4().makeTranslation(c.x, c.y, c.z)
        );
        vtemp1 = v.children[1].geometry;
        vtemp1 = vtemp1
        .clone()
        .applyMatrix4(new THREE.Matrix4().makeTranslation(c.x, c.y, c.z));

        let len = v.children[0].geometry.attributes.position.array.length / 3;
        let len1 = v.children[1].geometry.attributes.position.array.length / 3;
        //  id
        let offset = new Array(len).fill(j / 100);
        vtemp.setAttribute(
            "offset",
            new THREE.BufferAttribute(new Float32Array(offset), 1)
        );

        let offset1 = new Array(len1).fill(j / 100);
        vtemp1.setAttribute(
            "offset",
            new THREE.BufferAttribute(new Float32Array(offset1), 1)
        );

        // axis
        let axis = getRandomAxis();
        let axes = new Array(len * 3).fill(0);
        let axes1 = new Array(len1 * 3).fill(0);
        for (let i = 0; i < len * 3; i = i + 3) {
        axes[i] = axis.x;
        axes[i + 1] = axis.y;
        axes[i + 2] = axis.z;
        }
        vtemp.setAttribute(
            "axis",
            new THREE.BufferAttribute(new Float32Array(axes), 3)
        );
        for(let i = 0; i < len1 * 3; i = i + 3) 
        {
            axes1[i] = axis.x;
            axes1[i + 1] = axis.y;
            axes1[i + 2] = axis.z;
        }
        vtemp1.setAttribute(
            "axis",
            new THREE.BufferAttribute(new Float32Array(axes1), 3)
        );

        let centroidVector = getCentroid(vtemp);
        let centroid = new Array(len * 3).fill(0);
        let centroid1 = new Array(len1 * 3).fill(0);
        for(let i = 0; i < len * 3; i = i + 3) 
        {
            centroid[i] = centroidVector.x;
            centroid[i + 1] = centroidVector.y;
            centroid[i + 2] = centroidVector.z;
        }
        for(let i = 0; i < len1 * 3; i = i + 3) 
        {
            centroid1[i] = centroidVector.x;
            centroid1[i + 1] = centroidVector.y;
            centroid1[i + 2] = centroidVector.z;
        }
        vtemp.setAttribute(
            "centroid",
            new THREE.BufferAttribute(new Float32Array(centroid), 3)
        );
        vtemp1.setAttribute(
            "centroid",
            new THREE.BufferAttribute(new Float32Array(centroid1), 3)
        );

        return { surface: vtemp, volume: vtemp1 };
    }

    setupcubeTexture() 
    {
        let urls = [
            img1,
            img2,
            img3,
            img4,
            img5,
            img6
        ];
        this.textureCube = new THREE.CubeTextureLoader().load(urls);
      }
    
      addObjects() 
      {
        this.material = new THREE.ShaderMaterial({
          extensions: {
            derivatives: "#extension GL_OES_standard_derivatives : enable"
          },
          side: THREE.DoubleSide,
          uniforms: {
            time: { type: "f", value: 0 },
            progress: { type: "f", value: 0 },
            inside: { type: "f", value: 0 },
            surfaceColor: { type: "v3", value: this.surfaceColor },
            insideColor: { type: "v3", value: this.insideColor },
            tCube: { value: this.textureCube },
            pixels: {
              type: "v2",
              value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            },
            uvRate1: {
              value: new THREE.Vector2(1, 1)
            }
          },
          vertexShader: `
            uniform float time;
            uniform float progress;
            uniform float inside;

            attribute vec3 centroid;
            attribute vec3 axis;
            attribute float offset;

            varying vec3 eye;
            varying vec3 vNormal;
            varying vec3 vReflect;

            mat4 rotationMatrix(vec3 axis, float angle) 
            {
                axis = normalize(axis);
                float s = sin(angle);
                float c = cos(angle);
                float oc = 1.0 - c;
                
                return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                            oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                            oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                            0.0,                                0.0,                                0.0,                                1.0);
            }

            vec3 rotate(vec3 v, vec3 axis, float angle) 
            {
                mat4 m = rotationMatrix(axis, angle);
                return (m * vec4(v, 1.0)).xyz;
            }

            vec3 bezier4(vec3 a, vec3 b, vec3 c, vec3 d, float t) 
            {
                return mix(mix(mix(a, b, t), mix(b, c, t), t), mix(mix(b, c, t), mix(c, d, t), t), t);
            }

            float easeInOutQuint(float t)
            {
                return t < 0.5 ? 16.0 * t * t * t * t * t : 1.0 + 16.0 * (--t) * t * t * t * t;
            }

            float easeOutQuint(float t)
            {
                return 1. + (--t) * t * t * t * t;
            }
            float easeOut(float t)
            {
                return  t * t * t;
            }

            void main() 
            {
            vec3 newposition = position;

            float vTemp =  1. - ((centroid.x + centroid.y)*0.5 + 1.)/2.;

            float tProgress = max(0.0, (progress - vTemp*0.4) /0.6);
            vec3 newnormal = rotate(normal,axis,tProgress*(3. + offset*10.));
            vNormal = newnormal;

            newposition += newposition + centroid*(tProgress)*(3. + offset*7.);

            eye = normalize( vec3( modelViewMatrix * vec4( newposition, 1.0 ) ) );
            vec4 worldPosition = modelMatrix * vec4( newposition, 1.0 );
            vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * newnormal );
            vec3 I = worldPosition.xyz - cameraPosition;
            vReflect = reflect( I, worldNormal );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );
            }`
          ,
          fragmentShader: `
            uniform float time;
            uniform float progress;
            uniform float inside;
            uniform vec3 surfaceColor;
            uniform vec3 insideColor;
            uniform samplerCube tCube;

            varying vec2 vUv;
            varying vec2 vUv1;
            varying vec3 eye;
            varying vec3 vNormal;
            varying vec3 vReflect;

            void main()	
            {
                vec3 r = reflect( eye, vNormal );
                float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
                vec2 vN = r.xy / m + .5;
                vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );

                vec3 light = normalize(vec3(12.,10.,10.));
                vec3 light1 = normalize(vec3(-12.,-10.,-10.));
                float l = clamp(dot(light, vNormal),0.5,1.);
                l += clamp(dot(light1, vNormal),0.5,1.)/2.;
                // l /= 2.;
                
                if(inside>0.5){
                    gl_FragColor = vec4(l,l,l,1.)*vec4(surfaceColor,1.);
                } else{
                    gl_FragColor = reflectedColor*vec4(insideColor,1.);
                }
            }`
        });
    
        this.material1 = this.material.clone();
        this.material1.uniforms.inside.value = 1;
      }

    render() 
    {
        if (isNaN(this.delta) || this.delta > 1000 || this.delta == 0 ) 
        {
	        this.delta = 1000/60;
        }
        this.material.uniforms.progress.value = Math.abs(this.settings.progress);
        this.material1.uniforms.progress.value = Math.abs(this.settings.progress);
        this.renderer.render(this.scene, this.camera);
    }

    animate()
    {
        if(this.disposed) return;
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        this.render();
    }

    setupListeners()
    {
        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
        document.addEventListener("keydown", this.onDocumentKeyDown.bind(this), false);
        document.addEventListener("mousedown", this.onDocumentMouseDown.bind(this), false);
        document.addEventListener("mousemove", this.onDocumentMouseMove.bind(this), false);
        document.addEventListener("mouseup", this.onDocumentMouseUp.bind(this), false);
        document.addEventListener("touchmove", this.onDocumentTouchMove.bind(this), false);
    }

    onWindowResize()
    {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight);
        this.render();
    }

    onDocumentMouseDown(e)
    {}

    onDocumentMouseUp(e)
    {}

    onDocumentMouseMove(e)
    {
        this.targetmouseX = 2*(e.clientX - window.innerWidth/2)/window.innerWidth;
        this.targetmouseY = 2*(e.clientY - window.innerHeight/2)/window.innerHeight;

        let r = Math.sqrt(this.targetmouseX * this.targetmouseX + this.targetmouseY * this.targetmouseY);
        r = this.targetmouseX;
        this.settings.progress= r*r;
    }

    onDocumentKeyDown(e) 
    {
    }

    onDocumentTouchMove(e)
    {
        const touch = e.targetTouches[0];
        this.onDocumentMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    }

    dispose() 
    {
        this.disposed = true;
        window.removeEventListener("resize", this.onWindowResize);
        window.removeEventListener("mousemove", this.onDocumentMouseMove);
        this.scene.children.forEach(child => {
          child.material.dispose();
          child.geometry.dispose();
        });
        if (this.assets.glyphs) this.assets.glyphs.dispose();
        this.scene.dispose();
        this.renderer.dispose();
    }
}