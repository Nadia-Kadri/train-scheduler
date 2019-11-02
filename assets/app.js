var firebaseConfig = {
    apiKey: "AIzaSyAX3NBJngTZnGnXCWRprJPr4PEbuN_IA2o",
    databaseURL: "https://train-schedule-1f34e.firebaseio.com",
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$("#run-search").on("click", function (event) {

    event.preventDefault();

    let trainName = $("#train-name-search").val().trim();
    let destination = $("#destination-search").val().trim();
    let firstTime = $("#first-time-search").val().trim();
    let frequency = $("#frequency-search").val().trim();

    if (trainName === "" || destination === "" || firstTime === "" || frequency === "") {
        $("#error").html("Please complete all fields")
        return;
    }

    if ((moment(firstTime, "HH:mm", true).format() === "Invalid date") && (isNaN(frequency))) {
        $("#error").html("Please enter date in specified format<br>Please enter a number in frequency field")
        return;
    }

    if (moment(firstTime, "HH:mm", true).format() === "Invalid date") {
        $("#error").html("Please enter date in specified format")
        return;
    }

    if (isNaN(frequency)) {
        $("#error").html("Please enter a number in frequency field")
        return;
    }

    database.ref().push({
        name: trainName,
        destination: destination,
        time: firstTime,
        frequency: frequency
    });

    $("#train-name-search").val("")
    $("#destination-search").val("")
    $("#first-time-search").val("")
    $("#frequency-search").val("")
    $("#error").html("")

});

database.ref().on("child_added", function(snapshot) {

    let trainName = snapshot.val().name;
    let destination = snapshot.val().destination;
    let firstTime = snapshot.val().time;
    let frequency = snapshot.val().frequency;

    let firstTimeConverted = moment(firstTime, "HH:mm").format("hh:mm a")
    let timeDiff = moment().diff(moment(firstTime, "HH:mm"), "minutes")

    console.log(`Name: ${trainName}`)
    console.log(`Destination: ${destination}`)
    console.log(`Train start: ${firstTimeConverted}`)
    console.log(`Comes every: ${frequency} minutes`)

    let timeNow = moment().format("hh:mm a")
    console.log(`Time now: ${timeNow}`)
    
    if(timeDiff > 0) {
        let timeRemainder = timeDiff % frequency;

        if (timeRemainder === 0) {
            console.log("Train is in station")
            console.log("--------------------------")
    
            var newRow = $("<tr>").append(
                $("<td>").text(trainName),
                $("<td>").text(destination),
                $("<td>").text(firstTimeConverted),
                $("<td>").text(frequency),
                $("<td>").text("BOARDING NOW"),
                $("<td>").text("BOARDING NOW")
              );
        
            $("#train-schedule").append(newRow);
        } else {
            let minutesAway = frequency - timeRemainder;

            let nextTrain = moment().add(minutesAway, "minutes");
            let nextTrainConverted = moment(nextTrain).format("hh:mm a")
            console.log(`Next train: ${nextTrainConverted}`)
            console.log("--------------------------")

            var newRow = $("<tr>").append(
                $("<td>").text(trainName),
                $("<td>").text(destination),
                $("<td>").text(firstTimeConverted),
                $("<td>").text(frequency),
                $("<td>").text(nextTrainConverted),
                $("<td>").text(minutesAway)
            );
        
            $("#train-schedule").append(newRow);
        }
    } else if (timeDiff < 0) {
        let nextTrainConverted = firstTimeConverted
        console.log(`Next train: ${nextTrainConverted}`)
        console.log("--------------------------")

        let minutesAway = moment(nextTrainConverted, "hh:mm a").diff(moment(), "minutes") + 1

        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(firstTimeConverted),
            $("<td>").text(frequency),
            $("<td>").text(nextTrainConverted),
            $("<td>").text(minutesAway)
          );
    
        $("#train-schedule").append(newRow);
    } else {
        console.log("Train is in station")
        console.log("--------------------------")

        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(firstTimeConverted),
            $("<td>").text(frequency),
            $("<td>").text("BOARDING NOW"),
            $("<td>").text("BOARDING NOW")
          );
    
        $("#train-schedule").append(newRow);
    }
});


