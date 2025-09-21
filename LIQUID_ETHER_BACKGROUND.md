# Liquid Ether Background Component

A customizable, animated liquid background component for React/Next.js applications, perfect for health monitoring and modern web applications.

## Features

- **Interactive liquid blobs** that respond to mouse movement
- **Multiple color themes** (Health, Ocean, Forest, Sunset)
- **Customizable colors** and animations
- **Particle effects** for added visual appeal
- **Connection lines** between nearby blobs
- **Pulse animations** for organic movement
- **Performance optimized** with canvas rendering
- **Responsive design** that adapts to screen size

## Installation

### Prerequisites
- React 18+ or Next.js 13+
- TypeScript (recommended)
- Modern browser with Canvas API support

### Install Dependencies
```bash
npm install lucide-react
# or
yarn add lucide-react
```

## Components

### 1. Basic Liquid Ether Background

```typescript
import LiquidEtherBackground from '@/components/LiquidEtherBackground';

// Basic usage
<LiquidEtherBackground />

// With custom colors
<LiquidEtherBackground
  colors={{
    primary: "rgba(59, 130, 246, 0.1)",
    secondary: "rgba(147, 197, 253, 0.08)",
    tertiary: "rgba(37, 99, 235, 0.06)"
  }}
  opacity={0.8}
  animationSpeed={1.2}
  blobCount={6}
  interactive={true}
/>
```

### 2. Enhanced Liquid Ether Background

```typescript
import LiquidEtherBackgroundEnhanced from '@/components/LiquidEtherBackgroundEnhanced';

// With health theme (perfect for medical/health apps)
<LiquidEtherBackgroundEnhanced
  theme="health"
  intensity="medium"
  animationSpeed={0.8}
  blobCount={6}
  interactive={true}
  showConnections={true}
  pulseEffect={true}
  particleCount={15}
/>

// Custom theme
<LiquidEtherBackgroundEnhanced
  theme="custom"
  customColors={{
    primary: "rgba(59, 130, 246, 0.12)",
    secondary: "rgba(147, 197, 253, 0.08)",
    tertiary: "rgba(37, 99, 235, 0.06)",
    accent: "rgba(6, 182, 212, 0.1)"
  }}
  intensity="strong"
  animationSpeed={1.5}
  blobCount={8}
/>
```

## Props Reference

### LiquidEtherBackground Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `colors` | `object` | Health theme colors | Custom color configuration |
| `opacity` | `number` | `0.8` | Background opacity (0-1) |
| `animationSpeed` | `number` | `1` | Animation speed multiplier |
| `blobCount` | `number` | `5` | Number of liquid blobs |
| `interactive` | `boolean` | `true` | Enable mouse interaction |

### LiquidEtherBackgroundEnhanced Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `theme` | `'health' \| 'ocean' \| 'forest' \| 'sunset' \| 'custom'` | `'health'` | Predefined color theme |
| `customColors` | `object` | - | Custom colors when theme is 'custom' |
| `intensity` | `'subtle' \| 'medium' \| 'strong'` | `'medium'` | Visual intensity level |
| `animationSpeed` | `number` | `1` | Animation speed multiplier |
| `blobCount` | `number` | `5` | Number of liquid blobs |
| `interactive` | `boolean` | `true` | Enable mouse interaction |
| `showConnections` | `boolean` | `true` | Show connection lines between blobs |
| `pulseEffect` | `boolean` | `true` | Enable pulsing animation |
| `particleCount` | `number` | `20` | Number of floating particles |

## Color Themes

### Health Theme (Default)
Perfect for medical and health monitoring applications:
- **Primary**: Amber (`rgba(245, 158, 11, 0.12)`)
- **Secondary**: Light Amber (`rgba(251, 191, 36, 0.08)`)
- **Tertiary**: Dark Amber (`rgba(217, 119, 6, 0.06)`)
- **Accent**: Green (`rgba(34, 197, 94, 0.1)`)

### Ocean Theme
Calming blue tones for wellness and meditation apps:
- **Primary**: Blue (`rgba(59, 130, 246, 0.12)`)
- **Secondary**: Light Blue (`rgba(147, 197, 253, 0.08)`)
- **Tertiary**: Dark Blue (`rgba(37, 99, 235, 0.06)`)
- **Accent**: Cyan (`rgba(6, 182, 212, 0.1)`)

