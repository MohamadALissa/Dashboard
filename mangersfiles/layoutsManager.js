/*-------------------------------------------------------------------- 
  
– Author:MHD Rateb Alissa
– Date: 17/11/2017
– Overall function of the code: to bring data from datamanager and send it to layouts
– The percentage of code written by the student ‘author’:100%
– The percentage of code taken from course examples:0%
  
---------------------------------------------------------------------- */


var dataManager = {};

function layouts(data) {
//initlize datamanger object to use the functions from datamanger file
	dataManager = dataManagerFiles(data);
	//to create layouts
	makePage();
}


function makePage() {
	

//pie1-show all unis in given country
//pie2-show the uoa of given uni
//pie3-show the profiles for given uoa
//bar-user1-show 4*,3*,2*,1* for one profile
//bar-user2-show 4*,3*,2*,1* for one profile
	
	//interaction
	//interactions are sharble between all the users
	//interaction pie1-choose one uni 
	pie1.overrideMouseClick(function (d) {
		dataManager.setUniversity(d.data.key)
		dataManager.underStandTree(d.data.key)
		dataManager.diplaytitle()

		map1.drawCircle(d.data.key)

		reRender();
	})

	pie2.overrideMouseClick(function (d) {
		dataManager.setUOA(d.data.key)
		dataManager.underStandTree(d.data.key)
		dataManager.diplaytitle()
		reRender();
	})

	pie3.overrideMouseClick(function (d) {
		dataManager.setProfile(d.data.key)
		dataManager.diplaytitle()
		reRender(true);
	})
	//interaction map with pie
	map1.overrideMouseClickcountry(function (d) {
			dataManager.setCountry(d.properties.name)
		dataManager.underStandTree(d.properties.name)
		dataManager.diplaytitle()
		reRender();
	})
	map1.overrideMouseClickunis(function (d) {
		dataManager.setUniversity(d.key)
		dataManager.underStandTree(d.key)
		dataManager.diplaytitle()
		reRender();
	})

	tree1.leafLabelFn(function (d) { return d.data["key"] });
	tree1.appendToClick(function (d) {
			dataManager.setlayoutKey(d)
		reRender(true);
		//Your additional code here 
		//(e.g. in case you want interaction with other layouts)
		if (d.height == 0) console.log("leaf node clicked, d=", d)
		dataManager.diplaytitle()
	});

	pack1.appendToClick(function (d) {
		dataManager.setlayoutKey(d)
		dataManager.underStandTree(d.data.key)
		reRender(false);
				dataManager.diplaytitle(true)
	});
	
	sankey1.appendToClick(function (d) {
		dataManager.setUniversity(d.source.name)
		dataManager.underStandTree(d.source.name)
		map1.drawCircle(d.source.name)
		reRender();
				dataManager.diplaytitle()
	});
	
	//-----------------------Research section-------------------------
	if (userType == 'research') {
		//understand the defult hirichay data of tree
		dataManager.underStandTree("Scotland")
		dataManager.setProfile("Outputs");
		dataManager.diplaytitle();
		//research render
		//render pie
		pie1.loadAndRenderDataset(dataManager.pieForReasearch1());
		pie2.loadAndRenderDataset(dataManager.pieForReasearch2());
		pie3.loadAndRenderDataset(dataManager.pieForReasearch3());
		//render bar
		bar1.overrideDataFieldFunction(function (d) { return d.value });
		bar1.overrideLabelAccessor(function (d) { return d.key });
		bar1.loadAndRenderDataset(dataManager.barForReasearch());
		//render map
		map1.loadAndRender(dataManager.mapData());

		
		tree1.loadAndRenderDataset(dataManager.treeForResearch());


		pack1.loadAndRenderDataset(dataManager.packForResearch());

		sankey1.loadAndRenderDataset(dataManager.sankeyForResearch());


	}
	//-----------------------Managment section-------------------------
	if (userType == 'management') {
		//understand the defult hirichay data of tree
		dataManager.underStandTree("Heriot-Watt University")
		dataManager.setProfile("Overall");
		dataManager.diplaytitle();
		//managment render
		//render pie
		pie1.loadAndRenderDataset(dataManager.pieForManagment1());
		pie2.loadAndRenderDataset(dataManager.pieForManagment2());
		pie3.loadAndRenderDataset(dataManager.pieForManagment3());
		//render bar
		bar1.overrideDataFieldFunction(function (d) { return d.value });
		bar1.overrideLabelAccessor(function (d) { return d.key });
		bar1.loadAndRenderDataset(dataManager.barForManagment());
		//render map
		map1.loadAndRender(dataManager.mapData());

		//render tree
		tree1.loadAndRenderDataset(dataManager.treeForMangment());

		pack1.loadAndRenderDataset(dataManager.packForResearch());
		
		sankey1.loadAndRenderDataset(dataManager.sankeyForManagment());

	}

	//-----------------------Collaborators section-------------------------
	if (userType == 'Collaborators') {
		//understand the defult hirichay data of tree
		dataManager.underStandTree("Computer Science and Informatics")
		dataManager.setProfile("Impact");
		dataManager.diplaytitle();
		//managment render
		//render pie
		pie1.loadAndRenderDataset(dataManager.pieForColla1());
		pie2.loadAndRenderDataset(dataManager.pieForColla2());
		pie3.loadAndRenderDataset(dataManager.pieForColla3());
		//render bar
		bar1.overrideDataFieldFunction(function (d) { return d.value });
		bar1.overrideLabelAccessor(function (d) { return d.key });
		bar1.loadAndRenderDataset(dataManager.barForColla());
		//render map
		map1.loadAndRender(dataManager.mapData());

		//render tree
		tree1.loadAndRenderDataset(dataManager.treeForColla());

		pack1.loadAndRenderDataset(dataManager.packForResearch());
		sankey1.loadAndRenderDataset(dataManager.sankeyForColla());
		
		
	}






	//rerender section
	function reRender(treeRender) {

		if (userType == 'research') {
			//render every thing 
			if (treeRender === undefined) {
				pie1.loadAndRenderDataset(dataManager.pieForReasearch1());
				pie2.loadAndRenderDataset(dataManager.pieForReasearch2());
				pie3.loadAndRenderDataset(dataManager.pieForReasearch3());
				bar1.overrideDataFieldFunction(function (d) { return d.value });
				bar1.overrideLabelAccessor(function (d) { return d.key });
				bar1.loadAndRenderDataset(dataManager.barForReasearch());
				tree1.loadAndRenderDataset(dataManager.treeForResearch());
				pack1.loadAndRenderDataset(dataManager.packForResearch());
				sankey1.loadAndRenderDataset(dataManager.sankeyForResearch());

			}
			//render every thing except tree
			if (treeRender === true) {
				pie1.loadAndRenderDataset(dataManager.pieForReasearch1());
				pie2.loadAndRenderDataset(dataManager.pieForReasearch2());
				pie3.loadAndRenderDataset(dataManager.pieForReasearch3());
				bar1.overrideDataFieldFunction(function (d) { return d.value });
				bar1.overrideLabelAccessor(function (d) { return d.key });
				bar1.loadAndRenderDataset(dataManager.barForReasearch());
				//tree1.loadAndRenderDataset(dataManager.treeForResearch());
				pack1.loadAndRenderDataset(dataManager.packForResearch());
				

			}
			//render every thing except pack
			if (treeRender === false) {
				pie1.loadAndRenderDataset(dataManager.pieForReasearch1());
				pie2.loadAndRenderDataset(dataManager.pieForReasearch2());
				pie3.loadAndRenderDataset(dataManager.pieForReasearch3());
				bar1.overrideDataFieldFunction(function (d) { return d.value });
				bar1.overrideLabelAccessor(function (d) { return d.key });
				bar1.loadAndRenderDataset(dataManager.barForReasearch());
				tree1.loadAndRenderDataset(dataManager.treeForResearch());
			}

		}



		if (userType == 'management') {
			//render every thing 
			if (treeRender === undefined) {
				pie1.loadAndRenderDataset(dataManager.pieForManagment1());
				pie2.loadAndRenderDataset(dataManager.pieForManagment2());
				pie3.loadAndRenderDataset(dataManager.pieForManagment3());
				bar1.overrideDataFieldFunction(function (d) { return d.value });
				bar1.overrideLabelAccessor(function (d) { return d.key });
				bar1.loadAndRenderDataset(dataManager.barForManagment());
				tree1.loadAndRenderDataset(dataManager.treeForMangment());
				pack1.loadAndRenderDataset(dataManager.packForResearch());
				sankey1.loadAndRenderDataset(dataManager.sankeyForManagment());
			}
			//render every thing except tree
			if (treeRender === true) {
				pie1.loadAndRenderDataset(dataManager.pieForManagment1());
				pie2.loadAndRenderDataset(dataManager.pieForManagment2());
				pie3.loadAndRenderDataset(dataManager.pieForManagment3());
				bar1.overrideDataFieldFunction(function (d) { return d.value });
				bar1.overrideLabelAccessor(function (d) { return d.key });
				bar1.loadAndRenderDataset(dataManager.barForManagment());
				//tree1.loadAndRenderDataset(dataManager.treeForMangment());
				pack1.loadAndRenderDataset(dataManager.packForResearch());
			}
			//render every thing except pack
			if (treeRender === false) {
				pie1.loadAndRenderDataset(dataManager.pieForManagment1());
				pie2.loadAndRenderDataset(dataManager.pieForManagment2());
				pie3.loadAndRenderDataset(dataManager.pieForManagment3());
				bar1.overrideDataFieldFunction(function (d) { return d.value });
				bar1.overrideLabelAccessor(function (d) { return d.key });
				bar1.loadAndRenderDataset(dataManager.barForManagment());
				tree1.loadAndRenderDataset(dataManager.treeForMangment());
			}


		}



		if (userType == 'Collaborators') {
			//render every thing 
			if (treeRender === undefined) {
				pie1.loadAndRenderDataset(dataManager.pieForColla1());
				pie2.loadAndRenderDataset(dataManager.pieForColla2());
				pie3.loadAndRenderDataset(dataManager.pieForColla3());
				bar1.overrideDataFieldFunction(function (d) { return d.value });
				bar1.overrideLabelAccessor(function (d) { return d.key });
				bar1.loadAndRenderDataset(dataManager.barForColla());
				map1.loadAndRender(dataManager.mapData());
				tree1.loadAndRenderDataset(dataManager.treeForColla());
				pack1.loadAndRenderDataset(dataManager.packForResearch());
				sankey1.loadAndRenderDataset(dataManager.sankeyForColla());
			}

			//render every thing except tree
			if (treeRender === true) {
				pie1.loadAndRenderDataset(dataManager.pieForColla1());
				pie2.loadAndRenderDataset(dataManager.pieForColla2());
				pie3.loadAndRenderDataset(dataManager.pieForColla3());
				bar1.overrideDataFieldFunction(function (d) { return d.value });
				bar1.overrideLabelAccessor(function (d) { return d.key });
				bar1.loadAndRenderDataset(dataManager.barForColla());
				map1.loadAndRender(dataManager.mapData());
				//tree1.loadAndRenderDataset(dataManager.treeForColla());
				pack1.loadAndRenderDataset(dataManager.packForResearch());
			}
			//render every thing except pack
			if (treeRender === false) {
				pie1.loadAndRenderDataset(dataManager.pieForColla1());
				pie2.loadAndRenderDataset(dataManager.pieForColla2());
				pie3.loadAndRenderDataset(dataManager.pieForColla3());
				bar1.overrideDataFieldFunction(function (d) { return d.value });
				bar1.overrideLabelAccessor(function (d) { return d.key });
				bar1.loadAndRenderDataset(dataManager.barForColla());
				map1.loadAndRender(dataManager.mapData());
				tree1.loadAndRenderDataset(dataManager.treeForColla());
			}

		}



	}
	
	function reRenderBar(){
		if (userType == 'research') {
			bar1.overrideDataFieldFunction(function (d) { return d.value });
			bar1.overrideLabelAccessor(function (d) { return d.key });
			bar1.loadAndRenderDataset(dataManager.barForReasearch());

		}
		if (userType == 'management') {
			bar1.overrideDataFieldFunction(function (d) { return d.value });
			bar1.overrideLabelAccessor(function (d) { return d.key });
			bar1.loadAndRenderDataset(dataManager.barForManagment());
		}
		if (userType == 'Collaborators') {
			bar1.overrideDataFieldFunction(function (d) { return d.value });
			bar1.overrideLabelAccessor(function (d) { return d.key });
			bar1.loadAndRenderDataset(dataManager.barForColla());
		}
	}

}