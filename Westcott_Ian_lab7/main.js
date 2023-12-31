function chart(data){
  // Specify the dimensions of the chart.
  const width = 600;
  const height = 600;

  var name = document.getElementById('nodename');
  var showorcast = document.getElementById('showorcast');
  var genre = document.getElementById('genre');
  var plot = document.getElementById('plot');
  var datalist = document.getElementById('names');
  var namelist = new Array();
  var nameinput = document.getElementById('name-choice');
  data.nodes.forEach(function(d){
    namelist.push(d.name);
  });
  namelist.sort();
  namelist.forEach(function(d){
    var option = document.createElement('option');
    option.value = d;
    datalist.appendChild(option);
  });

  // Specify the color scale.
  const color = d3.scaleOrdinal(['#45d617', '#2299e1']);

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  const links = data.links.map(d => ({...d}));
  const nodes = data.nodes.map(d => ({...d}));

  // Create a simulation with several forces.
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.name))
      .force("charge", d3.forceManyBody().strength(-20))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

  // Create the SVG container.
  const svg = d3.selectAll('svg')
      .attr("viewBox", [-width*.8, -height*.8, width*(1.6), height*(1.6)]);

  // Add a line for each link, and a circle for each node.
  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", function(d){
        if (d.type == "Actor") {
            return '5'
        } else {
            return '8'
        }
      })
      .attr("fill", d => color(d.type));

    node.on("mouseenter", (evt, d) => {
        link.attr("opacity", "0.3")
            .filter(l => l.source.name === d.name || l.target.name === d.name)
            .attr("opacity", "2");
        node.attr("opacity", "0.3")
            .attr("outline", "none")
            .filter(function(n) {
                if (n.name == d.name) {
                    return true;
                } else {
                    if (d.type == "Actor") {
                        if (n.type == "TV Show") {
                            if (n.cast != null) {
                                return (n.cast.includes(d.name));
                            }
                        }
                    } else {
                        if (n.type == "Actor") {
                            return (n.tvshows.includes(d.name));
                        }
                    }
                    return false;
                }
            })
            .attr("opacity", "1")
            .filter(n => n.name === d.name)
            .attr("outline", "solid black");
        console.log(d);
        name.innerText = d.name
        if (d.type == "Actor"){
            showorcast.innerHTML = "<b>TV Show(s): </b> " + d.tvshows.join(', ');
            plot.innerHTML = "";
            genre.innerHTML = "";
        } else {
            if (d.cast == null) {
                showorcast.innerHTML = "<b>Cast: </b> " + "None";
            } else {
                showorcast.innerHTML = "<b>Cast: </b> " + d.cast;
            }
            plot.innerHTML = "<b>Plot: </b> " + d.description;
            genre.innerHTML = "<b>Genre: </b> " + d.genre;
        }
    });
    /*.on("mouseleave", evt => {
      link.attr("display", "block");
    });*/

    node.append("title")
        .text(d => d.id);

  
  // Set the position attributes of links and nodes each time the simulation ticks.
  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  });

    //Clear only counts for svg? That's what instructions say, otherwise would add click event to full page
    svg.on("click", (evt, d) => {
        node.attr("opacity", "1")
            .attr("outline", "none");
        link.attr("opacity", "1");
        name.innerHTML = "";
        showorcast.innerHTML = "";
        plot.innerHTML = "";
        genre.innerHTML = "";
    });

    nameinput.addEventListener("input", (event) => {
        if (namelist.includes(nameinput.value)) {
            var d = data.nodes.find(x => x.name === nameinput.value);
            link.attr("opacity", "0.3")
            .filter(l => l.source.name === d.name || l.target.name === d.name)
            .attr("opacity", "2");
            node.attr("opacity", "0.3")
            .attr("outline", "none")
            .filter(function(n) {
                if (n.name == d.name) {
                    return true;
                } else {
                    if (d.type == "Actor") {
                        if (n.type == "TV Show") {
                            if (n.cast != null) {
                                return (n.cast.includes(d.name));
                            }
                        }
                    } else {
                        if (n.type == "Actor") {
                            return (n.tvshows.includes(d.name));
                        }
                    }
                    return false;
                }
            })
            .attr("opacity", "1")
            .filter(n => n.name === d.name)
            .attr("outline", "solid black");
        console.log(d);
        name.innerText = d.name
        if (d.type == "Actor"){
            showorcast.innerHTML = "<b>TV Show(s): </b> " + d.tvshows.join(', ');
            plot.innerHTML = "";
            genre.innerHTML = "";
        } else {
            if (d.cast == null) {
                showorcast.innerHTML = "<b>Cast: </b> " + "None";
            } else {
                showorcast.innerHTML = "<b>Cast: </b> " + d.cast;
            }
            plot.innerHTML = "<b>Plot: </b> " + d.description;
            genre.innerHTML = "<b>Genre: </b> " + d.genre;
        }
        }
    });
}

d3.json('netflix.json').then(function(data){
    chart(data);
});