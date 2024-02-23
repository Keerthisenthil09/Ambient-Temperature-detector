async function fetchLocalTemperature(date) {
  const apiKey = '3mHzKPsGcMfYh4aIEfdd6osLKv5u6r4a';
  const cityKey = '206671'; // Replace with your city's AccuWeather location key
  const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${cityKey}?apikey=${apiKey}&metric=true`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      return data.map(entry => entry.Temperature.Value); // Extract local temperature values
  } catch (error) {
      console.error('Error fetching local temperature:', error);
      return [];
  }
}

async function fetchBatteryTemperature(date) {
  // Simulated battery temperature data for demonstration
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * (40 - 20 + 1) + 20)); // Simulated battery temperature data
}

function plotGraph() {
  const selectedDay = document.getElementById('day').value;
  const selectedTime = document.getElementById('time').value;

  Promise.all([fetchLocalTemperature(selectedDay), fetchBatteryTemperature(selectedDay)])
      .then(([localTemperatureData, batteryTemperatureData]) => {
          const timeIntervals = Array.from({ length: 12 }, (_, index) => {
              const hour = index + 1;
              return `${hour < 10 ? '0' + hour : hour}:00`;
          });

          const existingChart = Chart.getChart('temperature-chart');
          if (existingChart) {
              existingChart.destroy();
          }

          const ctx = document.getElementById('temperature-chart').getContext('2d');
          const myChart = new Chart(ctx, {
              type: 'line',
              data: {
                  labels: timeIntervals,
                  datasets: [
                      {
                          label: 'Local Temperature (°C)',
                          data: localTemperatureData,
                          borderColor: 'blue',
                          borderWidth: 2,
                          fill: false
                      },
                      {
                          label: 'Battery Temperature (°C)',
                          data: batteryTemperatureData,
                          borderColor: 'red',
                          borderWidth: 2,
                          fill: false
                      }
                  ]
              },
              options: {
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  },
                  plugins: {
                      title: {
                          display: true,
                          text: `Local Temperature vs Battery Temperature`
                      }
                  }
              }
          });

          const index = parseInt(selectedTime.substring(0, 2)) - 1;
          const localTemperature = localTemperatureData[index];
          const batteryTemperature = batteryTemperatureData[index];
          const ambientTemperature = (localTemperature + batteryTemperature) / 2;

          document.getElementById('ambient-temperature').textContent = `Ambient Temperature Estimation on ${selectedDay} at ${selectedTime} is ${ambientTemperature.toFixed(2)} °C`;
      });
}
  