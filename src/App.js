document.addEventListener("DOMContentLoaded", function () {
  const errorElement = document.getElementById('error');
  const imageElement = document.getElementById('image');
  const canvasElement = document.getElementById('upscaledCanvas');

  // Get query parameters from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const apiKey = urlParams.get('api');
  const deviceId = urlParams.get('device');

  if (!apiKey || !deviceId) {
    errorElement.textContent = 'API key and device ID are required in the URL query parameters.';
    return;
  }

  // Initialize Upscaler
  let upscaler;

  // Load the Upscaler script
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/upscaler@1.4.1";
  script.onload = () => {
    upscaler = new Upscaler({
      model: 'x2', // You can change the model to other options like 'x3' or 'x4'
    });
    fetchData();
    setInterval(fetchData, 20000); // Fetch data every 20 seconds
  };
  document.head.appendChild(script);

  const fetchData = () => {
    fetch(`https://one-net-react.vercel.app/api/data?api=${apiKey}&device=${deviceId}`)
      .then(response => response.json())
      .then(data => {
        console.log("Data fetched:", data);
        if (data.errno === 0) {
          const datastreams = data.data.datastreams;
          const allowedIds = ['3200_0_5750', '3200_1_5750', '3200_2_5750', '3200_3_5750', '3200_4_5750'];

          // Sort the datastreams to match the order of allowed IDs
          const sortedDatastreams = allowedIds.map(id =>
            datastreams.find(stream => stream.id === id)
          ).filter(stream => stream !== undefined); // Filter out any undefined streams

          // Extract base64 values from the sorted datastreams
          const base64Values = sortedDatastreams.map(stream => stream.datapoints[0].value);
          const combinedBase64 = base64Values.join(''); // Concatenate the base64 values

          imageElement.src = `data:image/jpeg;base64,${combinedBase64}`;
          imageElement.onload = () => {
            const ctx = canvasElement.getContext('2d');
            canvasElement.width = imageElement.width;
            canvasElement.height = imageElement.height;
            ctx.drawImage(imageElement, 0, 0);

            upscaler.upscale(canvasElement)
              .then(upscaledCanvas => {
                document.getElementById('content').appendChild(upscaledCanvas);
                upscaledCanvas.style.display = 'block';
              })
              .catch(error => {
                console.error('Error upscaling image:', error);
                errorElement.textContent = 'Error upscaling image';
              });
          };
          imageElement.style.display = 'block';
        } else {
          errorElement.textContent = 'Failed to load data';
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        errorElement.textContent = `Error fetching data: ${error.message}`;
      });
  };
});


