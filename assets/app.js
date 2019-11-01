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
    let firstTrainTime = $("#first-time-search").val().trim();
    let frequency = $("#frequency-search").val().trim();

    database.ref().push({
        name: trainName,
        destination: destination,
        first: firstTrainTime,
        frequency: frequency
    });

    $("#train-name-search").val("")
    $("#destination-search").val("")
    $("#first-time-search").val("")
    $("#frequency-search").val("")

});
