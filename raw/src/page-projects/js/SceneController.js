import * as THREE from "three";
import * as TWEEN from "gsap";
import { coloursToArray } from './utils';

export default class SceneController
{
    constructor(props)
    {
        this.scene = new THREE.Scene();
  	    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.clock = new THREE.Clock();

        //shader stuff
        this.vertex = `varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}`;
        this.fragment = props.fragment;
        this.uniforms = props.uniforms;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.duration = props.duration || 1;
        this.debug = props.debug || false
        this.easing = props.easing || 'easeInOut'
    }

    setup()
    {
        //https://coolors.co/210124-750d37-b3dec1-dbf9f0-f7f9f7
        this.colourArr = (0, coloursToArray)('https://coolors.co/210124-750d37-b3dec1-dbf9f0-f7f9f7');
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.container = document.getElementById("playground");
        this.images = JSON.parse(this.container.getAttribute('data-images'));
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.container.appendChild(this.renderer.domElement);

        this.disposed = false;
        this.scene.background = this.colourArr[0];
        this.time = 0;
        this.current = 0;
        this.textures = [];
        this.paused = true;

        this.setupCamera();
        this.setupLight();
        this.setupListeners();

        this.setupImages(() => {
            // console.log(this.textures);
            this.settings();
            this.addObjects();
            this.onWindowResize();
            // this.onDocumentMouseDown();
            this.play();
        })

        this.render();
        this.animate();
    }

    setupCamera()
    {
        let VIEW_ANGLE = 50;
        let ASPECT_RATIO = window.innerWidth / window.innerHeight;
        let NEAR_PLANE = 1;
        let FAR_PLANE = 100;

        this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT_RATIO, NEAR_PLANE, FAR_PLANE );
        this.camera.position.set(0, 0, 3);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    setupLight()
    {
        let hemiLight = new THREE.HemisphereLight(this.colourArr[3], this.colourArr[2], 1);
		hemiLight.position.set( 0, 50, 0 );
        this.scene.add(hemiLight);
    }

    setupImages(cb)
    {
        const promises = [];
        let that = this;
        this.images.forEach((url, i)=> {
          let promise = new Promise(resolve => {
            that.textures[i] = new THREE.TextureLoader().load( url, resolve );
          });
          promises.push(promise);
        })
    
        Promise.all(promises).then(() => {
          cb();
        });
    }

    settings() 
    {
        this.settings = { progress:0.5 };
        Object.keys(this.uniforms).forEach((item)=> {
          this.settings[item] = this.uniforms[item].value;
        })
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
            border: { type: "f", value: 0 },
            intensity: { type: "f", value: 0 },
            scaleX: { type: "f", value: 40 },
            scaleY: { type: "f", value: 40 },
            transition: { type: "f", value: 40 },
            swipe: { type: "f", value: 0 },
            width: { type: "f", value: 0 },
            radius: { type: "f", value: 0 },
            texture1: { type: "f", value: this.textures[0] },
            texture2: { type: "f", value: this.textures[1] },
            displacement: { type: "f", value: new THREE.TextureLoader().load('../../img/mol1.jpg') },
            resolution: { type: "v4", value: new THREE.Vector4() },
          },
          vertexShader: this.vertex,
          fragmentShader: this.fragment
        });
    
        this.geometry = new THREE.PlaneGeometry(1, 1, 2, 2);
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plane);
    }

    stop() 
    {
        this.paused = true;
    }
    
    play() 
    {
        this.paused = false;
        this.render();
    }
    
    next()
    {
        if(this.isRunning) return;
        this.isRunning = true;
        let len = this.textures.length;
        let nextTexture = this.textures[(this.current +1)%len];
        // console.log(this.textures);
        // console.log(this.current);
        this.material.uniforms.texture2.value = nextTexture;
        let tl = new TWEEN.TimelineMax();
        tl.to(this.material.uniforms.progress,this.duration,{
          value:1,
          ease: TWEEN.Power2[this.easing],
          onComplete:()=>{
            // console.log('FINISH');
            this.current = (this.current +1)%len;
            this.material.uniforms.texture1.value = nextTexture;
            this.material.uniforms.progress.value = 0;
            this.isRunning = false;
        }})
    }
    
    render() 
    {
        if (this.paused) return;
        this.time += 0.05;
        this.material.uniforms.time.value = this.time;
        // this.material.uniforms.progress.value = this.settings.progress;

        Object.keys(this.uniforms).forEach((item)=> {
        this.material.uniforms[item].value = this.settings[item];
        });

        this.renderer.render(this.scene, this.camera);
    }

    animate()
    {
        if(this.disposed) return;
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }

    setupListeners()
    {
        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
        document.addEventListener("mousedown", this.onDocumentMouseDown.bind(this), false);
        document.addEventListener("mousemove", this.onDocumentMouseMove.bind(this), false);
        document.addEventListener("touchmove", this.onDocumentTouchMove.bind(this), false);
    }

    onWindowResize()
    {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight);

        //image stuff
        this.imageAspect = this.textures[0].image.height/this.textures[0].image.width;
        let a1; let a2;
        if(this.height/this.width>this.imageAspect) 
        {
            a1 = (this.width/this.height) * this.imageAspect ;
            a2 = 1;
        } else
        {
            a1 = 1;
            a2 = (this.height/this.width) / this.imageAspect;
        }

        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;

        const dist  = this.camera.position.z;
        const height = 1;
        this.camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

        this.plane.scale.x = this.camera.aspect;
        this.plane.scale.y = 1;

        this.camera.updateProjectionMatrix();
        this.render();
    }

    onDocumentMouseDown(e)
    {
        // console.log('clicked');
        this.next();
    }

    onDocumentMouseMove(e)
    {
    }

    onDocumentTouchMove(e)
    {
        this.next();
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
        if (this.touchTexture) this.touchTexture.texture.dispose();
        this.scene.dispose();
        this.renderer.dispose();
    }
}