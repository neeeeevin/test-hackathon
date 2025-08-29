const permissionButton = document.getElementById('permissionButton');
const orientationDisplay = document.getElementById('orientationDisplay');
const debugInfo = document.getElementById('debugInfo');
const body = document.body;

let lastKnownOrientation = ''; // Variable to hold the last valid state

// This function requests permission for motion sensors on iOS 13+
function requestPermission() {
    if (typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                    permissionButton.style.display = 'none';
                } else {
                    alert('Permission for device orientation was denied.');
                }
            })
            .catch(console.error);
    } else {
        window.addEventListener('deviceorientation', handleOrientation);
        permissionButton.style.display = 'none';
    }
}

permissionButton.addEventListener('click', requestPermission);
body.className = 'default-bg'; // Set a default background

function handleOrientation(event) {
    const beta = event.beta;
    const gamma = event.gamma;
    let currentOrientation = 'Unknown';

    debugInfo.textContent = `Beta: ${beta.toFixed(2)}, Gamma: ${gamma.toFixed(2)}`;

    if (gamma > 45) {
        currentOrientation = 'Landscape (Right)';
    } else if (gamma < -45) {
        currentOrientation = 'Landscape (Left)';
    } else if (beta > 45 && beta < 135) {
        currentOrientation = 'Portrait (Upright)';
    } else if (beta < -45 && beta > -135) {
        currentOrientation = 'Portrait (Upside Down)';
    }

    // --- WOW FACTOR LOGIC ---
    // Only update the display if the orientation is valid AND has changed
    if (currentOrientation !== 'Unknown' && currentOrientation !== lastKnownOrientation) {
        orientationDisplay.textContent = currentOrientation;
        
        // Update background color based on orientation
        if (currentOrientation === 'Portrait (Upright)') body.className = 'upright-bg';
        if (currentOrientation === 'Portrait (Upside Down)') body.className = 'upside-down-bg';
        if (currentOrientation === 'Landscape (Left)') body.className = 'landscape-left-bg';
        if (currentOrientation === 'Landscape (Right)') body.className = 'landscape-right-bg';

        lastKnownOrientation = currentOrientation; // Update the last known state
    }
}
