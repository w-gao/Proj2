"use strict";

const Player = {
    init: function (name, position) {
        this.name = name;
        this.position = position;
    }
};

const LocalPlayer = {
    init: function (name, position) {
        Player.prototype.init(name, position);

    }
};

/**
 * User requests to join the game
 */
function joinGame() {
    const username = document.getElementById('input_username').value;
    if (username === '') return;

    if (Network.sendLogin(username)) {

        UI.hideLoginForm();
        UI.setUserName(username);

        startGame();
    }
}

/**
 * User requests to send a message
 */
function onChat() {
    const chatInput = document.getElementById('chat_input');
    const message = chatInput.value;

    if (message === '') return;
    chatInput.value = '';

    Network.sendChat(message);
}

// global variables
let engine, gameScene;

function startGame() {

    // setup engine
    if (BABYLON.Engine.isSupported()) {

        const canvas = document.getElementById('renderCanvas');

        $("#renderCanvas").show();

        engine = new BABYLON.Engine(canvas, true);

        // disable the .manifest files for now
        engine.enableOfflineSupport = false;

        const createScene = function () {
            gameScene = new BABYLON.Scene(engine);
            const scene = gameScene;
            // scene.clearColor = new BABYLON.Color3.White();

            const camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, 0), scene);
            // camera.setTarget(BABYLON.Vector3.Zero());
            camera.checkCollisions = true;
            camera.applyGravity = true;
            camera.attachControl(canvas, false);
            camera.speed = 0.6;

            scene.activeCamera = camera;

            const light = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(0.2, -1, 0), scene);
            light.position = new BABYLON.Vector3(0, 80, 0);
            // light.intensity = 0.7;

            // Shadows
            const shadowGenerator = new BABYLON.ShadowGenerator(2048, light);

            // Physics
            scene.enablePhysics(null, new BABYLON.OimoJSPlugin());

            let y = 0;
            for (let index = 0; index < 10; index++) {
                const sphere = BABYLON.Mesh.CreateSphere("Sphere0", 16, 3, scene);

                sphere.position = new BABYLON.Vector3(Math.random() * 20 - 10, y, Math.random() * 10 - 5);

                shadowGenerator.addShadowCaster(sphere);

                sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 1}, scene);

                y += 2;
            }

            const ground = BABYLON.Mesh.CreateBox("Ground", 1, scene);
            ground.scaling = new BABYLON.Vector3(100, 1, 100);
            ground.position.y = -5.0;
            ground.checkCollisions = true;

            const border0 = BABYLON.Mesh.CreateBox("border0", 1, scene);
            border0.scaling = new BABYLON.Vector3(1, 100, 100);
            border0.position.y = -5.0;
            border0.position.x = -50.0;
            border0.checkCollisions = true;

            const border1 = BABYLON.Mesh.CreateBox("border1", 1, scene);
            border1.scaling = new BABYLON.Vector3(1, 100, 100);
            border1.position.y = -5.0;
            border1.position.x = 50.0;
            border1.checkCollisions = true;

            const border2 = BABYLON.Mesh.CreateBox("border2", 1, scene);
            border2.scaling = new BABYLON.Vector3(100, 100, 1);
            border2.position.y = -5.0;
            border2.position.z = 50.0;
            border2.checkCollisions = true;

            const border3 = BABYLON.Mesh.CreateBox("border3", 1, scene);
            border3.scaling = new BABYLON.Vector3(100, 100, 1);
            border3.position.y = -5.0;
            border3.position.z = -50.0;
            border3.checkCollisions = true;

            const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
            groundMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            groundMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
            groundMat.backFaceCulling = false;
            ground.material = groundMat;
            border0.material = groundMat;
            border1.material = groundMat;
            border2.material = groundMat;
            border3.material = groundMat;
            ground.receiveShadows = true;

            // Physics
            ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0,
                friction: 0.5,
                restitution: 0.7
            }, scene);
            border0.physicsImpostor = new BABYLON.PhysicsImpostor(border0, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0}, scene);
            border1.physicsImpostor = new BABYLON.PhysicsImpostor(border1, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0}, scene);
            border2.physicsImpostor = new BABYLON.PhysicsImpostor(border2, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0}, scene);
            border3.physicsImpostor = new BABYLON.PhysicsImpostor(border3, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0}, scene);


            // BABYLON.SceneLoader.ImportMesh("", "", "assets/scene.babylon",
            //     scene, function (newMeshes) {
            //         newMeshes.forEach(function (mesh) {
            //
            //         });
            //     }, function (progress) {
            //         console.log("progress: " + (progress.loaded / progress.total * 100) + "%");
            //     });

            return scene;
        };

        const scene = createScene();

        engine.runRenderLoop(function () {
            scene.render();

            UI.setFPS(engine.getFps().toFixed());
        });

        window.addEventListener('resize', function () {
            engine.resize();
        });

    } else {
        alert("Your browser does not support some of the necessary components");
    }

}
