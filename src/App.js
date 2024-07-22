document.addEventListener("DOMContentLoaded", function () {
  const errorElement = document.getElementById('error');
  const imageElement = document.getElementById('image');

  // Get query parameters from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const apiKey = urlParams.get('api');
  const deviceId = urlParams.get('device');

  if (!apiKey || !deviceId) {
    errorElement.textContent = 'API key and device ID are required in the URL query parameters.';
    return;
  }

  fetch(`https://api.onenet.hk.chinamobile.com/devices/${deviceId}/datapoints`)
    .then(response => response.json())
    .then(data => {
      console.log("Data fetched:", data);
      if (data.errno === 0) {
        const datastreams = data.data.datastreams;
        const base64Values = datastreams.map(stream => stream.datapoints[0].value);
        const combinedBase64 = base64Values.join(''); // Concatenate the base64 values
        imageElement.src = `data:image/jpeg;base64,${combinedBase64}`;
        imageElement.style.display = 'block';
      } else {
        errorElement.textContent = 'Failed to load data';
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      errorElement.textContent = `Error fetching data: ${error.message}`;
    });
});


