// Three.js Scene Setup
let scene, camera, renderer, particles, geometryShapes;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Form Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignupBtn = document.getElementById('showSignup');
const showLoginBtn = document.getElementById('showLogin');
const formContainer = document.getElementById('formContainer');
const messageContainer = document.getElementById('messageContainer');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize Three.js Scene
function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('three-canvas'),
        alpha: true,
        antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Camera position
    camera.position.z = 5;
    
    // Create particle system
    createParticles();
    
    // Create floating geometric shapes
    createGeometricShapes();
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x6366f1, 0.6);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x8b5cf6, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Start animation loop
    animate();
}

// Create animated particle system
function createParticles() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Positions
        positions[i3] = (Math.random() - 0.5) * 20;
        positions[i3 + 1] = (Math.random() - 0.5) * 20;
        positions[i3 + 2] = (Math.random() - 0.5) * 20;
        
        // Colors
        const color = new THREE.Color();
        color.setHSL(0.6 + Math.random() * 0.1, 0.8, 0.7);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        // Sizes
        sizes[i] = Math.random() * 3 + 1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 }
        },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            uniform float time;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                
                // Add floating animation
                mvPosition.y += sin(time + position.x * 0.1) * 0.5;
                mvPosition.x += cos(time + position.z * 0.1) * 0.3;
                
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                float distance = length(gl_PointCoord - vec2(0.5));
                if (distance > 0.5) discard;
                
                float alpha = 1.0 - distance * 2.0;
                gl_FragColor = vec4(vColor, alpha * 0.8);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Create floating geometric shapes
function createGeometricShapes() {
    geometryShapes = new THREE.Group();
    
    // Create different geometric shapes
    const shapes = [
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.ConeGeometry(0.3, 0.6, 8),
        new THREE.OctahedronGeometry(0.3),
        new THREE.TetrahedronGeometry(0.4)
    ];
    
    const material = new THREE.MeshPhongMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.3,
        shininess: 100
    });
    
    for (let i = 0; i < 15; i++) {
        const geometry = shapes[Math.floor(Math.random() * shapes.length)];
        const mesh = new THREE.Mesh(geometry, material.clone());
        
        // Random position
        mesh.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 10
        );
        
        // Random rotation
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        // Store initial position for animation
        mesh.userData = {
            initialPosition: mesh.position.clone(),
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: Math.random() * 0.01 + 0.005
        };
        
        geometryShapes.add(mesh);
    }
    
    scene.add(geometryShapes);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Update particles
    if (particles && particles.material.uniforms) {
        particles.material.uniforms.time.value = time;
        particles.rotation.y += 0.001;
    }
    
    // Update geometric shapes
    if (geometryShapes) {
        geometryShapes.children.forEach((mesh, index) => {
            const userData = mesh.userData;
            
            // Rotation animation
            mesh.rotation.x += userData.rotationSpeed.x;
            mesh.rotation.y += userData.rotationSpeed.y;
            mesh.rotation.z += userData.rotationSpeed.z;
            
            // Floating animation
            mesh.position.y = userData.initialPosition.y + Math.sin(time * userData.floatSpeed + index) * 0.5;
            mesh.position.x = userData.initialPosition.x + Math.cos(time * userData.floatSpeed * 0.7 + index) * 0.3;
        });
    }
    
    // Mouse interaction
    camera.position.x += (mouseX * 0.0005 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.0005 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Mouse move handler
function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

// Window resize handler
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Form Animation Functions
function switchToSignup() {
    loginForm.classList.remove('active');
    loginForm.classList.add('fade-out');
    
    setTimeout(() => {
        loginForm.classList.remove('fade-out');
        signupForm.classList.add('active');
        signupForm.classList.add('fade-in');
        
        // Animate form container
        formContainer.style.transform = 'scale(1.05)';
        setTimeout(() => {
            formContainer.style.transform = 'scale(1)';
        }, 300);
        
        // Update 3D scene colors
        updateSceneColors('#8b5cf6');
    }, 300);
}

function switchToLogin() {
    signupForm.classList.remove('active');
    signupForm.classList.remove('fade-in');
    signupForm.classList.add('fade-out');
    
    setTimeout(() => {
        signupForm.classList.remove('fade-out');
        loginForm.classList.add('active');
        loginForm.classList.add('fade-in');
        
        // Animate form container
        formContainer.style.transform = 'scale(1.05)';
        setTimeout(() => {
            formContainer.style.transform = 'scale(1)';
        }, 300);
        
        // Update 3D scene colors
        updateSceneColors('#6366f1');
    }, 300);
}

// Update 3D scene colors based on form
function updateSceneColors(color) {
    if (geometryShapes) {
        geometryShapes.children.forEach(mesh => {
            mesh.material.color.setHex(color.replace('#', '0x'));
        });
    }
}

// Show message function
function showMessage(text, type = 'success') {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type}`;
    messageContainer.classList.add('show');
    
    setTimeout(() => {
        messageContainer.classList.remove('show');
    }, 3000);
}

// Show loading overlay
function showLoading() {
    loadingOverlay.classList.add('show');
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.classList.remove('show');
}

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Validation
    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    if (!validatePassword(password)) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Show loading
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        showMessage('Login successful! Welcome back!', 'success');
        
        // Add success animation to form
        formContainer.classList.add('fade-in');
        
        // Animate 3D scene
        if (particles) {
            particles.material.uniforms.time.value += 10;
        }
    }, 2000);
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!name.trim()) {
        showMessage('Please enter your full name', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    if (!validatePassword(password)) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showMessage('Please agree to the Terms & Conditions', 'error');
        return;
    }
    
    // Show loading
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        showMessage('Account created successfully! Welcome!', 'success');
        
        // Add success animation to form
        formContainer.classList.add('fade-in');
        
        // Animate 3D scene
        if (geometryShapes) {
            geometryShapes.children.forEach(mesh => {
                mesh.userData.rotationSpeed.x *= 2;
                mesh.userData.rotationSpeed.y *= 2;
                mesh.userData.rotationSpeed.z *= 2;
            });
        }
    }, 2500);
}

// Add input focus effects
function addInputEffects() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
            
            // Add subtle 3D effect
            if (geometryShapes) {
                const randomShape = geometryShapes.children[Math.floor(Math.random() * geometryShapes.children.length)];
                randomShape.material.opacity = 0.6;
                setTimeout(() => {
                    randomShape.material.opacity = 0.3;
                }, 500);
            }
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

// Add button hover effects
function addButtonEffects() {
    const buttons = document.querySelectorAll('.submit-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // Animate particles on button hover
            if (particles) {
                particles.material.uniforms.time.value += 0.5;
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js
    initThreeJS();
    
    // Add event listeners
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    
    // Form switching
    showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchToSignup();
    });
    
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchToLogin();
    });
    
    // Form submissions
    loginForm.querySelector('form').addEventListener('submit', handleLogin);
    signupForm.querySelector('form').addEventListener('submit', handleSignup);
    
    // Add input and button effects
    addInputEffects();
    addButtonEffects();
    
    // Initial form animation
    setTimeout(() => {
        formContainer.classList.add('fade-in');
    }, 500);
});

// Prevent context menu on canvas
document.getElementById('three-canvas').addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Add keyboard navigation
document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
        // Add subtle animation when tabbing through form
        if (particles) {
            particles.rotation.y += 0.1;
        }
    }
});

// Performance optimization
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(onWindowResize, 100);
});

// Cleanup function for better performance
window.addEventListener('beforeunload', () => {
    if (renderer) {
        renderer.dispose();
    }
    if (scene) {
        scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
});