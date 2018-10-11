const THREE = require('three')
var OrbitControls = require('three-orbit-controls')(THREE)

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

var controls = new OrbitControls(camera);

var mouse = new THREE.Vector2();

var raycaster = new THREE.Raycaster();
// raycaster.linePrecision = 1;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize(window.innerWidth, window.innerHeight);

// Append Renderer to DOM
document.body.appendChild(renderer.domElement);

var lineMaterial = new THREE.LineBasicMaterial({ color: "#ff0000" });
var linesMaterial = new THREE.LineBasicMaterial({ color: "#ff0000" });

var segments = 100;
var radius1 = .8;
var circleGeometry1 = new THREE.CircleGeometry(radius1, segments);
// Remove center vertex
circleGeometry1.vertices.shift();
var lineLoop1 = new THREE.LineLoop(circleGeometry1, lineMaterial);
// scene.add(lineLoop1);

var linesGroup = new THREE.Group();
scene.add(linesGroup);

var torusGeometry = new THREE.TorusGeometry(10 / 16.5, 3 / 16, 16 / 1, 100 / 4);
var torusMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
var torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);

lineLoop1.rotation.x = Math.PI / 2;
lineLoop1.rotation.z = Math.PI / 4;

torus.rotation.x = Math.PI / 2;
// cube.rotation.x = 0.3;
// cube.rotation.y = 0.3;

lineLoop1.geometry.vertices.forEach((vertex, index) => {
    var nextVertex = lineLoop1.geometry.vertices[(index + 1) % lineLoop1.geometry.vertices.length];
    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(vertex);
    lineGeometry.vertices.push(nextVertex);
    var line = new THREE.Line(lineGeometry, linesMaterial);
    line.name = "lineGeometry-" + index;
    linesGroup.add(line);
});

linesGroup.rotation.x = Math.PI / 2;
// linesGroup.rotation.y = Math.PI / 2;
linesGroup.rotation.z = Math.PI / 4;
scene.updateMatrixWorld();

linesGroup.children.forEach((line, index) => {
    var start = line.geometry.vertices[0].clone();
    var end = line.geometry.vertices[1].clone();
    var middle = end.sub(start).multiplyScalar(0.5).add(start);
    var pointA = camera.position.clone();
    var pointB = line.localToWorld(middle);

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

    controls.update();

    torus.visible = true;
    var objectsToCheckVisibility = linesGroup.children;
    objectsToCheckVisibility.forEach((check, index) => {

        var start = check.geometry.vertices[0].clone();
        var end = check.geometry.vertices[1].clone();
        var middle = end.sub(start).multiplyScalar(0.5).add(start);
        var pointA = camera.position.clone();
        var pointB = check.localToWorld(middle);

        raycaster.set(camera.position, (pointB).sub(camera.position.clone()).normalize());
        var intersects = raycaster.intersectObjects([torus, check]);
        var visible = true;
        if (intersects.length > 0) {
            visible = (intersects[0].object == check);
        }
        check.visible = visible;
    });
    // torus.visible = false;

    // Render the scene
    renderer.render(scene, camera);
};

render();