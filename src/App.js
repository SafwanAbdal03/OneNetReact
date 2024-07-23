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

  fetch(`https://one-net-react.vercel.app/api/data?api=${apiKey}&device=${deviceId}`)
    .then(response => response.json())
    .then(data => {
      console.log("Data fetched:", data);
      if (data.errno === 0) {
        const datastreams = data.data.datastreams;
        const allowedIds = ['3200_0_5750', '3200_1_5750', '3200_2_5750'];

        // Filter the datastreams to only include the ones with allowed IDs
        const filteredDatastreams = datastreams.filter(stream => allowedIds.includes(stream.id));
        
        // Extract base64 values from the filtered datastreams
        const base64Values = filteredDatastreams.map(stream => stream.datapoints[0].value);
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

