document.addEventListener('DOMContentLoaded', () => {
    const container = document.body;
    const introText = document.getElementById('intro-text');
    const mindfulnessText = document.getElementById('mindfulness-text');
    const endText = document.getElementById('end-text');
    const overlay = document.querySelector('.overlay');
    const enterVRButton = document.getElementById('enter-vr');
    
    const mindfulnessMessages = [
        { text: "Think about who you will probably see next. Imagine bringing kindness to this interaction.", end: "Bring kindness to all your upcoming interactions" },
        { text: "Reflect on one thing you’re grateful for and think about why you appreciate it so much.", end: "Carry gratitude with you throughout the day." },
        { text: "Recall a time recently when you felt a sense of calm. Bring that feeling into this moment.", end: "Hold onto this calmness as you go about your day." }
    ];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    const uniforms = {
        time: { value: 1.0 }
    };
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec2 vUv;
            void main() {
                vec2 p = -1.0 + 2.0 * vUv;
                float len = length(p);
                vec3 color = vec3(0.5 + 0.5*cos(time+len*2.0+vec3(0,2,4)), 0.5 + 0.5*cos(time+len*2.0+vec3(2,4,0)), 0.5 + 0.5*cos(time+len*2.0+vec3(4,0,2)));
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        side: THREE.BackSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.set(0, 0, 0);

    function animate() {
        uniforms.time.value += 0.05;
        renderer.setAnimationLoop(render);
    }

    function render() {
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    enterVRButton.addEventListener('click', () => {
        introText.classList.add('hidden');
        overlay.style.display = 'none';
        displayMindfulnessText();
    });

    function displayMindfulnessText() {
        const randomMessage = mindfulnessMessages[Math.floor(Math.random() * mindfulnessMessages.length)];
        mindfulnessText.textContent = randomMessage.text;
        endText.textContent = randomMessage.end;

        mindfulnessText.classList.remove('hidden');
        setTimeout(() => {
            mindfulnessText.classList.add('hidden');
            endText.classList.remove('hidden');
            setTimeout(() => {
                endText.classList.add('hidden');
                introText.classList.remove('hidden');
                overlay.style.display = 'block';
            }, 30000); // Show end text for 30 seconds
        }, 20000); // Show mindfulness text for 20 seconds
    }
});