### Forest Theme
Natural greens for eco-friendly and organic applications:
- **Primary**: Green (`rgba(34, 197, 94, 0.12)`)
- **Secondary**: Light Green (`rgba(134, 239, 172, 0.08)`)
- **Tertiary**: Dark Green (`rgba(21, 128, 61, 0.06)`)
- **Accent**: Olive (`rgba(101, 163, 13, 0.1)`)

### Sunset Theme
Warm oranges and reds for energetic applications:
- **Primary**: Red (`rgba(239, 68, 68, 0.12)`)
- **Secondary**: Orange (`rgba(251, 146, 60, 0.08)`)
- **Tertiary**: Amber (`rgba(245, 158, 11, 0.06)`)
- **Accent**: Purple (`rgba(168, 85, 247, 0.1)`)

## Integration Examples

### Full Page Background
```typescript
// layout.tsx
import LiquidEtherBackgroundEnhanced from '@/components/LiquidEtherBackgroundEnhanced';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <div className="relative min-h-screen">
          <LiquidEtherBackgroundEnhanced
            theme="health"
            intensity="medium"
            interactive={true}
          />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
```

### Hero Section Background
```typescript
// page.tsx
export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative h-screen">
        <LiquidEtherBackgroundEnhanced
          theme="ocean"
          intensity="strong"
          className="absolute inset-0"
        />
        <div className="relative z-10">
          {/* Your content */}
        </div>
      </section>
    </div>
  );
}
```

### Modal Background
```typescript
// Modal.tsx
export default function Modal({ isOpen, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <LiquidEtherBackground
        opacity={0.3}
        animationSpeed={0.5}
        className="absolute inset-0"
      />
      <div className="relative z-10">
        {/* Modal content */}
      </div>
    </div>
  );
}
```

## Performance Considerations

### Optimization Tips
1. **Reduce blob count** for better performance on mobile devices
2. **Disable interactions** when not needed
3. **Use appropriate intensity levels** for your use case
4. **Limit particle count** on lower-end devices
5. **Consider CSS-only alternatives** for simple cases

### Browser Compatibility
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile browsers**: Good performance with reduced complexity

### Fallback for Older Browsers
```typescript
// Add fallback for browsers without Canvas API
const [canvasSupported, setCanvasSupported] = useState(true);

useEffect(() => {
  setCanvasSupported(!!document.createElement('canvas').getContext);
}, []);

if (!canvasSupported) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50 to-blue-50" />
  );
}
```

## Customization

### Adding Custom Themes
```typescript
const customTheme = {
  primary: "rgba(168, 85, 247, 0.12)",  // Purple
  secondary: "rgba(196, 181, 253, 0.08)", // Light purple
  tertiary: "rgba(147, 51, 234, 0.06)",   // Dark purple
  accent: "rgba(236, 72, 153, 0.1)"       // Pink
};

<LiquidEtherBackgroundEnhanced
  theme="custom"
  customColors={customTheme}
/>
```

### Advanced Customization
```typescript
// Modify blob behavior
<LiquidEtherBackgroundEnhanced
  animationSpeed={2.0}        // Faster animations
  blobCount={10}              // More blobs
  particleCount={30}          // More particles
  intensity="strong"          // More visible effects
  showConnections={true}      // Show blob connections
  pulseEffect={true}          // Pulsing animation
/>
```

## Troubleshooting

### Common Issues

**Q: The background is not visible**
- Check if the component has proper positioning (absolute/relative)
- Ensure opacity values are appropriate
- Verify z-index stacking

**Q: Performance is poor on mobile**
- Reduce blobCount and particleCount
- Set interactive={false}
- Use intensity="subtle"

**Q: Colors don't match my design**
- Use customColors prop with your brand colors
- Adjust opacity values
- Try different intensity levels

### Debug Mode
Add this prop to see blob boundaries:
```typescript
<LiquidEtherBackgroundEnhanced
  debug={true}  // Shows blob outlines (add this prop to component)
/>
```

## License

MIT License - feel free to use in your projects!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your enhancements
4. Submit a pull request

## Support

For issues and questions, please create an issue in the repository or contact the development team.