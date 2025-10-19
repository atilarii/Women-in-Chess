// --- Vega specs for multiple visualisations ---
let mapView, scatterView; // save views for later use

const specs = [
  {id: "#map", url: "chess_map.vg.json"},
  {id: "#scatter", url: "chess_scatter.vg.json"},
  {id: "#pyramid", url: "chess_pyramid.vg.json"},
  {id: "#titles", url: "chess_titles.vg.json"}
];

// Embed all specs
specs.forEach(s => {
  vegaEmbed(s.id, s.url, {actions:false, renderer:"canvas"})
    .then(res => {
      if (s.id === "#map") mapView = res.view; // save map view
      if (s.id === "#scatter") scatterView = res.view; // save scatter view
    })
    .catch(err => console.error(err));
});

// controls
const colorSelect = document.getElementById("map-color");
const showCheckbox = document.getElementById("show-centroids");

// wire up events
colorSelect.addEventListener("change", async (e) => {
  const metric = e.target.value;
  console.log("Dropdown selected metric:", metric);

  if (!mapView) return;

  // update Vega signal
  await mapView.signal("colorField", metric).runAsync();

  // rebuild toplist
  buildToplist();
});

async function setMapParam(name, value) {
  if (!mapView) return;
  await mapView.signal(name, value).runAsync();
  // runAsync() above pushes the compiled Vega signals and updates the view
}

showCheckbox.addEventListener("change", async (e) => {
  await setMapParam("showCentroids", e.target.checked);
});

// Example: highlight countries in scatter plot
async function highlightScatterCountries(countries) {
  if (!scatterView) return;
  await scatterView.signal("highlightCountries", countries).runAsync();
}

// call the function once after scatter is embedded
// use setTimeout or wait for the embed to finish
setTimeout(() => {
  highlightScatterCountries(["Russia", "India", "USA", "China", "Germany"]);
}, 500);

async function updateScatter() {
  
  const metric = selectMetric.value;

  // set color field
  await scatterView.signal("colorField", metric).runAsync();

  // top5 highlights
  const topMetric = toggleTop5Metric.checked ? getTop5(metric) : [];
  const topTitles = toggleTop5Titles.checked ? getTop5("total_titled") : [];
  const allHighlighted = Array.from(new Set([...topMetric, ...topTitles]));

  await scatterView.signal("highlightCountries", allHighlighted).runAsync();
}
