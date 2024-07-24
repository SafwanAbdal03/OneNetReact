document.addEventListener("DOMContentLoaded", function () {
  const errorElement = document.getElementById('error');
  const imageElement = document.getElementById('image');
  const spinnerElement = document.getElementById('spinner');

  // Get query parameters from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const apiKey = urlParams.get('api');
  const deviceId = urlParams.get('device');

  if (!apiKey || !deviceId) {
    errorElement.textContent = 'API key and device ID are required in the URL query parameters.';
    return;
  }

  const fetchData = () => {
    spinnerElement.style.display = 'block'; // Show spinner

    fetch(`https://one-net-react.vercel.app/api/data?api=${apiKey}&device=${deviceId}`)
      .then(response => response.json())
      .then(data => {
        console.log("Data fetched:", data);
        if (data.errno === 0) {
          const datastreams = data.data.datastreams;
          const allowedIds = ['3200_0_5750', '3200_1_5750', '3200_2_5750', '3200_3_5750', '3200_4_5750', '3200_5_5750'];

          // Sort the datastreams to match the order of allowed IDs
          const sortedDatastreams = allowedIds.map(id =>
            datastreams.find(stream => stream.id === id)
          ).filter(stream => stream !== undefined); // Filter out any undefined streams

          // Extract base64 values from the sorted datastreams
          const base64Values = sortedDatastreams.map(stream => stream.datapoints[0].value);
          const combinedBase64 = base64Values.join(''); // Concatenate the base64 values

          imageElement.onload = () => {
            spinnerElement.style.display = 'none'; // Hide spinner
            imageElement.style.display = 'block'; // Show image
          };

          imageElement.src = `data:image/jpeg;base64,${combinedBase64}`;
        } else {
          spinnerElement.style.display = 'none'; // Hide spinner
          errorElement.textContent = 'Failed to load data';
        }
      })
      .catch(error => {
        spinnerElement.style.display = 'none'; // Hide spinner
        console.error('Error fetching data:', error);
        errorElement.textContent = `Error fetching data: ${error.message}`;
      });
  };

  // Fetch data initially
  fetchData();

  // Fetch data every 20 seconds
  setInterval(fetchData, 20000);
});
