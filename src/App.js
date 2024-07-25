document.addEventListener("DOMContentLoaded", function () {
  const errorElement = document.getElementById('error');
  const imageContainer = document.getElementById('imageContainer');

  // Get query parameters from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const apiKey = urlParams.get('api');
  const deviceId = urlParams.get('device');

  if (!apiKey || !deviceId) {
    errorElement.textContent = 'API key and device ID are required in the URL query parameters.';
    return;
  }

  const fetchData = () => {
    fetch(`https://one-net-react.vercel.app/api/data?api=${apiKey}&device=${deviceId}`)
      .then(response => {
        console.log('Response received:', response);
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(data => {
        console.log("Data fetched:", data);
        if (data.errno === 0) {
          const datastreams = data.data.datastreams;
          const allowedIds = ['3200_0_5750', '3200_1_5750', '3200_2_5750', '3200_3_5750', '3200_4_5750', '3200_5_5750'];

          // Sort the datastreams to match the order of allowed IDs and limit to 5
          const sortedDatastreams = allowedIds.map(id =>
            datastreams.find(stream => stream.id === id)
          ).filter(stream => stream !== undefined).slice(0, 1); // Filter out any undefined streams

          // Clear the previous images
          imageContainer.innerHTML = '';

          // Extract base64 values from the sorted datastreams and create image elements
          sortedDatastreams.forEach((stream, index) => {
            const base64Value = stream.datapoints[0].value;
            console.log(`Image ${index + 1} base64 data:`, base64Value);
            const imgElement = document.createElement('li');
            imgElement.innerHTML = `<img src="data:image/jpeg;base64,${base64Value}" alt="Image ${index + 1}" uk-cover>`;
            imageContainer.appendChild(imgElement);
          });

          // Refresh the slideshow component to account for the new images
          UIkit.slideshow(imageContainer).show(0);
        } else {
          errorElement.textContent = 'Failed to load data';
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        errorElement.textContent = `Error fetching data: ${error.message}`;
      });
  };

  // Fetch data initially
  fetchData();

  // Fetch data every 20 seconds
  setInterval(fetchData, 20000);
});


