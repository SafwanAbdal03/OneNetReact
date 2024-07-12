// Function to fetch data and display the image
function fetchDataAndDisplayImage() {
  const errorMessage = document.createElement('p');
  errorMessage.style.color = 'red';
  document.body.appendChild(errorMessage);

  const fetchedImage = document.createElement('img');
  fetchedImage.style.display = 'none';
  document.body.appendChild(fetchedImage);

  fetch('http://localhost:8080/api/data')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.errno === 0) {
        const combinedBase64 = data.data.datastreams
          .map(stream => stream.datapoints)
          .flat()
          .sort((a, b) => new Date(b.at) - new Date(a.at)) // Sort by timestamp
          .map(datapoint => datapoint.value)
          .join('');
        fetchedImage.src = `data:image/jpeg;base64,${combinedBase64}`;
        fetchedImage.style.display = 'block';
      } else {
        errorMessage.textContent = 'Failed to load data';
      }
    })
    .catch(error => {
      console.error('Detailed error:', error);
      errorMessage.textContent = `Error fetching data: ${error.message}`;
    });
}

// Run the function to fetch data and display the image
fetchDataAndDisplayImage();
