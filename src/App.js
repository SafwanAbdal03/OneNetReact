document.addEventListener("DOMContentLoaded", function () {
  const errorElement = document.getElementById('error');
  const imageElement = document.getElementById('image');

  fetch('/api/data') // Ensure the correct API path
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
