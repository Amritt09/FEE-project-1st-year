# 3D Login & Signup Page

A modern, interactive login and signup page built with Three.js featuring stunning 3D animations and glassmorphism design.

## Features

### 🎨 Visual Design
- **Glassmorphism UI** - Modern frosted glass effect with backdrop blur
- **Gradient Backgrounds** - Beautiful color gradients that complement the 3D elements
- **Responsive Design** - Fully responsive across all device sizes
- **Modern Typography** - Clean, readable fonts with gradient text effects

### 🌟 3D Animations
- **Animated Particle System** - 100+ floating particles with custom shaders
- **Geometric Shapes** - 15 floating 3D shapes (cubes, spheres, cones, etc.)
- **Mouse Interaction** - Camera follows mouse movement for immersive experience
- **Dynamic Lighting** - Ambient and point lighting for realistic 3D effects

### ⚡ Interactive Elements
- **Smooth Form Transitions** - Seamless switching between login and signup forms
- **Input Focus Effects** - Interactive input fields with animated labels
- **Button Animations** - Hover effects with 3D feedback
- **Form Validation** - Real-time validation with visual feedback
- **Loading States** - Animated loading overlay during form submission

### 🎭 Advanced Animations
- **Color-Coded Forms** - 3D elements change color based on active form
- **Success Animations** - Special effects when forms are submitted successfully
- **Floating Elements** - CSS-based floating shapes for additional visual appeal
- **Fade Transitions** - Smooth fade-in/out effects throughout the interface

## File Structure

```
├── login.html          # Main HTML structure
├── login.css           # Styling with glassmorphism and animations
├── login.js            # Three.js scene and form handling
└── login-readme.md     # This documentation file
```

## Usage

1. **Open the Page**: Simply open `login.html` in a modern web browser
2. **Login Form**: 
   - Enter email and password
   - Optional "Remember me" checkbox
   - Form validation ensures proper email format and password length
3. **Signup Form**: 
   - Click "Sign up" to switch to registration
   - Fill in name, email, password, and confirm password
   - Must agree to terms and conditions
4. **Interactive Experience**:
   - Move your mouse to see the 3D camera follow
   - Focus on input fields to see 3D shape highlights
   - Hover over buttons for particle effects

## Technical Details

### Three.js Implementation
- **Scene Setup**: Camera, renderer, and lighting configuration
- **Particle System**: Custom vertex and fragment shaders for animated particles
- **Geometric Shapes**: Various 3D geometries with physics-based animations
- **Performance Optimization**: Efficient rendering with proper cleanup

### Form Features
- **Email Validation**: Regex-based email format checking
- **Password Strength**: Minimum 6 character requirement
- **Real-time Feedback**: Instant validation messages
- **Loading States**: Simulated API calls with loading animations

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: 768px and 480px media queries
- **Touch-Friendly**: Appropriate touch targets and interactions

## Browser Compatibility

- **Chrome/Chromium**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 12+)
- **Edge**: Full support

## Performance Notes

- Optimized particle count for smooth 60fps performance
- Efficient shader materials for GPU acceleration
- Proper memory cleanup to prevent leaks
- Responsive resize handling with debouncing

## Customization

### Colors
Modify the color scheme by updating the CSS custom properties and Three.js material colors:

```css
/* Update gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Update form accent colors */
--primary-color: #6366f1;
--secondary-color: #8b5cf6;
```

### 3D Elements
Adjust particle count and shape complexity in `login.js`:

```javascript
const particleCount = 100; // Reduce for better performance
const shapeCount = 15;     // Number of floating shapes
```

## License

This project is open source and available under the MIT License.