const permissionButton = document.getElementById('permissionButton');
const orientationDisplay = document.getElementById('orientationDisplay');
const debugInfo = document.getElementById('debugInfo');

// This function requests permission for motion sensors on iOS 13+
function requestPermission() {
    if (typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                    permissionButton.style.display = 'none'; // Hide button after permission
                } else {
                    alert('Permission for device orientation was denied.');
                }
            })
            .catch(console.error);
    } else {
        // Handle non-iOS 13+ devices or devices that don't need permission
        window.addEventListener('deviceorientation', handleOrientation);
        permissionButton.style.display = 'none';
    }
}

permissionButton.addEventListener('click', requestPermission);

function handleOrientation(event) {
    // Beta is the front-to-back tilt. Range: [-180, 180]
    // Gamma is the left-to-right tilt. Range: [-90, 90]
    const beta = event.beta;
    const gamma = event.gamma;
    let currentOrientation = 'Unknown';

    // Update debug info
    debugInfo.textContent = `Beta: ${beta.toFixed(2)}, Gamma: ${gamma.toFixed(2)}`;

    // We check landscape first because it's less ambiguous
    if (gamma > 45) {
        currentOrientation = 'Landscape (Right)';
    } else if (gamma < -45) {
        currentOrientation = 'Landscape (Left)';
    }
    // Then we check portrait modes
    else if (beta > 45 && beta < 135) {
        currentOrientation = 'Portrait (Upright)';
    } else if (beta < -45 && beta > -135) {
        currentOrientation = 'Portrait (Upside Down)';
    }

    orientationDisplay.textContent = currentOrientation;
}