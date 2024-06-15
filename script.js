document.addEventListener('DOMContentLoaded', () => {
    const introText = document.getElementById('intro-text');
    const mindfulnessText = document.getElementById('mindfulness-text');
    const endText = document.getElementById('end-text');
    const vrButton = document.getElementById('vr-button');
    let xrSession = null;
    let xrRefSpace = null;

    const mindfulnessMessages = [
        { text: "Think about who you will probably see next. Imagine bringing kindness to this interaction.", end: "Bring kindness to all your upcoming interactions" },
        { text: "Reflect on one thing you’re grateful for and think about why you appreciate it so much.", end: "Carry gratitude with you throughout the day." },
        { text: "Recall a time recently when you felt a sense of calm. Bring that feeling into this moment.", end: "Hold onto this calmness as you go about your day." }
    ];

    // WebXR setup
    async function initXR() {
        if (navigator.xr) {
            try {
                xrSession = await navigator.xr.requestSession('immersive-vr');
                onSessionStarted(xrSession);
            } catch (e) {
                console.error('Failed to create XR session', e);
            }
        } else {
            console.error('WebXR not supported');
        }
    }

    function onSessionStarted(session) {
        session.addEventListener('end', onSessionEnded);

        const gl = document.createElement('canvas').getContext('webgl');
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) });

        session.requestReferenceSpace('local').then((refSpace) => {
            xrRefSpace = refSpace;
            session.requestAnimationFrame(onXRFrame);
        });
    }

    function onXRFrame(time, frame) {
        const session = frame.session;
        session.requestAnimationFrame(onXRFrame);

        const pose = frame.getViewerPose(xrRefSpace);
        if (pose) {
            // Render the scene here
        }
    }

    function onSessionEnded() {
        xrSession = null;
    }

    // VR Button event listener
    vrButton.addEventListener('click', () => {
        if (!xrSession) {
            initXR();
        } else {
            xrSession.end();
        }
    });

    // Function to set random gradient background
    function setRandomBackground() {
        const warmColors = '89ABCDEF';
        const coolColors = '01234567';
        const color1 = getRandomColor(warmColors);
        const color2 = getRandomColor(coolColors);
        document.querySelector('.lava-lamp-background').style.background = `linear-gradient(45deg, ${color1}, ${color2})`;
    }

    function getRandomColor(range) {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += range[Math.floor(Math.random() * range.length)];
        }
        return color;
    }

    // Initial setup
    setRandomBackground();
    const randomMessage = mindfulnessMessages[Math.floor(Math.random() * mindfulnessMessages.length)];
    mindfulnessText.textContent = randomMessage.text;
    endText.textContent = randomMessage.end;

    introText.addEventListener('click', () => {
        introText.classList.add('hidden');
        mindfulnessText.classList.remove('hidden');
        setTimeout(() => {
            mindfulnessText.classList.add('hidden');
            endText.classList.remove('hidden');
            setTimeout(() => {
                endText.classList.add('hidden');
                introText.classList.remove('hidden');
                setRandomBackground();
                const newRandomMessage = mindfulnessMessages[Math.floor(Math.random() * mindfulnessMessages.length)];
                mindfulnessText.textContent = newRandomMessage.text;
                endText.textContent = newRandomMessage.end;
            }, 30000);
        }, 20000);
    });
});
