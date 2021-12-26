// A bar chart that uses the d3.js library and react.js library
function App() {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    async function getData() {
      const response = await fetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
      );
      const json = await response.json();
      setData(json.data);
    }
    getData();
  }, []);

  return (
    <div className="container-fluid">
      <h1 id="title">US GDP</h1>
      <div class="chart-holder">
        <Chart data={data} width={data.length * 4} height={500} barWidth={4} />
      </div>
    </div>
  );
}

function Chart({ data, width, height, barWidth }) {
  React.useEffect(() => {
    if (data.length) createChart();
  }, [data]);

  const createChart = () => {
    const d = data.map((a) => a[1]);
    const y = data.map((a) => new Date(a[0]));

    const linearScale = d3
      .scaleLinear()
      .domain([0, d3.max(d)])
      .range([0, height]);

    const scaledData = d.map((a) => linearScale(a));

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const xMax = new Date(d3.max(y));
    xMax.setMonth(xMax.getMonth() + 3);
    const xScale = d3
      .scaleTime()
      .domain([d3.min(y), xMax])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(d)])
      .range([height, 0]);

    const svg = d3.select("svg");
    svg
      .selectAll("rect")
      .data(scaledData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", (_d, i) => data[i][0])
      .attr("data-gdp", (_d, i) => d[i])
      .attr("x", (_d, i) => xScale(y[i]))
      .attr("y", (d) => height - d)
      .attr("width", barWidth)
      .attr("height", (d) => d)
      .attr("fill", (_d, i) => (i % 2 ? "#7fbaa8" : "#5b877a"))
      .on("mouseover", (event, value) => {
        const a = scaledData.indexOf(value);
        tooltip
          .style("opacity", 0.8)
          .html(`${data[a][0]}<br>${data[a][1]} Billion`)
          .attr("data-date", data[a][0])
          .style("left", event.clientX + 20 + "px")
          .style("top", event.clientY + 20 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .attr("id", "x-axis")
      .call(d3.axisBottom(xScale));

    svg.append("g").attr("id", "y-axis").call(d3.axisLeft(yScale));
  };
  return (
    <div className="chart">
      <svg width={width} height={height}></svg>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
