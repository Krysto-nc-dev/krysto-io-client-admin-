<template>
  <div>
    <div class="row" id="container" 
         :style="'min-height:'+containerHeight+'px; min-width:100%;'"></div>
  </div>
</template>
<script>
import * as THREE from 'three'
//import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import axios from "axios"

export default {
  name: 'ThreeTest',
  props: ['actionSuccess', 'actionEchec'],
  data() {
    return {
      cube: null,
      renderer: null,
      scene: null,
      camera: null,
      controls: null,

      objectCSS: null,

      bubbleGeometry: null,
      bubble: null,

      play: false,

      cubes: [],
      spheres: [],
      yRotation: 0,

      nbCubesRotate: 0,
      idAnimation: null,

      containerHeight: 540,

      nbSuccess: 0,
      nbEchec: 0,
      locked: false,

    }
  },
  mounted() {
    this.$root.$on('restartCaptcha', () => { this.start() })
    this.$root.$on('tryAnswerCaptcha', (num) => { this.tryAnswer(num) })

    this.nbSuccess = 0
    this.nbEchec = 0
    this.locked = false
    this.$store.dispatch("captcha/setNbEchec", this.nbEchec)
    this.$store.dispatch("captcha/setNbSuccess", this.nbSuccess)
    
    this.start()
  },
  methods: {
    clearScene: function(){
      if(this.scene != null){
        cancelAnimationFrame(this.idAnimation)
        document.getElementById( 'container' ).innerHTML = ""
        this.scene.clear()
        this.cubes = []
        this.spheres = []
        this.nbCubesRotate = 0

      }
    },
    start: function(){ 
      setTimeout(async ()=>{
        await this.init()
        this.animate()
      }, 500)
    },
    init: async function() {

      await this.$store.dispatch('captcha/initSession')
      if(this.$store.state.captcha.session == null) return 
      
      this.clearScene()

      let dialog = document.getElementById( 'dialogCaptcha')
      let containerWidth = dialog.offsetWidth

      console.log("init 3D", dialog, dialog.offsetWidth, dialog.offsetHeight)
      
      if(this.$vuetify.breakpoint.width < 600)
      this.containerHeight = dialog.offsetHeight - 60

      this.scene = new THREE.Scene()
      this.scene.background = this.$vuetify.theme.dark ? new THREE.Color(0x1e1e1e) : new THREE.Color(0xffffff)

      this.camera = new THREE.PerspectiveCamera( 80, containerWidth / this.containerHeight,
                                                 0.01, 1000)
      //this.scene.add(new THREE.AxesHelper())
      this.camera.position.z = 32

      let nbC = this.$store.state.captcha.session.nbCubes //Math.random() * 9
      for(let i=0; i<nbC;i++)
        this.createCube()

      let nbS = Math.random() * 9
      for(let i=0; i<nbS;i++)
        this.createSphere()

      this.createCentraleSphere()

      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(containerWidth, this.containerHeight)
			this.renderer.physicallyCorrectLights = true;
      this.renderer.gammaInput = true;
      this.renderer.gammaOutput = true;
      
      this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      //this.controls.target.set(0,0,0)
			this.controls.enablePan = false
			this.controls.autoRotate = true
      this.controls.autoRotateSpeed = 1.0
			// this.controls.enableDamping = false;


      const light = new THREE.SpotLight( 0x2196F3, 50 ); // set intensity to 0 to start
      light.position.set(-10, -10, -4)
      this.scene.add(light);

      const light2 = new THREE.SpotLight( 0xF3E621, 50 ); // set intensity to 0 to start
      light2.position.set(33, 33, 33)
      this.scene.add(light2);

      const light3 = new THREE.SpotLight( 0x46ca33, 50 ); // set intensity to 0 to start
      light3.position.set(5, -5, -2)
      this.scene.add(light3);

      const light4 = new THREE.SpotLight( 0xca3333, 50 ); // set intensity to 0 to start
      light4.position.set(-5, 5, 5)
      this.scene.add(light4);

      document.getElementById("container").appendChild(this.renderer.domElement)
    },
    animate: function() {
      if(this.$store.state.captcha.session == null) return 
      
      this.idAnimation = requestAnimationFrame(this.animate)

      this.rotateCubes()
      this.rotateSphere()
      this.rotateCamera()

      this.renderer.render(this.scene, this.camera)
    },
    rotateCubes: function () {
      this.cubes.forEach((cube)=>{
       if(cube.rotate) cube.obj.rotation.x += 0.01
      })
    },
    rotateSphere: function () {
      this.cubes.forEach((cube)=>{
       if(cube.rotate) cube.obj.rotation.x += 0.1
      })
    },
    rotateCamera: function(){
      var rotSpeed = .02
      let x = this.camera.position.x
      let z = this.camera.position.z

      this.camera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
      this.camera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);

      this.camera.lookAt(0,0,0)
    },
    createCube: function(){
      let rotate = this.nbCubesRotate < this.$store.state.captcha.session.nbCubesRotate // (Math.random() > 0.5 ? 1: 0)

      let color = 0xffffff //rotate ? 0x25B79B : 0xffffff
      const geometry = new THREE.BoxGeometry( 2, 2, 2 );
      const material = new THREE.MeshStandardMaterial( {color: color, roughness: 0.3} );
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = (3 + Math.random()* 5) * (Math.random() > 0.5 ? (-1) : 1)
      cube.position.y = (3 + Math.random()* 5) * (Math.random() > 0.5 ? (-1) : 1)
      cube.position.z = (3 + Math.random()* 5) * (Math.random() > 0.5 ? (-1) : 1)
      this.scene.add( cube );

      this.cubes.push({ rotate : rotate, obj : cube})
      if(rotate) this.nbCubesRotate = this.nbCubesRotate + 1
    },
    createSphere: function(){
      const geometry = new THREE.SphereGeometry( 1, 32, 32 );
      const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0.3 } );
      const sphere = new THREE.Mesh( geometry, material );
      sphere.position.x = 3 + Math.random()*5 * (Math.random() > 0.5 ? (-1) : 1)
      sphere.position.y = 3 + Math.random()*5 * (Math.random() > 0.5 ? (-1) : 1)
      sphere.position.z = 3 + Math.random()*5 * (Math.random() > 0.5 ? (-1) : 1)
      this.scene.add( sphere );
    },
    createCentraleSphere: function(){
      const geometry = new THREE.SphereGeometry( 1, 32, 32);
      const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0.3 } );
      const sphere = new THREE.Mesh( geometry, material );
      sphere.position.x = 0
      sphere.position.y = 0
      sphere.position.z = 0
      this.scene.add( sphere );
    },

    tryAnswer: function(answer){
      console.log("tryAnswer", answer, this.nbCubesRotate, this.nbSuccess)
      //bonne réponse
      if(answer == this.nbCubesRotate){
        this.nbSuccess++
        //si pas encore 3 success d'affilé
        if(this.nbSuccess < 3){ 
          this.checkCaptcha(answer)
          this.clearScene()
          this.start()
          this.$store.dispatch('app/openSnackbar', 
                                { show: true, color:'green', 
                                  title: "Bonne réponse !",
                                  text: "Bravo ! Encore " + (3 - this.nbSuccess) + ' succès SVP' ,
                                  icon: 'thumb-up',
                                  top: true, 
                                  path: null })
        }
        else{ //si 3 success d'affilé
          this.nbSuccess = 0
          this.nbEchec = 0
          this.$store.dispatch("captcha/setNbSuccess", this.nbSuccess)
          this.$store.dispatch('captcha/setShowDialog', false)
          //execute l'action protégée par le captcha
          this.actionSuccess(answer)
        }
      }
      //mauvaise réponse
      else{ 
        //3 echecs cummulés
        if(this.nbEchec >= 3){ 
          this.checkCaptcha(answer)
          this.lockCaptcha()
          return
        }
        //pas encore 3 echec cumulés
        //this.nbSuccess = 0
        this.nbEchec++
        console.log("nbEchec", this.nbEchec)

        this.checkCaptcha(answer)

        this.$store.dispatch("captcha/setNbEchec", this.nbEchec)
          this.$store.dispatch('app/openSnackbar', 
                                { show: true, color:'red', 
                                  title: "Mauvaise réponse !",
                                  text: "Plus que " + (3 - this.nbEchec) + ' échecs permis' ,
                                  icon: 'thumb-down',
                                  top: true })
        this.start()
      }
      this.$store.dispatch("captcha/setNbSuccess", this.nbSuccess)
    },
    checkCaptcha: async function(answer){
      const { data } = await axios.post('/data/check-captcha-answer', 
                                  { sessionid: this.$store.state.captcha.session.sessionid,
                                    answer: answer 
                                  })
      return data.success
    },
    lockCaptcha: function(){
      this.locked = true
      this.$store.dispatch("captcha/setLocked", true)
    }
  }
}
</script>