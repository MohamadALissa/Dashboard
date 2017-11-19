/*-------------------------------------------------------------------- 
  
– Author:MHD Rateb Alissa
– Date: 17/11/2017
– Overall function of the code: filtered the data and send it to layoutsmanger
– The percentage of code written by the student ‘author’:100%
– The percentage of code taken from course examples:0%  
---------------------------------------------------------------------- */


function dataManagerFiles(data) {

	var dmObj = {}; // main object

	// ---- PRIVATE VARIABLES

	var dataset = data; // dataset array


	//layoutkeys
	var layoutskey1 = "Institution name";
	var layoutskey2 = "Unit of assessment name";
	var layoutskey3 = "Profile";


	// filters
	var filterkey1 = "Scotland";
	var filterkey2 = "Heriot-Watt University";
	var filterkey3 = "Computer Science and Informatics";
	var filterkey5 = "Outputs";

	if (userType == 'research') {
		var filterkey4 = "Scotland";
		var root = "Scotland";
	}
	if (userType == 'management') {
		var filterkey4 = "Heriot-Watt University";
		var root = "Heriot-Watt University";
	}
	if (userType == 'Collaborators') {
		var filterkey4 = "Computer Science and Informatics";
		var root = "Computer Science and Informatics";
	}
	//true means root=country then unis
	//false means root=uni then UOA 
	var treestructure = true;



	dmObj.mapData = function () {
		var countries = dataset.country;

		var unis = d3.nest()
			.key(function (d) { return d["Institution name"]; })
			.rollup(function (values) { return { lon: values[0].lp["LONGITUDE"], lat: values[0].lp["LATITUDE"] } })
			.entries(dataset);

		return { countries: countries, unis: unis };
	}

	//-----------------------Research section-------------------------
	dmObj.pieForReasearch1 = function () {
		var nestedData = d3.nest()
			.key(function (d) { return d[layoutskey1]; })
			// .sortKeys(d3.ascending)
			.rollup(function (values) { return d3.sum(values, function (d) { return d["4*"]; }) })
			.entries(filteredDataResearch(filterkey1));
		return nestedData;
	}
	dmObj.pieForReasearch2 = function () {
		var nestedData = d3.nest()
			.key(function (d) { return d[layoutskey2]; })
			// .sortKeys(d3.ascending)
			.rollup(function (values) { return d3.sum(values, function (d) { return d["4*"]; }) })
			.entries(filteredDataResearch(filterkey2));

		return nestedData;
	}

	dmObj.pieForReasearch3 = function () {
		var nestedData = d3.nest()
			.key(function (d) { return d[layoutskey3]; })
			// .sortKeys(d3.ascending)
			.rollup(function (values) { return d3.sum(values, function (d) { return d["4*"]; }) })
			.entries(filteredDataResearch(filterkey3));
		return nestedData;
	}

	dmObj.barForReasearch = function () {
		var dataforbar = []
		var result = filteredDataResearch(filterkey5)
		if (result.length !== 0) {
			var a = { key: "4*", value: result[0]["4*"] }
			var b = { key: "3*", value: result[0]["3*"] }
			var c = { key: "2*", value: result[0]["2*"] }
			var d = { key: "1*", value: result[0]["1*"] }
			dataforbar = [a, b, c, d]
		}


			return dataforbar;
	}


	dmObj.treeForResearch = function () {
		
		var hierarchyJSON = createJSONhierarchy(filteredDataTree(), root,
			["Institution name", "Unit of assessment name"])
		
		return hierarchyJSON;
	}


	dmObj.packForResearch = function () {
		var hierarchyJSON = createJSONhierarchyForPack(filteredDataTree(), root,
			["Institution name", "Unit of assessment name", "Profile"])
		if (hierarchyJSON.values[0].values.length === 1) {
			var hierarchyJSON = createJSONhierarchyForPack(filteredDataTree(), root,
				["Institution name", "Profile"])
		}

		return hierarchyJSON;
	}




	function createJSONhierarchyForPack(flatDataset, rootKey, keys) {
		var hierarchy = d3.nest();
		keys.forEach(applyKey);

		function applyKey(key, i) {
			hierarchy = hierarchy
				.key(function (d) {
					return d[key];
				});
		}
		hierarchy.rollup(function (values) { return d3.sum(values, function (d) { return d["4*"]; }) })


		hierarchy = hierarchy.entries(flatDataset);
		if (hierarchy.length === 1) {
			return hierarchy[0]
		}
		return { "key": rootKey, "values": hierarchy }
	}



	dmObj.diplaytitle = function (key) {

		document.getElementById("title1").innerText = filterkey1 + "'s universities by " + filterkey5
		document.getElementById("title2").innerText = "UOA for " + filterkey2;
		document.getElementById("title3").innerText = "Profiles of " + filterkey3;
		if (userType == 'research') {
			document.getElementById("title5").innerText = filterkey5 + " for " + filterkey3 + " in " + filterkey2;
			document.getElementById("title8").innerText = "Sankey of FTE of each university of " + filterkey1;
		}
		if (userType == 'management') {
			document.getElementById("title5").innerText = " comparing between universities for " + filterkey3 + " in " + filterkey1;
			document.getElementById("title8").innerText = "Sankey of 4* of each university of  " + filterkey1;

		}
		if (userType == 'Collaborators') {
			document.getElementById("title5").innerText = "Average 4*,3*,2*,1* and FTE for " + filterkey3 + " in " + filterkey1;
			document.getElementById("title8").innerText = "Sankey of 3* of each university of  " + filterkey1;
		}

		document.getElementById("title6").innerText = "Tree of " + filterkey4;

		if (key === undefined)
			document.getElementById("title4").innerText = "Pack for " + filterkey4;
	}




	//interaction of map country
	dmObj.setCountry = function (key) {
		filterkey1 = key;
		filterkey4 = key
		root = key;

	}
	//interaction of map unis and pie 1
	dmObj.setUniversity = function (key) {
		filterkey2 = key;
		filterkey4 = key
		root = key;
	}
	//interaction of pie2
	dmObj.setUOA = function (key) {
		filterkey3 = key;
		filterkey4 = key;
		root = key;
	}
	//interaction of pie3
	dmObj.setProfile = function (key) {
		filterkey5 = key;
	}

	dmObj.drawCircleinMap = function (key) {
		var result = dataset.filter(function (row) {
			return row["Institution name"] == key
		})
		var lon = result[0].lp.LONGITUDE;
		var lat = result[0].lp.LATITUDE;

		return { lon: lon, lat: lat }
	}



	//interaction of tree
	dmObj.setlayoutKey = function (d) {
		//root = country then unis
		if (treestructure === "rootIsCountry") {
			//	console.log("root is country")
			//depth==0 mean the clicked node is root and country
			if (d.depth == 0) {
				filterkey1 = d.data.key;
				filterkey4 = d.data.key;
				root = d.data.key;
			}
			//depth==1 means the clicked node is uni
			else if (d.depth == 1) {
				filterkey2 = d.data.key;
				filterkey4 = d.data.key;
				root = d.data.key;
				map1.drawCircle(d.data.key)
			}
			//clicked node is UOA
			else {
				//	console.log("UOA in normal")
				filterkey3 = d.data.key;
				filterkey4 = d.data.key;
				root = d.data.key;
			}
		}
		//root = uni then UOA
		else if (treestructure === "rootIsUni") {
			//	console.log("root is uni")
			//depth==0 mean the clicked node is root and uni
			if (d.depth == 0) {
				filterkey2 = d.data.key;
				filterkey4 = d.data.key;
				root = d.data.key;
				map1.drawCircle(d.data.key)
			}
			//depth==1 means the clicked node is UOA
			else if (d.depth == 1) {
				//filterkey2 = d.data.key;
				//		console.log("UOA in no normal")
				filterkey3 = d.data.key;
				filterkey4 = d.data.key;
				root = d.data.key;
			}
			//leaf node
			else {
				console.log("leaf node in no normal")
			}
		}
		else if (treestructure === "rootIsUOA") {
			//	console.log("root is UOA")
			//depth==0 mean the clicked node is root and UOA
			if (d.depth == 0) {
				filterkey3 = d.data.key;
				filterkey4 = d.data.key;
				root = d.data.key;
			}
			//depth==1 means the clicked node is uni
			else if (d.depth == 1) {
				filterkey2 = d.data.key;
				filterkey4 = d.data.key;
				root = d.data.key;
				map1.drawCircle(d.data.key)
			}
			//clicked node is UOA
			else {
				//		console.log("UOA in normal")
				filterkey3 = d.data.key;
				filterkey4 = d.data.key;
				root = d.data.key;
			}
		}
	}




	dmObj.underStandTree = function (d) {
		var temp = d;
		if (filterkey1 === temp) {
			treestructure = "rootIsCountry";
		}
		if (filterkey2 === temp) {
			treestructure = "rootIsUni";
		}
		if (filterkey3 === temp) {
				treestructure = "rootIsUOA";
		}
	}

	// function to get data using filters
	function filteredDataResearch(filterkey) {
		var r = dataset.filter(function (row) {
			return (((row["geo"] == filterkey) || row["Institution name"] == filterkey
			)
				&& (row["Profile"] == "Outputs"))
				|| ((row["Unit of assessment name"] == filterkey && row["Institution name"] == filterkey2))
				|| ((row["Profile"] == filterkey) && (row["Unit of assessment name"] == filterkey3 && row["Institution name"] == filterkey2))
		})
		return r
	}

	function filteredDataTree() {
		var f = dataset.filter(function (row) {
			return ((row["geo"] == filterkey4)
				|| (row["Institution name"] == filterkey4)
				|| ((row["Unit of assessment name"] == filterkey4) && (row["geo"] == filterkey1))
				)
		})
		return f
	}




	dmObj.sankeyForResearch = function () {

		var country = filterkey1;
		var sankeyobject;
		var result = filteredDataSankey(country);
		if (filterkey1 === "England") {
			sankeyobject = datasankeyEnglandForResearch(country, result);
		}
		else {

			sankeyobject = datasankeyForResearch(country, result);
		}


		return sankeyobject;

	}


	// function to get data using filters
	function filteredDataSankey(country) {
		var r = data.filter(function (row) {
			return (row["geo"] == country)
		})
		return r
	}


	function datasankeyForResearch(country, data) {
		var nodes = []
		var links = []
		var i = 0
		var nestedData = d3.nest()
			.key(function (d) { return d["Institution name"]; })
			.rollup(function (values) { return d3.sum(values, function (d) { return d["FTE Category A staff submitted"]; }) })
			.entries(data);

		nodes.push({ "node": i, "name": country })
		ii = i
		i = 1
		nestedData.forEach(function (uni) {
			var univ = uni.key
			nodes.push({ "node": i, "name": univ })
			var univ = uni.value;
			links.push({ "source": ii + i, "target": ii, "value": univ })
			i++
		})

		var obj = { "nodes": nodes, "links": links }
		return obj
	}

	function datasankeyEnglandForResearch(country, data) {
		var nodes = []
		var links = []
		var i = 0
		var nestedData = d3.nest()
			.key(function (d) { return d["Institution name"]; })
			.rollup(function (values) { return d3.sum(values, function (d) { return d["FTE Category A staff submitted"]; }) })
			//  .sortValues(d3.Descending)
			.entries(data);


		nestedData.sort(function (a, b) {
			return b.value - a.value;
		});

		var newnestedData = nestedData.slice(0, 10);

		nodes.push({ "node": i, "name": country })
		ii = i
		i = 1
		newnestedData.forEach(function (uni) {
			var univ = uni.key
			nodes.push({ "node": i, "name": univ })
			var univ = uni.value;
			links.push({ "source": ii + i, "target": ii, "value": univ })
			i++
		})

		var obj = { "nodes": nodes, "links": links }
		return obj

	}



	//-----------------------Managment section-------------------------
	dmObj.pieForManagment1 = function () {
		var nestedData = d3.nest()
			.key(function (d) { return d[layoutskey1]; })
			// .sortKeys(d3.ascending)
			.rollup(function (values) { return d3.sum(values, function (d) { return d["4*"]; }) })
			.entries(filteredDataManagment(filterkey1));
		return nestedData;
	}

	dmObj.pieForManagment2 = function () {
		var nestedData = d3.nest()
			.key(function (d) { return d[layoutskey2]; })
			// .sortKeys(d3.ascending)
			.rollup(function (values) { return d3.sum(values, function (d) { return d["4*"]; }) })
			.entries(filteredDataManagment(filterkey2));

		return nestedData;
	}

	dmObj.pieForManagment3 = function () {
		var nestedData = d3.nest()
			.key(function (d) { return d[layoutskey3]; })
			// .sortKeys(d3.ascending)
			.rollup(function (values) { return d3.sum(values, function (d) { return d["4*"]; }) })
			.entries(filteredDataManagment(filterkey3));
		return nestedData;
	}

	dmObj.barForManagment = function () {
		var dataforbar = []
		var result = filteredDataManagmentForBar(filterkey3)
		result.forEach(function (uni) {
			dataforbar.push({ key: uni["Institution name"], value: uni["4*"] })
		})

		if (filterkey1 === "England") {

			dataforbar.sort(function (a, b) {
				return b.value - a.value;
			});

			var newdataforbar = dataforbar.slice(0, 10);
			return newdataforbar
		}



		return dataforbar;
	}


	dmObj.treeForMangment = function () {

		var hierarchyJSON = createJSONhierarchy(filteredDataTree(), root,
			["Institution name", "Unit of assessment name"])
		return hierarchyJSON;
	}



	// function to get data using filters
	function filteredDataManagment(filterkey) {

		var r = dataset.filter(function (row) {
			return ((row["geo"] == filterkey) || row["Institution name"] == filterkey
			) && (row["Profile"] == filterkey5)

				|| (row["Unit of assessment name"] == filterkey && row["Institution name"] == filterkey2)
		})
		return r
	}

	function filteredDataManagmentForBar(filterkey) {
		var r = dataset.filter(function (row) {
			return (row["Unit of assessment name"] == filterkey) && (row["geo"] == filterkey1) && (row["Profile"] == filterkey5)
		})
		return r
	}


	dmObj.sankeyForManagment = function () {

		var country = filterkey1;
		var sankeyobject;
		var result = filteredDataSankey(country);
		if (filterkey1 === "England") {
			sankeyobject = datasankeyEnglandForManagment(country, result);
		}
		else {

			sankeyobject = datasankeyForManagment(country, result);
		}


		return sankeyobject;

	}




	function datasankeyForManagment(country, data) {
		var nodes = []
		var links = []
		var i = 0
		var nestedData = d3.nest()
			.key(function (d) { return d["Institution name"]; })
			.rollup(function (values) { return d3.sum(values, function (d) { return d["4*"]; }) })
			.entries(data);
		
		nodes.push({ "node": i, "name": country })
		ii = i
			i = 1
		nestedData.forEach(function (uni) {
			var univ = uni.key
			nodes.push({ "node": i, "name": univ })
			var univ = uni.value;
			links.push({ "source": ii + i, "target": ii, "value": univ })
			i++
		})

		var obj = { "nodes": nodes, "links": links }
		return obj
	}

	function datasankeyEnglandForManagment(country, data) {
		var nodes = []
		var links = []
		var i = 0
		var nestedData = d3.nest()
			.key(function (d) { return d["Institution name"]; })
			.rollup(function (values) { return d3.sum(values, function (d) { return d["4*"]; }) })
			//  .sortValues(d3.Descending)
			.entries(data);


		nestedData.sort(function (a, b) {
			return b.value - a.value;
		});

		var newnestedData = nestedData.slice(0, 10);
		
		nodes.push({ "node": i, "name": country })
		ii = i
			i = 1
		newnestedData.forEach(function (uni) {
			var univ = uni.key
			nodes.push({ "node": i, "name": univ })
			var univ = uni.value;
			links.push({ "source": ii + i, "target": ii, "value": univ })
			i++
		})

		var obj = { "nodes": nodes, "links": links }
		return obj

	}
	//-----------------------Collaborators section-------------------------

	dmObj.pieForColla1 = function () {
		var nestedData = d3.nest()
			.key(function (d) { return d[layoutskey1]; })
				.rollup(function (values) { return d3.sum(values, function (d) { return d["4*"]; }) })
			.entries(filteredDataColla(filterkey1));
		return nestedData;
	}
	dmObj.pieForColla2 = function () {
		var nestedData = d3.nest()
			.key(function (d) { return d[layoutskey2]; })
				.rollup(function (values) { return d3.sum(values, function (d) { return d["4*"]; }) })
			.entries(filteredDataColla(filterkey2));

		return nestedData;
	}

	dmObj.pieForColla3 = function () {
		var nestedData = d3.nest()
			.key(function (d) { return d[layoutskey3]; })
				.rollup(function (values) { return d3.sum(values, function (d) { return d["4*"]; }) })
			.entries(filteredDataColla(filterkey3));
			return nestedData;
	}

	dmObj.treeForColla = function () {
		
		var hierarchyJSON = createJSONhierarchy(filteredDataTree(), root,
			["Institution name", "Unit of assessment name"])
			return hierarchyJSON;
	}

	dmObj.barForColla = function () {
		var dataforbar = []
		var result = filteredDataCollaForBar(filterkey3)
		result.forEach(function (uni) {
			var fte = parseInt(uni["FTE Category A staff submitted"])
			var fourStar = parseInt(uni["4*"])
			var threeStar = parseInt(uni["3*"])
			var twoStar = parseInt(uni["2*"])
			var oneStar = parseInt(uni["1*"])

			var average = (fte + fourStar + threeStar + twoStar + oneStar) / 5;

			dataforbar.push({ key: uni["Institution name"], value: average })
		})
		if (filterkey1 === "England") {

			dataforbar.sort(function (a, b) {
				return b.value - a.value;
			});

			var newdataforbar = dataforbar.slice(0, 10);
			return newdataforbar
		}
		return dataforbar;
	}


	// function to get data using filters
	function filteredDataColla(filterkey) {
		var r = dataset.filter(function (row) {
			return ((row["geo"] == filterkey) || row["Institution name"] == filterkey
			) && (row["Profile"] == "Impact")

				|| (row["Unit of assessment name"] == filterkey && row["Institution name"] == filterkey2)
		})
			return r
	}

	function filteredDataCollaForBar(filterkey) {
		var r = dataset.filter(function (row) {
			return (row["Unit of assessment name"] == filterkey) && (row["geo"] == filterkey1) && (row["Profile"] == filterkey5)
		})
		return r
	}



	dmObj.sankeyForColla = function () {

		var country = filterkey1;
		var sankeyobject;
		var result = filteredDataSankey(country);
		if (filterkey1 === "England") {
			sankeyobject = datasankeyEnglandForColla(country, result);
		}
		else {

			sankeyobject = datasankeyForColla(country, result);
		}


			return sankeyobject;

	}




	function datasankeyForColla(country, data) {
		var nodes = []
		var links = []
		var i = 0
		var nestedData = d3.nest()
			.key(function (d) { return d["Institution name"]; })
			.rollup(function (values) { return d3.sum(values, function (d) { return d["3*"]; }) })
			.entries(data);
	
		nodes.push({ "node": i, "name": country })
		ii = i
			i = 1
		nestedData.forEach(function (uni) {
			var univ = uni.key
			nodes.push({ "node": i, "name": univ })
			var univ = uni.value;
			links.push({ "source": ii + i, "target": ii, "value": univ })
			i++
		})

		var obj = { "nodes": nodes, "links": links }
		return obj
	}

	function datasankeyEnglandForColla(country, data) {
		var nodes = []
		var links = []
		var i = 0
		var nestedData = d3.nest()
			.key(function (d) { return d["Institution name"]; })
			.rollup(function (values) { return d3.sum(values, function (d) { return d["3*"]; }) })
			.entries(data);


		nestedData.sort(function (a, b) {
			return b.value - a.value;
		});

		var newnestedData = nestedData.slice(0, 10);
		
		nodes.push({ "node": i, "name": country })
		ii = i
		i = 1
		newnestedData.forEach(function (uni) {
			var univ = uni.key
			nodes.push({ "node": i, "name": univ })
			var univ = uni.value;
			links.push({ "source": ii + i, "target": ii, "value": univ })
			i++
		})

		var obj = { "nodes": nodes, "links": links }
		return obj

	}




	return dmObj; // returning the main object
}







function createJSONhierarchy(flatDataset, rootKey, keys) {
	var hierarchy = d3.nest();
	keys.forEach(applyKey);

	function applyKey(key, i) {
		hierarchy = hierarchy
			.key(function (d) {
				return d[key];
			});
	}
	hierarchy.rollup(function (v) {
		return v.length;
	})

	hierarchy = hierarchy.entries(flatDataset);
	if (hierarchy.length === 1) {
			return hierarchy[0]
	}
	//Return single top node called the value of rootKey
	return { "key": rootKey, "values": hierarchy }
}





