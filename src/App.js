
document.addEventListener("DOMContentLoaded", function () {
  const errorElement = document.getElementById('error');
  const iframe = document.getElementById('image-frame');

  const urlParams = new URLSearchParams(window.location.search);
  const apiKey = urlParams.get('api');
  const deviceId = urlParams.get('device');

  if (!apiKey || !deviceId) {
    errorElement.textContent = 'API key and device ID are required';
    return;
  }

  fetch(`http://localhost:443/api/data?api=${apiKey}&device=${deviceId}`) // Ensure the correct API path
    .then(response => response.json())
    .then(data => {
      console.log("Data fetched:", data);
      if (data.errno === 0) {
        const datastreams = data.data.datastreams;
        const base64Values = datastreams.map(stream => stream.datapoints[0].value);
        const combinedBase64 = base64Values.join(''); // Concatenate the base64 values
        const imageHtml = `<img src="data:image/jpeg;base64,${combinedBase64}" style="width:100%; height:auto;" alt="Fetched from API">`;

        // Set the content of the iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(imageHtml);
        iframeDoc.close();
      } else {
        errorElement.textContent = 'Failed to load data';
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      errorElement.textContent = `Error fetching data: ${error.message}`;
    });
});


