const THREE = require('three')
var OrbitControls = require('three-orbit-controls')(THREE)

// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

var controls = new OrbitControls(camera);

var mouse = new THREE.Vector2();

var raycaster = new THREE.Raycaster();
// raycaster.set(camera.getWorldPosition(), camera.getWorldDirection());
// raycaster.setFromCamera(new THREE.Vector3(0, 0, 0), camera);
// raycaster.linePrecision = 1;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize(window.innerWidth, window.innerHeight);

// Append Renderer to DOM
document.body.appendChild(renderer.domElement);

function onMouseMove(event) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

var lineMaterial = new THREE.LineBasicMaterial({ color: "#ff0000" });
var linesMaterial = new THREE.LineBasicMaterial({ color: "#00ff00" });

var segments = 10;
var radius1 = .8;
var circleGeometry1 = new THREE.CircleGeometry(radius1, segments);
// Remove center vertex
circleGeometry1.vertices.shift();
var lineLoop1 = new THREE.LineLoop(circleGeometry1, lineMaterial);
var radius2 = .7;
var circleGeometry2 = new THREE.CircleGeometry(radius2, segments);
// Remove center vertex
circleGeometry2.vertices.shift();
var lineLoop2 = new THREE.LineLoop(circleGeometry2, lineMaterial);

var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
var cubeMaterial = new THREE.MeshBasicMaterial({ color: "#433F81", wireframe: true });
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.name = "cube";

var sphereGeometry = new THREE.SphereGeometry(.2, 4, 4);
var sphereMaterial = new THREE.MeshBasicMaterial({ color: "#433Fff", wireframe: false });
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.name = "sphere";

// Add cube to Scene
scene.add(cube);
// scene.add(lineLoop1);
// scene.add(lineLoop2);
scene.add(sphere);

// sphere.position.x = 4;
sphere.position.z = -2;
// sphere.doubleSided = false;

lineLoop1.rotation.x = lineLoop2.rotation.x = Math.PI / 2;
lineLoop2.position.y = .1;
lineLoop1.rotation.z = lineLoop2.rotation.z = Math.PI / 4;

// cube.rotation.x = 0.3;
// cube.rotation.y = 0.3;

window.addEventListener('mousemove', onMouseMove, false);

// raycaster.set(camera.position, (cube.position.clone()).sub(camera.position).normalize());

// raycaster.set(camera.position, direction);

var linesGroup = new THREE.Group();
scene.add(linesGroup);

// lineLoop1.geometry.vertices.forEach((vertex, index) => {
//     var nextVertex = lineLoop1.geometry.vertices[(index + 1) % lineLoop1.geometry.vertices.length];
//     var lineGeometry = new THREE.Geometry();
//     lineGeometry.vertices.push(vertex);
//     lineGeometry.vertices.push(nextVertex);
//     var line = new THREE.Line(lineGeometry, linesMaterial);
//     line.name = "lineGeometry-" + index;
//     linesGroup.add(line);
// });

lineLoop1.geometry.vertices.forEach((vertex, index) => {
    var nextIndex = (index + 1) % lineLoop1.geometry.vertices.length;
    //compute the middle point of the line
    var start = lineLoop1.geometry.vertices[index];
    var end = lineLoop1.geometry.vertices[nextIndex];
    var middle = end.clone().sub(start).multiplyScalar(0.5).add(start);
    var cubeGeometry = new THREE.BoxGeometry(.1, .1, .1);
    var cubeMaterial = new THREE.MeshBasicMaterial({ color: "#00ff00", wireframe: true });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.name = "cubeGeometry-" + index;
    cube.position.x = middle.x;
    cube.position.y = middle.y;
    cube.rotation.z = index / segments * 360 * 0.0174533 + 90;
    linesGroup.add(cube);
});

linesGroup.rotation.x = Math.PI / 2;
// linesGroup.rotation.y = Math.PI / 2;
linesGroup.rotation.z = Math.PI / 4;
scene.updateMatrixWorld();

linesGroup.children.forEach((line, index) => {
    // var line = linesGroup.children[0];

    // Draw a line from pointA in the given direction at distance 100
    var pointA = camera.position.clone();
    var direction = new THREE.Vector3(0, 0, -10);
    direction.normalize();
    // var distance = 100; // at what distance to determine pointB
    var pointB = new THREE.Vector3();
    line.getWorldPosition(pointB);
    // pointB.addVectors(pointA, direction.multiplyScalar(distance));

    // var start = line.geometry.vertices[0];
    // var end = line.geometry.vertices[1];
    // var middle = end.clone().sub(start).multiplyScalar(0.5).add(start);
    // var pointA = camera.position.clone();
    // var pointB = new THREE.Vector3();
    // line.getWorldPosition(pointB);
    // var pointB = pointB.add(pointB);

    var geometry = new THREE.Geometry();
    geometry.vertices.push(pointA);
    geometry.vertices.push(pointB);
    var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    var raycastLine = new THREE.Line(geometry, material);
    // scene.add(raycastLine);
});


var cameraInitialPosition = camera.position.clone();

// Render Loop
var render = function () {
    requestAnimationFrame(render);

    // line.rotation.x += 0.05;

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    controls.update();

    // raycaster.setFromCamera(mouse, camera);
    // raycaster.set(camera.position, (cube.position.clone()).sub(camera.position).normalize());

    // var intersects = raycaster.intersectObjects([cube]);
    // var intersects = raycaster.intersectObjects([cube, sphere]);
    // console.log("intersnects " + intersects.length);

    // var objectsToCheckVisibility = [sphere];
    var objectsToCheckVisibility = linesGroup.children;
    objectsToCheckVisibility.forEach((check, index) => {
        // check.visible = true;


        //compute the middle point of the line
        // var start = check.geometry.vertices[0];
        // var end = check.geometry.vertices[1];
        // var middle = end.clone().sub(start).multiplyScalar(0.5).add(start);
        // var middle = end.clone().sub(start).multiplyScalar(0.5).add(start);

        // var origin = check.position.clone().transformDirection(check.matrixWorld);

        var pointB = new THREE.Vector3();
        check.getWorldPosition(pointB);

        raycaster.set(camera.position, (pointB).sub(camera.position.clone()).normalize());
        // raycaster.set(camera.position, (origin).sub(camera.position).normalize());
        // raycaster.set(cameraInitialPosition, (check.position.clone()).sub(cameraInitialPosition).normalize());
        // raycaster.set(cameraInitialPosition, (middle).sub(cameraInitialPosition).normalize());
        var intersects = raycaster.intersectObjects([cube, check]);
        var visible = true;
        if (intersects.length > 0) {
            visible = (intersects[0].object == check);
            // check.position.y += 0.1;
            // check.material.color.set(visible ? 0xff0000 : 0x0000ff);
            // console.log("check " + check.name + " first? " + intersects[0].object.name);
            // console.log(intersects.length);
        }
        check.visible = visible;
        // console.log("check " + check.name + " visible? " + visible);

        // if (index == 0) {
        //     check.visible = true;
        // }
        // else {
        //     check.visible = false;
        // }
    });



    // sphere.material.color.set("#00ff00");
    // cube.material.color.set("#00ff00");

    // for (var i = 0; i < intersects.length; i++) {

    //     intersects[i].object.material.color.set(0xff0000);
    //     console.log(intersects[i].object.name);

    // }


    // if (intersects.length == 0) {
    // sphere.position.x += .001;
    // }

    // Render the scene
    renderer.render(scene, camera);
};

render();