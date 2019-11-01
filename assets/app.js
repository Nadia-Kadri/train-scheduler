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

});

database.ref().on("child_added", function(snapshot) {

    let trainName = snapshot.val().name;
    let destination = snapshot.val().destination;
    let firstTime = snapshot.val().time;
    let frequency = snapshot.val().frequency;

    console.log(`name: ${trainName}`)
    console.log(`destination: ${destination}`)
    console.log(`train start: ${firstTime}`)
    console.log(`comes every: ${frequency} minutes`)

    let firstTimeConverted = moment(firstTime, "HH:mm").format("hh:mm a")
    console.log(`train start momentjs: ${firstTimeConverted}`);

    let timeNow = moment().format("hh:mm a")
    console.log(`time now momentjs: ${timeNow}`)

    let timeDiff = moment().diff(moment(firstTime, "HH:mm"), "minutes")
    console.log(`difference between train start and now: ${timeDiff} minutes`)

    let timeRemainder = timeDiff % frequency;
    console.log(timeRemainder);
    let minutesAway = frequency - timeRemainder;
    console.log(minutesAway);

    let nextTrain = moment().add(minutesAway, "minutes");
    let nextTrainConverted = moment(nextTrain).format("hh:mm a")
    console.log(nextTrainConverted)

    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextTrainConverted),
        $("<td>").text(minutesAway)
      );

    $("#train-schedule").append(newRow);

});