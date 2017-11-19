/*-------------------------------------------------------------------- 
  
– Author:MHD Rateb Alissa
– Date: 17/11/2017
– References :Lab example
– Overall function of the code: get the dataset and prepare it
– The percentage of code written by the student ‘author’:40%
– The percentage of code taken from course examples:60%
  
---------------------------------------------------------------------- */


function getData(callback) {
    
        //Read REF2014 data
        d3.csv("csvFiles/REF2014_Results.csv", function (csvData) {
            var ref14data = csvData;
        //    console.log("ref14data= ", ref14data);
    
            //Now read learning-providers-plus.csv
            d3.csv("csvFiles/learning-providers-plus.csv", function (csvData) {
                var learningProviders = csvData;
           //     console.log("learningProviders = ", learningProviders);

           combineCSVdata(ref14data, learningProviders);
           processData(ref14data);
           
           d3.json("maps/uk.json", function (error, uk) {
            
                        //Extract extract and convert subunits (region and county shapes) from TopoJSON into to GeoJSON
                        var countries = topojson.feature(uk, uk.objects.subunits).features;
                        //Ditto for places (towns and cities)
                        var towns = topojson.feature(uk, uk.objects.places).features;
                   
           
                combineCSVdata2(ref14data, countries);
                
                callback(ref14data);
                    });


                

    
            })
        })
    
    }
    
    
    //======================== FUNCTIONS =================================
    function combineCSVdata(ref14data, learningProviders) {
       // console.log("\n\nFUNCTION: findREFunisWithNoEntryInLearningProvidersPlus\n")
    
        // For each learning provider university - add learning provider entry as field
        // 'lp' in relevant REF14 table entry
        learningProviders.forEach(processUniversity);
    
        function processUniversity(learningProvider) {
            ref14data.forEach(function (ref14entry) {
                if (ref14entry["Institution code (UKPRN)"] == learningProvider.UKPRN) {
                    ref14entry.lp = learningProvider;
                    //console.log("ref14entry = ", ref14entry)
                }
    
            })
    
        }
    }

    function combineCSVdata2(ref14data, countries) {
        ref14data.country=countries;

     }
//this function to bind country based on university number
    function processData(dataset) {
      //  console.log(dataset)

        var envirArray = [];
        var avgEngland=0;
        var avgScotland=0;
        var avgWales=0;
        var avgInland=0;

        for (var i = 0; i < dataset.length; i++) {

            if (parseFloat(dataset[i]["Institution sort order"]) >= 6670 && parseFloat(dataset[i]["Institution sort order"]) <= 6910) {
                dataset[i].geo = "Scotland";
                }
           else if (parseFloat(dataset[i]["Institution sort order"]) >= 1 && parseFloat(dataset[i]["Institution sort order"]) <= 2000) {
                dataset[i].geo = "England";
                 }
            else if (parseFloat(dataset[i]["Institution sort order"]) >= 7000 && parseFloat(dataset[i]["Institution sort order"]) <= 7300) {
                dataset[i].geo = "Wales";
                }
            else{
                dataset[i].geo = "N. Ireland";
                    
            }
        }
      
   

    }
    
