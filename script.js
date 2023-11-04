let startValuesElectric;
let co2EmissionsElectric;
let startValuePetrol;
let co2EmissionsPetrol;
let carType = "kleinwagen";
let resetValues;
let carTypeElement;
let emissionValues;


$(document).ready(function () {
  $('.car-type').click(function () {
    const Type2 = this.id;
    updateCarType(Type2);
  });
  
      $("#mileageSlider").slider({
        range: "max",
        min: 0,
        max: 50000,
        value: 15000,
        step: 500,
        slide: function (event, ui) {
          $("#mileage").val(ui.value);
          updateChart(carType);
        }
      });
      $("#mileage").val($("#mileageSlider").slider("value"));

      $("#fuelConsumptionSlider").slider({
        range: "max",
        min: 0,
        max: 20,
        value: 6,
        step: 0.1,
        slide: function (event, ui) {
          $("#fuelConsumption").val(ui.value);
          updateChart(carType);
        }
      });
      $("#fuelConsumption").val($("#fuelConsumptionSlider").slider("value"));

      $("#electricityConsumptionSlider").slider({
        range: "max",
        min: 0,
        max: 50,
        value: 15,
        step: 0.1,
        slide: function (event, ui) {
          $("#electricityConsumptionValue").val(ui.value);
          updateChart(carType);
        }
      });
      $("#electricityConsumption").val($("#electricityConsumptionSlider").slider("value"));

      $("#electricityEmissionSlider").slider({
        range: "max",
        min: 25,
        max: 800,
        value: 100,
        step: 5,
        slide: function (event, ui) {
          $("#electricityEmissionValue").val(ui.value);
          updateChart(carType);
        }
      });
      $("#lectricityEmission").val($("#lectricityEmissionSlider").slider("value"));
  

      function calculateEmissions(mileage, fuelConsumption, electricityConsumption, electricityEmission) {
        co2EmissionsPetrol = (mileage / 100) * fuelConsumption * 2.37;
        co2EmissionsElectric = (mileage / 100) * electricityConsumption * (electricityEmission / 1000);
        return [co2EmissionsPetrol, co2EmissionsElectric];
      }

      function updateChart(carType) {
        const mileage = $("#mileageSlider").slider("value");
        const fuelConsumption = $("#fuelConsumptionSlider").slider("value");
        const electricityConsumption = $("#electricityConsumptionSlider").slider("value");
        const electricityEmission = $("#electricityEmissionSlider").slider("value");

        
        resetValues = {
            kleinwagen: { mileage: 10500, fuelConsumption: 5.5, electricityConsumption: 13.2, electricityEmission: 350 },
            kombi: { mileage: 11500, fuelConsumption: 6.8, electricityConsumption: 15.5, electricityEmission: 350 },
            suv: { mileage: 13500, fuelConsumption: 8.4, electricityConsumption: 19.1, electricityEmission: 350 },
        };

        startValuesElectric = {
            kleinwagen: 8500,
            kombi: 12800,
            suv: 15400
        };
        startValuesPetrol = {
            kleinwagen: 5500,
            kombi: 7800,
            suv: 9400
        };

        function findIntersection(m1, b1, m2, b2) {
            if (m1 === m2) {
                return null;

            } else {
                x = (b2 - b1) / (m1 - m2);
             y = m1 * x + b1;
            return { x, y };
            }
            
        }

    function displayIntersection() {
      const m1 = co2EmissionsElectric;
      const b1 = startValuesElectric[carType];
      const m2 = co2EmissionsPetrol;
      const b2 = startValuesPetrol[carType];

      const intersection = findIntersection(m1, b1, m2, b2);

      if (intersection === null || intersection.x < 0) {
    $('#intersectionResult').text('In diesem seltenen Ausnahmefall ist ein Elektroauto nicht effizienter als ein Verbrenner.');
  } else if (typeof intersection === 'object') {
    const years = Math.floor(intersection.x);
    const months = Math.round((intersection.x - years) * 12 + 0,1);
    if (months < 0) {
      $('#intersectionResult').text('In diesem seltenen Ausnahmefall ist ein Elektroauto nicht effizienter.');
    } else {
      const yearText = years === 1 ? 'einem Jahr' : `${years} Jahren`;
      const monthText = months === 1 ? 'einem Monat' : `${months} Monaten`;
      $('#intersectionResult').text(`Nach ca. ${yearText} und ${monthText} hat ein Elektroauto einen geringeren CO2-Fußabdruck als ein Verbrenner.`);
    }
  }}  
      const startValuePetrol = startValuesPetrol[carType];
      const startValueElectric = startValuesElectric[carType];
      const dataPetrol = [startValuePetrol];
      const dataElectric = [startValueElectric];
        for (let i = 1; i <= 20; i++) {
          const [emissionsPetrol, emissionsElectric] = calculateEmissions(mileage, fuelConsumption, electricityConsumption, electricityEmission);
          dataPetrol.push(dataPetrol[i - 1] + emissionsPetrol);
          dataElectric.push(dataElectric[i - 1] + emissionsElectric);
        }

        chart.data.datasets[0].data = dataPetrol;
        chart.data.datasets[1].data = dataElectric;
        chart.update();
        displayIntersection();
      }

      const ctx = document.getElementById('chart').getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: 21 }, (_, i) => i),
          datasets: [{
            label: 'Benziner',
            borderColor: 'rgb(255, 99, 132)',
            data: [],
          }, {
            label: 'Elektroauto',
            borderColor: 'rgb(75, 192, 192)',
            data: [],
          }]
        },
        options: {
        maintainAspectRatio: false,
        animation: true,
            scales: {
                x: {
                    grid: {
          color: '#1e1e1e',
        },
        ticks: {
          color: '#fff',
        },
                title: {
                    display: true,
                    text: 'Jahre',
                    color: '#fff',
                }
                },
                y: {
                    grid: {
          color: '#1e1e1e',
        },
        ticks: {
          color: '#fff',
        },
                min: 0,
                title: {
                    display: true,
                    color: '#fff',
                    text: 'CO2 Emissionen (kg)'
                }
                }
            }
            }
      });
      
      function updateCarType(Type2) {
         carTypeElement = $(`#${Type2}`);
  const background = $('.sliding-background');
  const offset = carTypeElement.position().left;
  
  background.css('transform', `translateX(${offset}px)`);

  const values = resetValues[Type2];
  emissionValues = values.electricityEmission
  $('#mileageSlider').slider('value', values.mileage);
  $('#mileageValue').text(values.mileage);

  $('#fuelConsumption').val(values.fuelConsumption);
  $('#fuelConsumptionValue').text(values.fuelConsumption);
  $('#fuelConsumptionSlider').slider('value', values.fuelConsumption);


  $('#electricityConsumptionValue').val(values.electricityConsumption)
  $('#electricityConsumptionSlider').slider('value', values.electricityConsumption);

  $('.car-type').removeClass('selected');
  carTypeElement.addClass('selected');
        carType = Type2
        updateChart(carType);
}

setInterval(() => {
  updateChart(carType);
}, 250);


updateChart(carType);
updateCarType(carType);

$('#electricityEmissionValue').val(emissionValues)
  $('#electricityEmissionSlider').slider('value', emissionValues);



      $('#intersectionResult').text('');
    $('<div>').attr('id', 'intersectionResult').insertAfter('.slider-container:last'); 
    
});