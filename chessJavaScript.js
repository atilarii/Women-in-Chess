const specs = [
  {id: "#map", url: "chess_map.vg.json"},
  {id: "#scatter", url: "chess_scatter.vg.json"},
  {id: "#pyramid", url: "chess_pyramid.vg.json"},
  {id: "#titles", url: "chess_titles.vg.json"}
];

specs.forEach(s=>{
  vegaEmbed(s.id, s.url, {actions:false, renderer:"canvas"})
    .then(res=>{/* optional: res.view for further programmatic control */})
    .catch(err=>console.error(err));
});
