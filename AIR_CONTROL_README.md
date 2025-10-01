# Air Control - Hand Gesture Feature

## 🎯 Overview
The Air Control feature allows you to navigate through categories using hand gestures without touching the screen!

## 📱 Mobile Web Support

### Requirements
1. **HTTPS Required** (except localhost)
   - Camera access requires a secure connection (HTTPS) on mobile browsers
   - During development: `http://localhost:3000` works fine
   - For production: Deploy with HTTPS enabled

2. **Camera Permissions**
   - Allow camera access when prompted by your browser
   - On iOS: Settings → Safari → Camera → Allow
   - On Android: Browser Settings → Site Settings → Camera → Allow

3. **Supported Browsers**
   - ✅ Chrome (Android & Desktop)
   - ✅ Safari (iOS & Desktop)
   - ✅ Edge (Android & Desktop)
   - ✅ Firefox (Android & Desktop)

### Mobile-Specific Features
- **Smaller Preview Window**: Camera preview is 128×96px on mobile (vs 320×240px on desktop)
- **Performance Optimization**: Uses lighter AI model on mobile devices
- **Touch-Friendly**: All buttons are sized for easy touch interaction
- **Responsive Layout**: Works in both portrait and landscape modes

## 🚀 How to Use

### Step 1: Activate Air Control
1. Click the **"Air Control"** button (purple button at the top)
2. Allow camera access when prompted
3. Wait for "Air Control Active - Show your hand!" message

### Step 2: Position Your Hand
1. Show your hand to the camera (palm facing camera)
2. Keep hand in frame (visible in bottom-right preview)
3. Wait for "Hand detected! Move up/down to scroll" message

### Step 3: Use Gestures

#### **Swipe Down** (Go to Next Category)
- Move your hand **UPWARD** (toward the top of the screen)
- The page will scroll DOWN to the next category

#### **Swipe Up** (Go to Previous Category)
- Move your hand **DOWNWARD** (toward the bottom)
- The page will scroll UP to the previous category

### Step 4: Stop Air Control
- Click **"Stop Air Control"** button (green button when active)
- Camera will turn off automatically

## 🔧 Troubleshooting

### Issue: "Camera access denied"
**Solution:**
- Check browser permissions
- On mobile: Settings → Browser → Site Permissions → Camera
- Reload the page after granting permission

### Issue: "Hand tracking initialization failed"
**Solution:**
- Check internet connection (MediaPipe loads from CDN)
- Try refreshing the page
- Clear browser cache and reload

### Issue: "Camera is already in use"
**Solution:**
- Close other apps using the camera
- Close other browser tabs with camera access
- Restart your browser

### Issue: Hand not detected
**Solutions:**
- Improve lighting (face a light source)
- Move hand closer to camera
- Show palm clearly to camera
- Ensure camera lens is clean

### Issue: Gestures not working
**Solutions:**
- Move hand more slowly and deliberately
- Move hand vertically (up/down) not horizontally
- Keep hand in frame at all times
- Check console for debug messages (F12 → Console tab)

### Issue: Works on desktop but not mobile
**Solutions:**
- Ensure using HTTPS (not HTTP) on production
- Check mobile browser supports camera API
- Clear browser cache
- Try a different browser

## 🎮 Performance Tips

### For Best Results:
1. **Good Lighting**: Face a window or light source
2. **Stable Hand**: Move slowly and deliberately
3. **Clear Background**: Plain background works best
4. **Camera Quality**: Better camera = better tracking
5. **Browser Performance**: Close other tabs to free up resources

### Mobile-Specific Tips:
1. Use Wi-Fi for faster MediaPipe loading
2. Close background apps for better performance
3. Keep phone cool (hot phones = slower processing)
4. Portrait mode generally works better than landscape

## 🔐 Privacy & Security

- Camera feed is processed **locally** on your device
- No video or images are uploaded to any server
- Hand tracking happens entirely in your browser
- Camera turns off when you stop Air Control
- Works offline after initial MediaPipe model download

## 🌐 Deployment Checklist

When deploying to production:

- [ ] Enable HTTPS on your domain
- [ ] Test camera permissions on iOS Safari
- [ ] Test camera permissions on Android Chrome
- [ ] Verify MediaPipe CDN is accessible
- [ ] Test on 3G/4G networks (not just Wi-Fi)
- [ ] Add camera permission explanation before requesting
- [ ] Test with both front and back cameras
- [ ] Verify responsive design on various screen sizes

## 📊 Debug Mode

To see detailed logs:
1. Open Browser Console (F12 → Console)
2. Click "Air Control" button
3. Watch for these messages:
   - "Starting air control..."
   - "Camera access granted"
   - "MediaPipe libraries loaded successfully"
   - "Hand tracking fully initialized"
   - "Hand Y: X.XXX Delta: X.XXX"
   - "Gesture detected! Delta: X.XXX"

## 🆘 Still Having Issues?

Check the browser console (F12) for error messages and share them for debugging.

Common console errors:
- `NotAllowedError`: Permission denied
- `NotFoundError`: No camera detected
- `NotReadableError`: Camera in use
- `NetworkError`: Check internet connection

